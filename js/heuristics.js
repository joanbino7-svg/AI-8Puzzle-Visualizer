/*
=========================================================
HEURISTIC FUNCTIONS
A* 8-Puzzle Visualizer
=========================================================
*/


/*
---------------------------------------------------------
Misplaced Tiles Heuristic

Counts the number of tiles that are not in their
correct position.

The blank tile (0) is ignored.
---------------------------------------------------------
*/

function misplacedTiles(state, goal) {

    let count = 0;

    for (let i = 0; i < state.length; i++) {

        if (state[i] !== 0 && state[i] !== goal[i]) {
            count++;
        }

    }

    return count;
}


/*
---------------------------------------------------------
Manhattan Distance Heuristic

For every tile:

distance =
|current row - goal row|
+
|current column - goal column|

The blank tile is ignored.
---------------------------------------------------------
*/

function manhattanDistance(state, goal) {

    let distance = 0;

    for (let i = 0; i < state.length; i++) {

        const tile = state[i];

        if (tile === 0) {
            continue;
        }

        const currentRow = Math.floor(i / 3);
        const currentCol = i % 3;

        const goalIndex = goal.indexOf(tile);

        const goalRow = Math.floor(goalIndex / 3);
        const goalCol = goalIndex % 3;

        distance +=
            Math.abs(currentRow - goalRow) +
            Math.abs(currentCol - goalCol);
    }

    return distance;
}


/*
---------------------------------------------------------
Select Heuristic
---------------------------------------------------------
*/

function calculateHeuristic(state, goal, heuristic) {

    if (heuristic === "misplaced") {

        return misplacedTiles(state, goal);

    }

    return manhattanDistance(state, goal);
}