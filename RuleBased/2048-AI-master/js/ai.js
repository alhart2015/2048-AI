function AI(grid) {
  this.grid = grid;
}

// For the rule-based player, you don't need heuristics
// Keep this in just in case somewhere else in the code needs it
AI.prototype.eval = function() {
  return 0.0;
};

/* "Search function," ie. just play the moves by the rules.

  Returns: {move: direction, score: num, positions: positions, cutoffs: cutoffs}
    move = the direction you're moving (0 = up, 1 = right, 2 = down, 3 = left)
    score = the score of the board that results from the move
    positions = doesn't matter
    cutoffs = doesn't matter

*/
AI.prototype.search = function(depth, alpha, beta, positions, cutoffs) {
    var bestMove = -1;

    // Try moving down
    var newGrid = this.grid.clone();
    if (newGrid.move(2).moved) {
      return {move: 2, score: 0, positions: 0, cutoffs: 0};
    }

    newGrid = this.grid.clone();  // Not sure you need to clone it again, but
                                  // just to be safe..
    // Try moving right
    if (newGrid.move(1).moved) {
      return {move: 1, score: 0, positions: 0, cutoffs: 0};
    }

    newGrid = this.grid.clone();  // Not sure you need to clone it again, but
                                  // just to be safe..
    // Try moving left
    if (newGrid.move(3).moved) {
      return {move: 3, score: 0, positions: 0, cutoffs: 0};
    }

    // You couldn't move anywhere, so go up
    return {move: 0, score: 0, positions: 0, cutoffs: 0};

};

// Performs a search and returns the best move
AI.prototype.getBest = function() {
  return this.iterativeDeep();
};

// Call the search method
// I think we can just return the move here??
AI.prototype.iterativeDeep = function() {
  return this.search(0, 0, 0, 0, 0);
};

// // static evaluation function
// AI.prototype.eval = function() {
//   var emptyCells = this.grid.availableCells().length;

//   var smoothWeight = 0.1,
//       //monoWeight   = 0.0,
//       //islandWeight = 0.0,
//       mono2Weight  = 1.0,
//       emptyWeight  = 2.7,
//       maxWeight    = 1.0;

//   return this.grid.smoothness() * smoothWeight
//        //+ this.grid.monotonicity() * monoWeight
//        //- this.grid.islands() * islandWeight
//        + this.grid.monotonicity2() * mono2Weight
//        + Math.log(emptyCells) * emptyWeight
//        + this.grid.maxValue() * maxWeight;
// };

// // alpha-beta depth first search
// AI.prototype.search = function(depth, alpha, beta, positions, cutoffs) {
//   var bestScore;
//   var bestMove = -1;
//   var result;

//   // the maxing player
//   if (this.grid.playerTurn) {
//     bestScore = alpha;
//     for (var direction in [0, 1, 2, 3]) {
//       var newGrid = this.grid.clone();
//       if (newGrid.move(direction).moved) {
//         positions++;
//         if (newGrid.isWin()) {
//           return { move: direction, score: 10000, positions: positions, cutoffs: cutoffs };
//         }
//         var newAI = new AI(newGrid);

//         if (depth == 0) {
//           result = { move: direction, score: newAI.eval() };
//         } else {
//           result = newAI.search(depth-1, bestScore, beta, positions, cutoffs);
//           if (result.score > 9900) { // win
//             result.score--; // to slightly penalize higher depth from win
//           }
//           positions = result.positions;
//           cutoffs = result.cutoffs;
//         }

//         if (result.score > bestScore) {
//           bestScore = result.score;
//           bestMove = direction;
//         }
//         if (bestScore > beta) {
//           cutoffs++
//           return { move: bestMove, score: beta, positions: positions, cutoffs: cutoffs };
//         }
//       }
//     }
//   }

//   else { // computer's turn, we'll do heavy pruning to keep the branching factor low
//     bestScore = beta;

//     // try a 2 and 4 in each cell and measure how annoying it is
//     // with metrics from eval
//     var candidates = [];
//     var cells = this.grid.availableCells();
//     var scores = { 2: [], 4: [] };
//     for (var value in scores) {
//       for (var i in cells) {
//         scores[value].push(null);
//         var cell = cells[i];
//         var tile = new Tile(cell, parseInt(value, 10));
//         this.grid.insertTile(tile);
//         scores[value][i] = -this.grid.smoothness() + this.grid.islands();
//         this.grid.removeTile(cell);
//       }
//     }

//     // now just pick out the most annoying moves
//     var maxScore = Math.max(Math.max.apply(null, scores[2]), Math.max.apply(null, scores[4]));
//     for (var value in scores) { // 2 and 4
//       for (var i=0; i<scores[value].length; i++) {
//         if (scores[value][i] == maxScore) {
//           candidates.push( { position: cells[i], value: parseInt(value, 10) } );
//         }
//       }
//     }

//     // search on each candidate
//     for (var i=0; i<candidates.length; i++) {
//       var position = candidates[i].position;
//       var value = candidates[i].value;
//       var newGrid = this.grid.clone();
//       var tile = new Tile(position, value);
//       newGrid.insertTile(tile);
//       newGrid.playerTurn = true;
//       positions++;
//       newAI = new AI(newGrid);
//       result = newAI.search(depth, alpha, bestScore, positions, cutoffs);
//       positions = result.positions;
//       cutoffs = result.cutoffs;

//       if (result.score < bestScore) {
//         bestScore = result.score;
//       }
//       if (bestScore < alpha) {
//         cutoffs++;
//         return { move: null, score: alpha, positions: positions, cutoffs: cutoffs };
//       }
//     }
//   }

//   return { move: bestMove, score: bestScore, positions: positions, cutoffs: cutoffs };
// }

// // performs a search and returns the best move
// AI.prototype.getBest = function() {
//   return this.iterativeDeep();
// }

// // performs iterative deepening over the alpha-beta search
// AI.prototype.iterativeDeep = function() {
//   var start = (new Date()).getTime();
//   var depth = 0;
//   var best;
//   do {
//     var newBest = this.search(depth, -10000, 10000, 0 ,0);
//     if (newBest.move == -1) {
//       break;
//     } else {
//       best = newBest;
//     }
//     depth++;
//   } while ( (new Date()).getTime() - start < minSearchTime);
//   return best
// }

AI.prototype.translate = function(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}
