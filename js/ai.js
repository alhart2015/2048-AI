function AI(grid) {
  this.grid = grid;
}

// static evaluation function
AI.prototype.eval = function() {
  var emptyCells = this.grid.availableCells().length;

  var smoothWeight = 0.5,
      mono2Weight = 0.5,
      emptyWeight = 2.5,
      maxWeight = 1.5,
      cornerWeight = 0.7;

  //original weighting
  // var smoothWeight = 0.1,
  //     //monoWeight   = 0.0,
  //     //islandWeight = 0.0,
  //     mono2Weight  = 1.0,
  //     emptyWeight  = 2.7,
  //     maxWeight    = 1.0;

  return this.grid.smoothness() * smoothWeight
       + this.grid.monotonicity2() * mono2Weight
       + Math.log(emptyCells) * emptyWeight
       + this.grid.maxValue() * maxWeight;
};

// expectimax search
AI.prototype.search = function(depth, grid, playerTurn) {
  var bestValue = 0;
  var val = 0;

  if (depth === 0) {
    var tempAI = new AI(grid);
    return tempAI.eval();
  }

  if (playerTurn) {

    var validMoves = [];
    for (var direction in [0, 1, 2, 3]) {
      var tempGrid = grid.clone();

      if (tempGrid.move(direction).moved) {
        validMoves.push(direction);
      }
    }

    if (validMoves.length === 0) {
      console.log(" playerTurn - no valid moves")
      return bestValue;
    }

    for (var validMove in validMoves) {
      var nextGrid = grid.clone();
      nextGrid.move(validMove);
      //var tempAI = new AI(nextGrid);
      val = this.search(depth - 1, nextGrid, false);
      if (Math.max(bestValue, val) === val) {
        bestValue = val;
      }
      
    }
    
    return bestValue;
   
  }
  else {
    var expectedVal = 0;
    var openCells = grid.availableCells();
    var numPossibleBoards = openCells.length * 2;

    for (var value in [2,4]) {
      for (var i in openCells) {
        var cell = openCells[i];
        var tile = new Tile(cell, value);
        var nextGrid = grid.clone();
        nextGrid.insertTile(tile);
        //var tempAI = new AI(nextGrid);
        if (tile.value === 2) {
          expectedVal += (this.search(depth - 1, nextGrid, true).score * 0.9)/numPossibleBoards;
        }
        else {
          expectedVal += (this.search(depth - 1, nextGrid, true).score * 0.1)/numPossibleBoards;
        }
      }
    }
    
    return expectedVal;
  }
}


// performs a search and returns the best move
AI.prototype.getBest = function() {
  return this.iterativeDeep(5);
}

// performs iterative deepening over the alpha-beta search
AI.prototype.iterativeDeep = function(depth) {
  var bestMove = 0; 
  var moveScores = [];
  var boards = [];
  
  console.log(moveScores);

  for (var direction in [0, 1, 2, 3]) {
    var newGrid = this.grid.clone();
    if (newGrid.move(direction).moved) {
      moveScores.push(this.search(depth - 1, newGrid, false));
    }
    else {
      moveScores.push(-1*Number.MAX_VALUE);
    }
  }
  console.log(moveScores);
  var maxValue = Math.max(moveScores[0], moveScores[1], moveScores[2], moveScores[3]);
  bestMove = moveScores.indexOf(maxValue);

  var best = { move: bestMove, score: 0, positions: 0, cutoffs: 0 }
  return best;

  
}

AI.prototype.translate = function(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}
