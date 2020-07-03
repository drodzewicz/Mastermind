const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
const addCirclesToContainer = (container, amount, circleContent) => {
  for (let i = 0; i < amount; i++) {
    const circleElement = document.createElement("div");
    circleElement.classList.add("circle");
    circleElement.textContent = circleContent;

    container.append(circleElement);
  }
}
const showKeyPattern = (secretPattern) => {
  let colorPaleteCircles = document.querySelectorAll("#color-palete>.circle");
  let patternRowCircles = document.querySelectorAll("#pattern-row>.circle");

  patternRowCircles.forEach((el, index) => {
    el.style.backgroundColor = colorPaleteCircles[secretPattern[index]].style.backgroundColor;
    el.style.color = "black";
  })
}
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
}
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
}


export {
  randomColor,
  addCirclesToContainer,
  showKeyPattern,
  getBrakePoints,
  colorHintCircles
};