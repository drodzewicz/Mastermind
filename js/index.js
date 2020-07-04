window.addEventListener("DOMContentLoaded", () => {
    let allCircles;
    let allHintCircles;

    let secretCode = [];

    let gameSettings = {
        size: 4,
        max: 4,
        dim: 5
    };

    let gameVariables = {
        circleOrder: 0,
        circleBrakePoints: [],
        myPattern: []
    };

    const randomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    };
    const addCirclesToContainer = (container, amount, circleContent) => {
        for (let i = 0; i < amount; i++) {
            const circleElement = document.createElement("div");
            circleElement.classList.add("circle");
            circleElement.textContent = circleContent;

            container.append(circleElement);
        }
    };
    const showKeyPattern = (secretPattern) => {
        let colorPaleteCircles = document.querySelectorAll("#color-palete>.circle");
        let patternRowCircles = document.querySelectorAll("#pattern-row>.circle");

        patternRowCircles.forEach((el, index) => {
            el.style.backgroundColor = colorPaleteCircles[secretPattern[index]].style.backgroundColor;
            el.style.color = "black";
        });
    };
    const colorHintCircles = (result, circleBrakePoints, max, size) => {
        const allHintCircles = document.querySelectorAll("#answer-col .hint-container > .circle");
        const black = result.black || 0;
        const white = result.white || 0;

        let brakePoint = 0;
        if (max !== 0) {
            brakePoint = circleBrakePoints.shift() - size;
        }
        // paint it white
        for (let i = brakePoint; i < brakePoint + white; i++) {
            allHintCircles[i].style.backgroundColor = "white";
        }
        // paint it black
        for (let i = brakePoint; i < brakePoint + black; i++) {
            allHintCircles[i].style.backgroundColor = "black";
        }
    };
    const getBrakePoints = (max, size) => {
        const brakePoints = [];
        if (max !== 0) {
            for (let i = 1; i < max + 1; i++) {
                brakePoints.push(size * i);
            }
        } else {
            brakePoints.push(size);
        }
        return brakePoints;
    };
    const checkForWhite = (keyPattern, testingPattern) => {
        return testingPattern.reduce((acc, val) => {
            let indexOfFound = keyPattern.indexOf(val);
            if (indexOfFound >= 0) {
                keyPattern = keyPattern.filter((el, index) => {
                    return indexOfFound !== index;
                });
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);
    };
    const checkForBlack = (keyPattern, testingPattern) => {
        return keyPattern.reduce((acc, value, index) => {
            return acc += testingPattern[index] === value ? 1 : 0;
        }, 0);
    };

    const clearGameBoard = () => {
        const body = document.querySelector("body");
        const colorPalete = document.querySelector("#color-palete");
        const answerColumn = document.querySelector("#answer-col");
        colorPalete.innerHTML = "";
        answerColumn.innerHTML = "";

        body.style.backgroundColor = "#f79071";
    };
    const renderGameBoard = (gameConfig, pickColorFun) => {
        clearGameBoard();
        const gameTitle = document.querySelector("#game-title");
        gameTitle.textContent = "Mastermind";
        const answerColumn = document.querySelector("#answer-col");
        const colorPalete = document.querySelector("#color-palete");

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
            hintContainer.style.width = `${gameConfig.size * 0.76}rem`;
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

    };
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
    };

    const generateRandomPattern = (size, dim) => {
        let secretPatter = [],
            counter = size;

        while (counter > 0) {
            secretPatter.push(Math.floor(Math.random() * dim));
            counter--;
        }
        return secretPatter;
    };
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
    };
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

    };
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
    };
    const setNewGameValues = () => {
        allCircles = document.querySelectorAll("#answer-col > .guess-container .circle-container > .circle");
        allHintCircles = document.querySelectorAll("#answer-col .hint-container > .circle");
        gameVariables = {
            circleOrder: 0,
            circleBrakePoints: getBrakePoints(gameSettings.max, gameSettings.size),
            myPattern: []
        };
    };
    const createNewGame = () => {

        inputRangeSettings.forEach(input => {
            const inputRange = input.querySelector("input");
            gameSettings[`${inputRange.name}`] = Number(inputRange.value);
        });
        renderGameBoard(gameSettings, pickAColor);
        setNewGameValues();
        secretCode = generateRandomPattern(gameSettings.size, gameSettings.dim);
    };

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
        if (settingsDrawer.classList.contains("open")) {
            settingsDrawer.classList.remove("open");
        } else {
            settingsDrawer.classList.add("open");
        }
    };
    settingsButton.addEventListener("click", toggleSettingsOpen);

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
