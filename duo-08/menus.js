// Main Menu References
let startGameBtn = document.getElementById("startGameBtn");
let levelSelectBtn = document.getElementById("levelSelectBtn");
let leaderBoardBtn = document.getElementById("leaderBoardBtn");
let quitBtn = document.getElementById("quitBtn");
let menuOptions = document.getElementById("menuOptions");
let props = document.getElementById("props");
let clown = document.getElementById("clown");
let menuContainer = document.getElementById("menuContainer");

//for animation times
let duration = 4000;

let milkImage = "https://cdn-icons-png.flaticon.com/512/2049/2049109.png";
let duckImage =
  "https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-yellow-rubber-duck-toy-icon-png-image_5228414.png";

// Flag tester
firstLoad = localStorage.getItem("firstLoad"); // Return null if it doesn't exist
if (firstLoad === null) {
  localStorage.setItem("firstLoad", false);
}

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

// Set up buttons' functions
const setUp = function () {
  //Resetting scores
  localStorage.setItem("score", 0);
  localStorage.setItem("levelScore", 0);

  startGameBtn.addEventListener("click", () => {
    localStorage.setItem("currentLevel", "1"); // Start level button at level 1
    window.location.href = "level.html";
  });

  // Shows some divs that act as buttons to select a level
  levelSelectBtn.addEventListener("click", () => {
    // Makes sure level select isn't already showing
    if (
      localStorage.getItem("levelSelectFlag") == "false" &&
      localStorage.getItem("leaderBoardFlag") == "false"
    ) {
      localStorage.setItem("levelSelectFlag", "true");

      // Creates divs
      let levelSelectDiv = document.createElement("div");
      let level1 = document.createElement("div");
      let level2 = document.createElement("div");
      let level3 = document.createElement("div");

      // Adds parent div to menu options
      menuOptions.append(levelSelectDiv);
      levelSelectDiv.id = "levelSelectDiv";

      // Create different level buttons
      level1.setAttribute("class", "levelSelectButtons levelSelect");
      level1.id = "level1Btn";
      level1.innerHTML = "Level 1";

      level2.setAttribute("class", "levelSelectButtons levelSelect");
      level2.id = "level2Btn";
      level2.innerHTML = "Level 2";

      level3.setAttribute("class", "levelSelectButtons levelSelect");
      level3.id = "level3Btn";
      level3.innerHTML = "Level 3";

      // Add levels to divs
      levelSelectDiv.append(level1);
      levelSelectDiv.append(level2);
      levelSelectDiv.append(level3);

      // Add functions to level buttons / open respective level
      level1.addEventListener("click", () => {
        localStorage.setItem("currentLevel", "1");
        window.location.href = "level.html";
      });
      level2.addEventListener("click", () => {
        localStorage.setItem("currentLevel", "2");
        window.location.href = "level.html";
      });
      level3.addEventListener("click", () => {
        localStorage.setItem("currentLevel", "3");
        window.location.href = "level.html";
      });
    } else if (localStorage.getItem("levelSelectFlag") === "true") {
      // Checks if level select div is there or not
      localStorage.setItem("levelSelectFlag", "false"); // Stores that it isn't showing anymore
      levelSelectDiv = document.getElementById("levelSelectDiv");
      levelSelectDiv.remove(); // Removes div
    } else if (localStorage.getItem("leaderBoardFlag") == "true") {
      window.alert("Please close leaderboard first");
    }
  });

  // Leaderboard toggle
  leaderBoardBtn.addEventListener("click", () => {
    if (
      localStorage.getItem("leaderBoardFlag") == "false" &&
      localStorage.getItem("levelSelectFlag") == "false"
    ) {
      // Makes sure only level select or leaderboard can show at a time
      localStorage.setItem("leaderBoardFlag", "true");

      // Leaderboard creation
      let leaderBoardDiv = document.createElement("div");

      menuContainer.append(leaderBoardDiv);
      leaderBoardDiv.setAttribute("id", "leaderBoardDiv");
      leaderBoardDiv.setAttribute("class", "leaderboard");

      allEntries = localStorage.getItem("allScoreEntries"); // Gets all score entries
      // Example score entries list: 31, 31, 32, 62|17, 21, 8, 38|17, 21, 8, 38|17, 21, 21, 38|17, 21, 21, 59|17, 21, 21, 59|18, 15, 22, 0|18, 15, 22, 22|18, 15, 22, 22|18, 15, 22, 22|18, 15, 22, 22|18, 15, 22, 22|
      if (allEntries == null) {
        leaderBoardDiv.innerHTML =
          "<h1> EMPTY LEADERBOARD! <br> GO GET SOME SCORES FIRST! </h1>";
      } else {
        leaderBoardDiv.innerHTML =
          "<h4> Entry: level 1 score, level 2 score, level 3 score, total score</h4>"; // Comma seperated instead of done with a table for sake of ease
        allEntriesArr = allEntries.split("|");
        for (let i = 0; i < allEntriesArr.length; i++) {
          // Iterates through each entry in local storage
          if (allEntriesArr[i].trim() == "") {
            break;
          }
          leaderBoardDiv.innerHTML += 
            "<p class=\"leaderboardElm\"> Entry " + (i + 1) + ": " + allEntriesArr[i] + "</p>";
        }
      }
    } else if (localStorage.getItem("leaderBoardFlag") === "true") {
      // Checks if level select div is there or not
      localStorage.setItem("leaderBoardFlag", "false"); // Stores that it isn't showing anymore
      leaderBoardDiv = document.getElementById("leaderBoardDiv");
      leaderBoardDiv.remove(); // Removes div
    } else if (localStorage.getItem("levelSelectFlag") == "true") { // Brings up alert if level select is showing saying to close it
      window.alert("Please close level select first"); // Alert
    }
  });

  //clown animation

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

  // Closes tab on browser w/ a confirm / dropdown alert
  quitBtn.addEventListener("click", () => {
    if (confirm("Close Window?")) {
      window.close();
    }
  });
};

localStorage.setItem("currentLevel", "1");
localStorage.setItem("levelSelectFlag", "false");
localStorage.setItem("leaderBoardFlag", "false");
setUp();
