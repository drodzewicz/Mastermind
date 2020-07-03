
import { addCirclesToContainer, randomColor, showKeyPattern } from "./_helper.js";

const clearGameBoard = () => {
  const body = document.querySelector("body");
  const colorPalete = document.querySelector("#color-palete");
  const answerColumn = document.querySelector("#answer-col");
  colorPalete.innerHTML = "";
  answerColumn.innerHTML = ""

  body.style.backgroundColor = "#f79071";
}
const renderGameBoard = (gameConfig, pickColorFun) => {
  clearGameBoard();
  const answerColumn = document.querySelector("#answer-col");
  const colorPalete = document.querySelector("#color-palete");

  // checking if endless mode is submited 
  let max = 1;
  if (gameConfig.max !== 0) {
    max = gameConfig.max;
  }

  /* creating rows of empty sockets/circles with hint/results */
  for (let j = 0; j < max; j++) {
    // container with answer and hint circles 
    const guessContainer = document.createElement("div");
    guessContainer.classList.add("guess-container");

    // asnwer circle creation
    const answerRow = document.createElement("div");
    answerRow.classList.add("circle-container");

    // creating a row of circles of size 'n'
    addCirclesToContainer(answerRow, gameConfig.size);

    // hint circle creation
    const hintContainer = document.createElement("div");
    hintContainer.classList.add("hint-container");
    // adjusting dynamic size for auto grid to wrap
    hintContainer.style.width = `${gameConfig.size * 0.7}rem`
    addCirclesToContainer(hintContainer, gameConfig.size);

    // add both to guess container
    guessContainer.append(answerRow);
    guessContainer.append(hintContainer);

    answerColumn.append(guessContainer);
  }

  // adds custom divider div ( line that seperates pattern circle row from guess circle rows)
  const divider = document.createElement("div");
  divider.classList.add("divider");
  answerColumn.append(divider);


  // creating secret pattern row
  const patternRow = document.createElement("div");
  patternRow.classList.add("circle-container");
  patternRow.setAttribute("id", "pattern-row");

  addCirclesToContainer(patternRow, gameConfig.size, "?");
  answerColumn.append(patternRow);

  addCirclesToContainer(colorPalete, gameConfig.dim, "");
  // color circles in plaete container
  colorPalete.childNodes.forEach((el, index) => {
    if (el.tagName === "DIV") {
      const elColor = randomColor();
      el.style.backgroundColor = elColor;
      el.addEventListener("click", () => pickColorFun(elColor, index));
    }
  });

}
const renderGameResult = ({ gameOver, win, message, secretCode }) => {
  if (win || gameOver) {
    const gameTitle = document.querySelector("#game-title");
    const body = document.querySelector("body");
    if (win) {
      body.style.backgroundColor = "#5FFF7F";
    } else {
      body.style.backgroundColor = "#FF483D";
    }
    gameTitle.textContent = message;
    showKeyPattern(secretCode);
  }
}

export { renderGameBoard, renderGameResult };


