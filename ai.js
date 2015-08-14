function AI(grid) {
  this.grid = grid;
}

// static evaluation function
AI.prototype.eval = function() {
  var emptyCells = this.grid.availableCells().length;

  var smoothWeight = 0.1,
      mono2Weight  = 1.0,
      emptyWeight  = 2.7,
      maxWeight    = 1.0;
      cornerWeight = 0.7

  return this.grid.smoothness() * smoothWeight
       //+ this.grid.monotonicity() * monoWeight
       //- this.grid.islands() * islandWeight
       + this.grid.monotonicity2() * mono2Weight
       + Math.log(emptyCells) * emptyWeight
       + this.grid.maxValue() * maxWeight
       + this.grid.bigInCorner() * cornerWeight;
}

// expectimax search
AI.prototype.search = function(depth, player) {
  var player = player;


  if (player === "player") {
    //console.log("player");
    var bestValue = -10000;
    var val = 0;
    //console.log("wtf");
    //bestValue = -1 * 10000;
    
    //bestValue = -50;
    //var validMoves = [];
    //console.log("HI");

    var moves = [0, 1, 2, 3];

    for (var direction = 0; direction < moves.length; direction++) {
      var newGrid = this.grid.clone();
      if (newGrid.move(direction).moved) {
        if (newGrid.isWin()) {
          return { move: direction, score: 10000 }
        }
        
        var newAI = new AI(newGrid);

        if (depth == 0) {
          result = { move: direction, score: newAI.eval() };
        }
        else {
          val = newAI.search(depth - 1, "comp");
        }
      
        //this.grid = originalGrid;
        if (Math.max(bestValue, val) === val) {
          bestValue = val;
          bestMove = direction;
        }
      }
    }
    
    console.log("bestValue: " + bestValue);
    console.log(bestValue);
    return bestValue;
    //return { move: bestMove, score: bestValue, positions: positions, cutoffs: cutoffs };
  }
  else {
    console.log("comp");
    var expectedVal = 0;
    var openCells = this.grid.availableCells();
    var numPossibleBoards = openCells.length * 2;
    //console.log(numPossibleBoards);
    var tileValues = [2,4];

    for (var i = 0; i < tileValues.length; i++) {
      for (var j in openCells) {
        var cell = openCells[j];
        var tile = new Tile(cell, tileValues[i]);
        var newGrid = this.grid.clone();
        var newAI = new AI(newGrid);
        newAI.grid.insertTile(tile);
        if (tile.value === 2) {
          console.log("hey");
          expectedVal += newAI.search(depth, "player") * (0.9/numPossibleBoards);
        }
        else {
          console.log("hey");
          expectedVal += newAI.search(depth, "player") * (0.1/numPossibleBoards);
        }
      }
      //return { move: null, score: expectedVal/numPossibleBoards, positions: positions, cutoffs: cutoffs };
    }
    //console.log("expectedVal: " + expectedVal);
    //console.log("fuck this")
    return {move: null, score: expectedVal};
  }
  return { move: bestMove, score: bestValue}
}

// function expectimax (depth, grid){

// }
// performs a search and returns the best move
AI.prototype.getBest = function() {
  return this.iterativeDeep();
}

// performs iterative deepening over the alpha-beta search
AI.prototype.iterativeDeep = function() {
  // var start = new Date();
  // var startTime = start.getTime();
  // var end = new Date();
  // var endTime = end.getTime();
  // var depth = 1;
  // var moves = [0, 1, 2, 3];
  // var best;
  // var maxSearchTime = 100;

  // while ( endTime - startTime < maxSearchTime) {
    var start = (new Date()).getTime();
    var depth = 0;
    var best;
    do {
      var newBest = this.search(depth, "player");
      if (newBest.move == -1) {
        break;
      } else {
        best = newBest;
      }
      depth++;
    } while ( (new Date()).getTime() - start < minSearchTime);
    return best

  //   var moveScores = [0.0, 0.0, 0.0, 0.0];
  //   //var boards = [];

  //   var newGrid = this.grid.clone();
  //   //var tempAI = new AI(originalGrid);

  //   for (var direction = 0; direction < moves.length; direction++) {
  //     //console.log("cloned the grid");
  //     var newGrid = this.grid.clone();
  //     var newAI = new AI(newGrid);
  //     if (newAI.grid.move(direction).moved) {
  //       //console.log("Got here");
  //       var value = newAI.search(depth - 1, "comp");
  //       //console.log(value);
  //       moveScores[direction] = value;
  //     }
  //     else {
  //       var penalty = -1*10000;
  //       moveScores[direction] = penalty;
  //     } 
  //   }
  //   //console.log(moveScores);
  //   var bestMove = 0;

  //   for (var i = 1; i < moveScores.length; i++) {
  //     if (moveScores[i] > moveScores[bestMove])
  //       bestMove = i;
  //   }

  //   var newBest = { move: bestMove, score: moveScores[bestMove], positions: 0, cutoffs: 0 };
  //   //console.log(best);
  //   depth++;
  //   //}
  //   endTime = end.getTime();
  //   console.log(endTime - startTime);
  // }
  // return best;  
}

AI.prototype.translate = function(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}
