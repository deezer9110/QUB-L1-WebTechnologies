// End Level References
let continueBtn = document.getElementById("continueBtn");
let playAgainBtn = document.getElementById("playAgainBtn");
let backToMenuBtn = document.getElementById("backToMenuBtn");
let scoreUI = document.getElementById("score");
let totalScoreUI = document.getElementById("totalScore");
let props = document.getElementById("props");
let clown = document.getElementById("clown");

//for animation times
let duration = 4000;

let milkImage = "https://cdn-icons-png.flaticon.com/512/2049/2049109.png";
let duckImage =
  "https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-yellow-rubber-duck-toy-icon-png-image_5228414.png";

// Score References
let score = parseInt(localStorage.getItem("levelScore"));
let previousTotalScore = parseInt(localStorage.getItem("score"));
//Cheeky ternary operator, prevents null from showing before number
let totalScore =
  previousTotalScore !== null ? previousTotalScore + score : score;

//Setting UI values
scoreUI.textContent = score;
totalScoreUI.textContent = totalScore;

// helper method for making milk bottle props
const makeMilkBottle = function (leftPos) {
  let prop = document.createElement("img");
  prop.src = milkImage;
  prop.style.left = `${leftPos}vw`;
  prop.style.top = `39.5vh`;
  prop.style.zIndex = `2`;
  prop.style.position = `absolute`;
  prop.setAttribute("width", `70vw`);
  prop.setAttribute("height", `70vh`);
  props.appendChild(prop);
};

const setUp = function () {
  let currentLevel = localStorage.getItem("currentLevel");

  if (currentLevel == 4) {
    continueBtn.innerHTML = "RESTART";
  }
  continueBtn.addEventListener("click", () => {
    //level count gets iterated at end of last level so no need to iterate again
    localStorage.setItem("score", totalScore);

    // Saves all scores under a csv type format
    if (currentLevel == 4) {
      saveScores();
      currentLevel = 1;
    }
    window.location.href = "level.html";
  });

  playAgainBtn.addEventListener("click", () => {
    let previousLevel = currentLevel - 1; // allowing player to play that level again
    localStorage.setItem("score", previousTotalScore); //making sure the player can stack scores from playing again
    localStorage.setItem("currentLevel", previousLevel);
    window.location.href = "level.html";
  });

  backToMenuBtn.addEventListener("click", () => {
    if (currentLevel == 4) {
      saveScores();
      currentLevel = 1;
    }
    window.location.href = "mainMenu.html";
  });

  clown.animate(
    [
      { transform: "rotate(-20deg)" }, // Initial rotation
      { transform: "rotate(20deg)" }, // Final rotation
      { transform: "rotate(-20deg)" }, // Back to initial rotation
    ],
    {
      duration: duration,
      easing: "linear",
      iterations: Infinity,
    }
  );

  //Adding some props

  makeMilkBottle(13.5);
  makeMilkBottle(17.5);
  makeMilkBottle(21.5);
  makeMilkBottle(25.5);

  //adding duck
  let prop = document.createElement("img");
  prop.src = duckImage;
  prop.style.left = `15vw`;
  prop.style.top = `54vh`;
  prop.style.zIndex = `2`;
  prop.style.position = `absolute`;
  prop.setAttribute("width", `150vw`);
  prop.setAttribute("height", `150vh`);
  props.appendChild(prop);

  prop.animate(
    [
      { transform: "translate(-6vw, 2vh) rotate(20deg)" }, // Initial rotation + pos
      { transform: "translate(2vw, -2.5vh) rotate(0deg)" },
      { transform: "translate(12vw, 3vh) rotate(20deg)" }, //Final rotation + pos
      { transform: "translate(2vw, -2.5vh) rotate(0deg)" },
      { transform: "translate(-6vw, 2vh) rotate(20deg)" }, // Back to initial rotation + pos
    ],
    {
      duration: duration * 1.5,
      easing: "linear",
      iterations: Infinity,
    }
  );
};

function saveScores() {
  let allEntries = localStorage.getItem("allScoreEntries");

  let lvl1Sc = localStorage.getItem("level1Score");
  let lvl2Sc = localStorage.getItem("level2Score");
  let lvl3Sc = localStorage.getItem("level3Score");
  let ttlSc = parseInt(lvl1Sc) + parseInt(lvl2Sc) + parseInt(lvl3Sc);

  if (allEntries == null) {
    allEntries = lvl1Sc + ", " + lvl2Sc + ", " + lvl3Sc + ", " + ttlSc.toString() + "|";
  } else {
    allEntries += lvl1Sc + ", " + lvl2Sc + ", " + lvl3Sc + ", " + ttlSc.toString() + "|";
  }

  localStorage.setItem("allScoreEntries", allEntries);
  localStorage.setItem("level1Score", 0);
  localStorage.setItem("level2Score", 0);
  localStorage.setItem("level3Score", 0);
  localStorage.setItem("score", 0);
}

setUp();
