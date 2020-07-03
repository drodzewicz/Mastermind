const bigBoard = () => {
  const gameContainer = document.querySelector(".game-board-container");

  // create title
  const title = document.createElement("h2");
  title.textContent = "Mastermind";
  title.id = "game-title";
  gameContainer.append(title);


  // game settings
  const gameSettingsContainer = document.createElement("div");
  gameSettingsContainer.classList.add("game-settings");

  // button new game
  const newGameButton = document.createElement("button");
  newGameButton.id = "newgame-btn";
  newGameButton.classList.add("btn");
  newGameButton.textContent = "new game";
  gameSettingsContainer.append(newGameButton);

  ["dim", "size", "max"].forEach(inputName => {
    const labelelement = document.createElement("label");
    labelelement.htmlFor = inputName;
    labelelement.textContent = `${inputName}:`;
    const inputElement = document.createElement("input");
    inputElement.id = inputName;
    inputElement.classList.add("input-number");
    inputElement.min = "0";
    inputElement.type = "number";
    inputElement.name = inputName;
    gameSettingsContainer.append(labelelement);
    gameSettingsContainer.append(inputElement);
  });

  gameContainer.append(gameSettingsContainer);

  // game board
  const gameBoard = document.createElement("div");
  gameBoard.id = "game-board";
  gameBoard.classList.add("main-container");

  const answerColumn = document.createElement("div");
  answerColumn.id = "answer-col";

  gameBoard.append(answerColumn);
  gameContainer.append(gameBoard);

  // delete button
  const deleteButton = document.createElement("button");
  deleteButton.id = "delete-btn";
  deleteButton.classList.add("btn");
  deleteButton.textContent = "delete";
  gameContainer.append(deleteButton);

  // color palete
  const colorPalete = document.createElement("div");
  colorPalete.id = "color-palete";
  colorPalete.classList.add("main-container");
  gameContainer.append(colorPalete);
}

export { bigBoard };