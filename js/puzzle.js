/*
=========================================================
PUZZLE FUNCTIONS
=========================================================
*/


/*
---------------------------------------------------------
Convert user input into an array
---------------------------------------------------------
*/

function parseState(input) {

    const values = input
        .trim()
        .split(/\s+/)
        .map(Number);

    if (values.length !== 9) {
        throw new Error(
            "Puzzle must contain exactly 9 numbers."
        );
    }

    const unique = new Set(values);

    if (
        unique.size !== 9 ||
        !values.every(n => Number.isInteger(n) && n >= 0 && n <= 8)
    ) {
        throw new Error(
            "Puzzle must contain numbers 0 to 8 exactly once."
        );
    }

    return values;
}


/*
---------------------------------------------------------
Convert state array to string

Used for storing states inside Sets and Maps.
---------------------------------------------------------
*/

function stateToString(state) {

    return state.join("");
}


/*
---------------------------------------------------------
Check whether two states are equal
---------------------------------------------------------
*/

function statesEqual(a, b) {

    return stateToString(a) === stateToString(b);
}


/*
---------------------------------------------------------
Get valid neighboring states
---------------------------------------------------------
*/

function getNeighbors(state) {

    const neighbors = [];

    const blankIndex = state.indexOf(0);

    const row = Math.floor(blankIndex / 3);
    const col = blankIndex % 3;


    const moves = [

        {
            name: "Up",
            row: row - 1,
            col: col
        },

        {
            name: "Down",
            row: row + 1,
            col: col
        },

        {
            name: "Left",
            row: row,
            col: col - 1
        },

        {
            name: "Right",
            row: row,
            col: col + 1
        }

    ];


    for (const move of moves) {

        if (
            move.row >= 0 &&
            move.row < 3 &&
            move.col >= 0 &&
            move.col < 3
        ) {

            const newIndex =
                move.row * 3 + move.col;

            const newState = [...state];

            newState[blankIndex] =
                newState[newIndex];

            newState[newIndex] = 0;

            neighbors.push({

                state: newState,

                move: move.name

            });

        }

    }

    return neighbors;
}


/*
---------------------------------------------------------
Count inversions

Used to determine whether a puzzle is solvable.
---------------------------------------------------------
*/

function countInversions(state) {

    let inversions = 0;

    const values = state.filter(value => value !== 0);

    for (let i = 0; i < values.length; i++) {

        for (let j = i + 1; j < values.length; j++) {

            if (values[i] > values[j]) {
                inversions++;
            }

        }

    }

    return inversions;
}


/*
---------------------------------------------------------
8-Puzzle solvability

For a 3x3 puzzle:

The puzzle is solvable when the number of inversions
is even.

Two states are mutually reachable only when they have
the same parity.
---------------------------------------------------------
*/

function isSolvable(initial, goal) {

    return (
        countInversions(initial) % 2 ===
        countInversions(goal) % 2
    );
}


/*
---------------------------------------------------------
Generate a random solvable puzzle

The puzzle is created by shuffling the goal state until
a solvable state is obtained.
---------------------------------------------------------
*/

function generateRandomPuzzle(goal) {

    let state;

    do {

        state = [...goal];

        for (let i = state.length - 1; i > 0; i--) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [
                state[i],
                state[j]
            ] = [
                state[j],
                state[i]
            ];

        }

    } while (
        !isSolvable(state, goal) ||
        statesEqual(state, goal)
    );

    return state;
}


/*
---------------------------------------------------------
Create board HTML
---------------------------------------------------------
*/

function renderBoard(container, state) {

    container.innerHTML = "";

    state.forEach(value => {

        const tile =
            document.createElement("div");

        tile.classList.add("tile");

        if (value === 0) {

            tile.classList.add("blank");

            tile.textContent = "";

        } else {

            tile.textContent = value;

        }

        container.appendChild(tile);

    });

}


/*
---------------------------------------------------------
Format state for display
---------------------------------------------------------
*/

function formatState(state) {

    return state
        .map(value => value === 0 ? "_" : value)
        .join(" ");
}