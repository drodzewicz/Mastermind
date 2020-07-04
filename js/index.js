import { colorHintCircles, getBrakePoints, checkForWhite, checkForBlack } from "./_helper.js";
import { renderGameBoard, renderGameResult } from "./_renderGame.js";

window.addEventListener("DOMContentLoaded", () => {
  let allCircles;
  let allHintCircles;

  let secretCode = [];

  let gameSettings = {
    size: 5,
    max: 2,
    dim: 3
  };

  let gameVariables = {
    circleOrder: 0,
    circleBrakePoints: [],
    myPattern: []
  }

  const generateRandomPattern = (size, dim) => {
    let secretPatter = [],
    counter = size;
    
    while(counter > 0){
        secretPatter.push(Math.floor(Math.random() * dim));
        counter --;
    }
    return secretPatter;
  }
  const checkMyPatter = () => {
    const white = checkForWhite(secretCode, gameVariables.myPattern);
    const black = checkForBlack(secretCode, gameVariables.myPattern);

    let gameOver = false, win = false;
    if (gameSettings.size * gameSettings.max === gameVariables.circleOrder) {
      gameOver = true;
    }
    if (black === gameSettings.size) {
      win = true;
    }
    colorHintCircles({ white, black }, gameVariables.circleBrakePoints, gameSettings.max, gameSettings.size);
    renderGameResult({ gameOver, win, message: win ? "YOU WIN!" : "GAME OVER", secretCode });
    if (win) {
      gameVariables.circleOrder = gameSettings.max * gameSettings.size;
    }
    gameVariables.myPattern = [];
  }
  const pickAColor = (color, index) => {
    if (allCircles.length - 1 >= gameVariables.circleOrder) {

      allCircles[gameVariables.circleOrder].style.backgroundColor = color;

      // endless mode
      if (gameSettings.max === 0 && gameVariables.circleOrder === 0) {
        allCircles[gameSettings.size - 1].style.borderColor = "#006975";

        // color hint circles back to empty
        allHintCircles.forEach(circle => {
          circle.style.backgroundColor = "#fa744f";
        });
      }

      // current circle border
      if (gameVariables.circleOrder !== 0) {
        allCircles[gameVariables.circleOrder - 1].style.borderColor = "#006975";
      }
      allCircles[gameVariables.circleOrder].style.borderColor = "#024249";
      gameVariables.circleOrder += 1;
      gameVariables.myPattern.push(index);


      let indexOfBrakePoint = gameVariables.circleBrakePoints.indexOf(gameVariables.circleOrder);
      if (indexOfBrakePoint >= 0 || (gameSettings.max === 0 && gameVariables.circleOrder === gameSettings.size)) {
        checkMyPatter();
        if (gameSettings.max === 0 && gameVariables.circleOrder === gameSettings.size) {
          gameVariables.circleOrder = 0;
        }
      }
    }

  }
  const removeColor = () => {
    if (gameVariables.circleBrakePoints.length > 0 && gameVariables.circleBrakePoints[0] - gameSettings.size !== gameVariables.circleOrder) {

      allCircles[gameVariables.circleOrder - 1].style.borderColor = "#006975";

      gameVariables.circleOrder--;
      allCircles[gameVariables.circleOrder].style.backgroundColor = "#006975";
      gameVariables.myPattern.pop();

      if (gameVariables.circleOrder > 0) {
        allCircles[gameVariables.circleOrder - 1].style.borderColor = "#024249";
      }

    }
  }
  const setNewGameValues = () => {
    allCircles = document.querySelectorAll("#answer-col > .guess-container .circle-container > .circle");
    allHintCircles = document.querySelectorAll("#answer-col .hint-container > .circle");
    gameVariables = {
      circleOrder: 0,
      circleBrakePoints: getBrakePoints(gameSettings.max, gameSettings.size),
      myPattern: []
    }
  }
  const createNewGame = () => {
    // inputSettings.forEach(input => {
    //   gameSettings[`${input.name}`] = Number(input.value);
    // });
    inputRangeSettings.forEach(input => {
      const inputRange = input.querySelector("input");
      gameSettings[`${inputRange.name}`] = Number(inputRange.value);
    });
    renderGameBoard(gameSettings, pickAColor);
    setNewGameValues();
    secretCode = generateRandomPattern(gameSettings.size, gameSettings.dim);
    // console.log(secretCode);
  }

  // NEW GAME BUTTON
  const newGameButton = document.querySelector("#newgame-btn");
  newGameButton.addEventListener("click", createNewGame);

  // DELETE BUTTON
  const deleteButton = document.querySelector("#delete-btn");
  deleteButton.addEventListener("click", removeColor);

  // SETTINGS BUTTON
  const settingsButton = document.querySelector("#settings");
  const settingsDrawer = document.querySelector(".settings-drawer");
  const toggleSettingsOpen = () => {
    if(settingsDrawer.classList.contains("open")){
      settingsDrawer.classList.remove("open");
    } else {
      settingsDrawer.classList.add("open");
    }
  }
  settingsButton.addEventListener("click", toggleSettingsOpen);

  // // INPUT SETTINGS
  // const inputSettings = document.querySelectorAll(".input-number");
  // inputSettings.forEach(input => {
  //   input.value = gameSettings[`${input.name}`];
  // });

  // INPUT RANGE SETTINGS
  const inputRangeSettings = document.querySelectorAll(".input-range-wrapper");
  inputRangeSettings.forEach(input => {
    const labelSpan = input.querySelector("label>span");
    const inputRange = input.querySelector("input");
    inputRange.addEventListener("input", (e) => {
      labelSpan.textContent = e.target.value;
    });
    labelSpan.textContent = gameSettings[`${inputRange.name}`];
    inputRange.value = gameSettings[`${inputRange.name}`];
  });
  renderGameBoard(gameSettings, pickAColor);
  setNewGameValues();
  secretCode = generateRandomPattern(gameSettings.size, gameSettings.dim);
});
