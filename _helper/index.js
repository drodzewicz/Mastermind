const { uuid } = require("uuidv4");

let gameHelper = {};


gameHelper.createSecretPattern = function(size=5, dim=9){
    let secretPatter = [];
    counter = size;
    
    while(counter > 0){
        secretPatter.push(Math.floor(Math.random() * dim));
        counter --;
    }
    return secretPatter;
}

gameHelper.createGame = function( size, dim, max ){
    const createdPattern = gameHelper.createSecretPattern(size, dim);
    return {
        id: uuid(),
        size,
        dim,
        max,
        secretPatter: createdPattern,
        playerMoves: []
    };
}

gameHelper.checkForWhite = function(keyPattern, testingPattern){
    return testingPattern.reduce((acc, val)=> {
      let indexOfFound = keyPattern.indexOf(val);
      if(indexOfFound >= 0){
        keyPattern = keyPattern.filter((el, index) => {
          return indexOfFound !== index;
        })
        return acc + 1;  
      } else{
        return acc;
      }
    }, 0);
}

gameHelper.checkForBlack = function(keyPattern, testingPattern){
    return keyPattern.reduce((acc, value, index) => {
        return acc += testingPattern[index] === value ? 1 : 0;
      }, 0);
}


module.exports = gameHelper;