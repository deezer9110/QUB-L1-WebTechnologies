//level references
let game = document.getElementById("game");
let gameUI = document.getElementById("gameUI");
let scoreUI = document.getElementById("scoreUI");
let bulletCountUI = document.getElementById("bulletCountUI");
let bullets = bulletCountUI.children; //used for changing bullet images to empty 
let gameBackground = document.getElementById("gameBackground");
let progressFill = document.getElementById("progressFill")
let tips = document.getElementById("tips");
let gunImg = document.getElementById("gunImg");

// UI values
let score = 0;
let ticks = 0;

// Difficulty References
let currentLevel = Number(localStorage.getItem("currentLevel"));
//currentLevel = 2; // Use to override which level you want

//2D array of data for bottle spawns
const positionsAlongShelves = [
  //shelf 1 positions
  [
    { occupied: false, top: "6.5vh", left: "5vw" },
    { occupied: false, top: "6.5vh", left: "10vw" },
    { occupied: false, top: "6.5vh", left: "15vw" },
    { occupied: false, top: "6.5vh", left: "20vw" },
  ],
  //shelf 2 positions
  [
    { occupied: false, top: "6.5vh", left: "40vw" },
    { occupied: false, top: "6.5vh", left: "45vw" },
    { occupied: false, top: "6.5vh", left: "50vw" },
    { occupied: false, top: "6.5vh", left: "55vw" },
  ],
  //shelf 3 positions
  [
    { occupied: false, top: "21.5vh", left: "22vw" },
    { occupied: false, top: "21.5vh", left: "27.5vw" },
    { occupied: false, top: "21.5vh", left: "31.5vw" },
    { occupied: false, top: "21.5vh", left: "38vw" },
  ],
  // Shelf 4 positions
  [
    { occupied: false, top: "38vh", left: "5vw" },
    { occupied: false, top: "38vh", left: "10vw" },
    { occupied: false, top: "38vh", left: "15vw" },
    { occupied: false, top: "38vh", left: "20vw" },
    { occupied: false, top: "38vh", left: "25vw" },
    { occupied: false, top: "38vh", left: "30vw" },
    { occupied: false, top: "38vh", left: "35vw" },
    { occupied: false, top: "38vh", left: "40vw" },
    { occupied: false, top: "38vh", left: "45vw" },
    { occupied: false, top: "38vh", left: "50vw" },
    { occupied: false, top: "38vh", left: "55vw" },
  ],
];

let levelType = "duck"; // Level type for changing target types and if the order of levels changes
let targetImage =
  "https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-yellow-rubber-duck-toy-icon-png-image_5228414.png";
let hitSrcAudio = new Audio("Audio/duckMiss.mp3");
let missSrcAudio = new Audio("Audio/duckHit.mp3");
let duration = 4000;
let targetWidth = 100;
let targetHeight = 100;
let timeLeft = 30;
let totalTime = 30;

scoreUI.innerHTML = `| SCORE: ${score}`;

// Gun related things
let bulletCount = 4;
document.body.addEventListener(
  // Tracks clicks on the screen anywhere

  "click",
  (e) => {
    if (bulletCount > 0) {
      // Creating bang from bullet impact on page
      let bang = document.createElement("div");
      bang.setAttribute("class", "bang");
      img = document.createElement("img");
      img.src =
        "https://www.pngall.com/wp-content/uploads/15/Cartoon-Explosion-PNG-Image.png";
      img.setAttribute("width", "100%");
      img.setAttribute("height", "100%");
      bang.appendChild(img);

      // Finds mouse on screen location
      bang.style.left = e.clientX + "px";
      bang.style.top = e.clientY + "px";

      bang.style.zIndex = 5;

      document.body.appendChild(bang); // Adds bang to page

      // Playing audio
      bangSound = new Audio("Audio/bang.mp3");
      bangSound.play();
      bangAnim = bang.animate(
        // Bang animation
        [{ transform: "scale(5)" }, { transform: "scale(0.5)", opacity: 0 }],
        {
          duration: 500,
        }
      );

      // Removes it on finish
      bangAnim.onfinish = () => {
        bang.remove();
      };
    }

    bulletCount--;

    if (bulletCount < 0) {
      // Shows when no bullets are left
      tips.textContent = "Click R to Reload";
    }
    else
    {
      bullets[bulletCount].src = "https://staging.svgrepo.com/show/181627/bullet-weapons.svg";
    }
  },
  true
);

document.body.addEventListener("keydown", (e) => {
  // Key listener for pressing R to reload, can be done at any stage
  if (e.key == "r") {
    reloadSound = new Audio("Audio/reload.mp3");
    reloadSound.play();
    setTimeout(() => {
      // Adds delay for reloading
      bulletCount = 4;
      tips.textContent = ""; //clearing tip if it's there
      //resetting all bullet images back to full
      bullets[0].src = "Images/bullet.png";
      bullets[1].src = "Images/bullet.png";
      bullets[2].src = "Images/bullet.png";
      bullets[3].src = "Images/bullet.png";
    }, 2000);
  }
});

// Sets difficulty depending on current level
switch (currentLevel) {
  case 1: // Already set
    break;
  case 2:
    gameBackground.src = "Images/Balloon Round.png";
    levelType = "balloon";
    targetImage =
      "https://static.vecteezy.com/system/resources/previews/018/931/275/original/cartoon-balloon-icon-png.png";
    hitSrcAudio = new Audio("Audio/balloonPop.mp3");
    missSrcAudio = new Audio("Audio/balloonMiss.mp3");
    duration = 6000;
    targetWidth = 120;
    targetHeight = 120;
    timeLeft = 30;
    totalTime = 30;
    break;
  case 3:
    gameBackground.src = "Images/MilkBottle.png";
    levelType = "milk";
    targetImage = "https://cdn-icons-png.flaticon.com/512/2049/2049109.png";
    hitSrcAudio = new Audio("Audio/milkHit.mp3");
    missSrcAudio = null;
    duration = 4000;
    targetWidth = 60;
    targetHeight = 60;
    timeLeft = 30;
    totalTime = 30;
    break;
}

//Function for calculating random with min and max
const rand = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//Function responsible for rendering the game loop and spawning targets periodically.
const gameRender = function () {
  let spawnRate = 75;
  if(ticks >= 1000){ // Creates starting targets
    spawnRate = 125;
  }
  ticks++;
  window.requestAnimationFrame(gameRender);

  if (ticks % spawnRate == 0) {
    //now using vw
    createTarget(rand(5, 60));
  }
};

//Makes sure gun follows mouse movement 
document.addEventListener('mousemove', function(event) {
  const mouseX = event.clientX;
  const offset = -4.5;

  // Calculate the position relative to the viewport width
  const positionRelativeToViewport = (mouseX - gunImg.width / 2) / window.innerWidth * 100;

  gunImg.style.left = `${positionRelativeToViewport + offset}vw`;
});

//Creates target with anim attached + multiple event listeners
//removed random y value as all items use fixed height
const createTarget = function (posX) {
  let target = document.createElement("div");
  target.setAttribute("class", "target");
  target.style.left = `${posX}vw`;
  target.style.width = `${targetWidth}px`;
  target.style.height = `${targetHeight}px`;
  game.appendChild(target);

  // Sets image details
  img = document.createElement("img");
  img.src = targetImage;
  img.setAttribute("width", `${targetWidth}px`);
  img.setAttribute("height", `${targetHeight}px`);
  target.appendChild(img);

  let animTarget;

  switch (levelType) {
    // Makes duck
    case "duck":
      let leftOrRight = rand(1, 2);
      let wavePath = rand(1, 3);

      //middle wave
      if (wavePath == 2) {
        // Puts duck on the left so it starts from there
        target.style.left = "0vw";
        target.style.top = "12vw";

        // Wave / oscillating path
        animTarget = target.animate(
          [
            { transform: "translate(-10vw, -2.5vh)" },
            { transform: "translate(3vw, 2.5vh)" },
            { transform: "translate(16vw, -2.5vh)" },
            { transform: "translate(29vw, 2.5vh)" },
            { transform: "translate(42vw, -2.5vh)" },
            { transform: "translate(55vw, 2.5vh)" },
            { transform: "translate(63vw, -2.5vh)" },
          ],

          {
            duration: duration,
            easing: "cubic-bezier(1, 0.5, 0.5, 1)",
            direction: leftOrRight == 1 ? "normal" : "reverse",
          }
        );
      } else {
        target.style.left = "0vw";
        //if wave path 1 set top to 7vw else wave path 3 height
        target.style.top = wavePath == 1 ? "7vw" : "19vw";

        animTarget = target.animate(
          [
            { transform: "translate(-10vw, 2.5vh)" },
            { transform: "translate(3vw, -2.5vh)" },
            { transform: "translate(16vw, 2.5vh)" },
            { transform: "translate(29vw, -2.5vh)" },
            { transform: "translate(42vw, 2.5vh)" },
            { transform: "translate(55vw, -2.5vh)" },
            { transform: "translate(63vw, 2.5vh)" },
          ],

          {
            duration: duration,
            easing: "cubic-bezier(1, 0.5, 0.5, 1)",
            direction: leftOrRight == 1 ? "normal" : "reverse",
          }
        );
      }
      break;

    case "balloon":
      //Spawning balloons below frame so player does't see them spawn
      target.style.top = "45vh";

      animTarget = target.animate(
        [{ transform: "translateY(10vh)" }, { transform: "translateY(-60vh)" }],
        {
          duration: duration,
          easing: "linear",
          fill: "forwards",
        }
      );
      break;
    case "milk":
      //finding a free slot
      let randomShelfIndex;
      let randomSlotIndex;
      let selectedSlot;
      let checkedAmount = 0;
      do {
        checkedAmount++;
        randomShelfIndex = Math.floor(
          Math.random() * positionsAlongShelves.length
        );
        randomSlotIndex = Math.floor(
          Math.random() * positionsAlongShelves[randomShelfIndex].length
        );

        selectedSlot = positionsAlongShelves[randomShelfIndex][randomSlotIndex];
      } while (
        //setting an upper bound of checks
        //if cannot find a slot in 10 tries wait till next cycle
        //as shelves may be full
        selectedSlot.occupied == true &&
        checkedAmount < 10
      );

      //setting target to that shelf slot
      target.style.top = selectedSlot.top;
      target.style.left = selectedSlot.left;
      //setting that shelf slot as occupied
      positionsAlongShelves[randomShelfIndex][randomSlotIndex].occupied = true;

      break;
  }

  //if anim runs full course without being shot, milk doesn't have anim
  if (levelType != "milk") {
    animTarget.onfinish = () => {
      console.log(`miss`);
      let missAudio = missSrcAudio;
      missAudio.play(); // Plays audio for miss
      game.removeChild(target);
    };
  }

  //if anim gets hit before anim finishes
  target.addEventListener("click", (e) => {
    if (bulletCount >= 0) {
      // Ensures bullets are required to hit a target :D
      console.log("hit");
      let hitAudio = hitSrcAudio;

      hitAudio.play(); // Plays audio for hit

      //this will free the shelf slot if milk level is active
      if (levelType == "milk") {
        freeShelfSlot(target.style.top, target.style.left);
      } else {
        animTarget.pause(); // Stops miss sound from playing
      }
      target.remove();
      score++;
      scoreUI.innerHTML = `| SCORE: ${score}`;
      // Requests death anim for targets using mouse location
      targetDeath(e);
    }
  });
};

// Makes animation work as js animate doesn't actively track left and top positions of elements. Also ensures users can't shoot items mid death animation for extra points
function targetDeath(e) {
  // Target recreation
  let target = document.createElement("div");
  target.setAttribute("class", "target");
  target.style.left = `${e.clientX - targetWidth / 2}px`; // MUST REMAIN IN PX MEASUREMENT AS CLIENTX/Y RETURNS PX ANSWER FOR TOP AND LEFT VALUES
  target.style.top = `${e.clientY - targetHeight / 2}px`;
  target.style.width = `${targetWidth}px`;
  target.style.height = `${targetHeight}px`;
  document.body.appendChild(target);

  // Sets image details
  img = document.createElement("img");
  img.src = targetImage;
  img.setAttribute("width", `${targetWidth}px`);
  img.setAttribute("height", `${targetHeight}px`);
  target.appendChild(img);

  let deathAnim;
  // Balloon animation
  if (levelType == "balloon") {
    deathAnim = target.animate(
      [
        {
          transform: `scale(1.5)`,
        },
        { transform: "scale(0)", opacity: 0 },
      ],
      {
        duration: 500,
        easing: "linear",
        fill: "forwards",
      }
    );
  } else {
    // Other entity animation
    deathAnim = target.animate(
      [
        {
          transform: "translateY(-25px)",
        },
        {
          transform: "translateY(125px)",
          opacity: 0,
        },
      ],
      {
        duration: 500,
        easing: "linear",
      }
    );
  }
  // Removes fake target on death
  deathAnim.onfinish = () => {
    target.remove();
  };
}

function freeShelfSlot(targetTop, targetLeft) {
  for (let shelf of positionsAlongShelves) {
    for (let slot of shelf) {
      if (slot.top === targetTop && slot.left === targetLeft) {
        slot.occupied = false;
        console.log("Slot freed");
        return;
      }
    }
  }
  console.log("Slot to free could not be found");
}

const endLevel = function () {
  switch (
    currentLevel // Sets score based on current level
  ) {
    case 1:
      localStorage.setItem("level1Score", score);
      break;
    case 2:
      localStorage.setItem("level2Score", score);
      break;
    case 3:
      localStorage.setItem("level3Score", score);
      break;
  }
  localStorage.setItem("levelScore", score); // Stores score
  let nextLevel = parseInt(localStorage.getItem("currentLevel")) + 1; // Sets the next level
  localStorage.setItem("currentLevel", nextLevel);
  window.location.href = "endLevel.html";
};

//Check end
const checkEnd = function () {
  timeLeft--;
  let fillPercent = (timeLeft / totalTime) * 95; //calculation for progress bar fill 95 is how much percent width it starts off with
  progressFill.style.width = `${fillPercent}%`;
  if (timeLeft < 0) {
    endLevel();
  }
};

gameRender();

setInterval(checkEnd, 1000);
