import { colorHintCircles, getBrakePoints } from "./_helper.js";
import { renderGameBoard, renderGameResult } from "./renderGame.js";

import { bigBoard } from "./gameBoard.js";

window.addEventListener("DOMContentLoaded", () => {

  bigBoard();

  const inputSettings = document.querySelectorAll(".input-number");
  let allCircles;
  let allHintCircles;

  const secretCode = [1, 3, 2, 0, 2];

  let gameSettings = {
    size: 5,
    max: 4,
    dim: 9
  };

  let gameVariables = {
    circleOrder: 0,
    circleBrakePoints: [],
    myPattern: []
  }

  const checkForWhite = (keyPattern, testingPattern) => {
    return testingPattern.reduce((acc, val) => {
      let indexOfFound = keyPattern.indexOf(val);
      if (indexOfFound >= 0) {
        keyPattern = keyPattern.filter((el, index) => {
          return indexOfFound !== index;
        })
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  }

  const checkForBlack = (keyPattern, testingPattern) => {
    return keyPattern.reduce((acc, value, index) => {
      return acc += testingPattern[index] === value ? 1 : 0;
    }, 0);
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
    // if (data.win) {
    //   gameVariables.circleOrder = gameSettings.max * gameSettings.size;
    // }
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
        })

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
    inputSettings.forEach(input => {
      gameSettings[`${input.name}`] = Number(input.value);
    });

    renderGameBoard(gameSettings, pickAColor);
    setNewGameValues();
  }

  // NEW GAME BUTTON
  const newGameButton = document.querySelector("#newgame-btn");
  newGameButton.addEventListener("click", createNewGame);

  // DELETE BUTTON
  const deleteButton = document.querySelector("#delete-btn");
  deleteButton.addEventListener("click", removeColor);

  inputSettings.forEach(input => {
    input.value = gameSettings[`${input.name}`];
  });
  renderGameBoard(gameSettings, pickAColor);
  setNewGameValues();

});


