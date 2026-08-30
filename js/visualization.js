/*
=========================================================
VISUALIZATION CONTROLLER
=========================================================
*/


let initialState = [
    2, 8, 3,
    1, 6, 4,
    7, 0, 5
];

let goalState = [
    1, 2, 3,
    8, 0, 4,
    7, 6, 5
];


let searchResult = null;

let currentHistoryIndex = 0;

let currentSolutionIndex = 0;

let isPaused = false;

let animationTimer = null;


/*
=========================================================
DOM ELEMENTS
=========================================================
*/

const initialInput =
    document.getElementById("initialInput");

const goalInput =
    document.getElementById("goalInput");

const heuristicSelect =
    document.getElementById("heuristicSelect");

const initialBoard =
    document.getElementById("initialBoard");

const currentBoard =
    document.getElementById("currentBoard");

const goalBoard =
    document.getElementById("goalBoard");

const frontierList =
    document.getElementById("frontierList");

const exploredList =
    document.getElementById("exploredList");

const solutionPath =
    document.getElementById("solutionPath");

const solutionMessage =
    document.getElementById("solutionMessage");


/*
=========================================================
STAT ELEMENTS
=========================================================
*/

const stepCounter =
    document.getElementById("stepCounter");

const nodesGenerated =
    document.getElementById("nodesGenerated");

const nodesExpanded =
    document.getElementById("nodesExpanded");

const searchDepth =
    document.getElementById("searchDepth");

const gValue =
    document.getElementById("gValue");

const hValue =
    document.getElementById("hValue");

const fValue =
    document.getElementById("fValue");


/*
=========================================================
INITIAL RENDER
=========================================================
*/

function renderInitialPuzzle() {

    renderBoard(
        initialBoard,
        initialState
    );

    renderBoard(
        currentBoard,
        initialState
    );

    renderBoard(
        goalBoard,
        goalState
    );

}

renderInitialPuzzle();


/*
=========================================================
READ INPUT
=========================================================
*/

function readPuzzleInput() {

    try {

        initialState =
            parseState(
                initialInput.value
            );

        goalState =
            parseState(
                goalInput.value
            );


        if (
            !isSolvable(
                initialState,
                goalState
            )
        ) {

            throw new Error(
                "The initial and goal states are not mutually solvable."
            );

        }


        return true;

    } catch (error) {

        alert(error.message);

        return false;

    }

}


/*
=========================================================
RUN A*
=========================================================
*/

function runSearch() {

    if (!readPuzzleInput()) {
        return;
    }


    const heuristic =
        heuristicSelect.value;


    /*
    -----------------------------------------------
    Reset visualization
    -----------------------------------------------
    */

    clearAnimation();

    currentHistoryIndex = 0;

    currentSolutionIndex = 0;

    isPaused = false;


    /*
    -----------------------------------------------
    Run A*
    -----------------------------------------------
    */

    searchResult =
        aStarSearch(
            initialState,
            goalState,
            heuristic
        );


    /*
    -----------------------------------------------
    Render initial board
    -----------------------------------------------
    */

    renderBoard(
        initialBoard,
        initialState
    );

    renderBoard(
        currentBoard,
        initialState
    );

    renderBoard(
        goalBoard,
        goalState
    );


    /*
    -----------------------------------------------
    Show result
    -----------------------------------------------
    */

    if (searchResult.found) {

        solutionMessage.className =
            "alert alert-success mt-4";

        solutionMessage.innerHTML =
            `
            <strong>Solution Found!</strong><br>
            A* reached the goal using
            <strong>${heuristic}</strong> heuristic.
            <br>
            Moves:
            <strong>${searchResult.path.length - 1}</strong>
            `;

    } else {

        solutionMessage.className =
            "alert alert-danger mt-4";

        solutionMessage.innerHTML =
            "<strong>No solution found.</strong>";

    }


    /*
    -----------------------------------------------
    Display solution
    -----------------------------------------------
    */

    renderSolutionPath();


    /*
    -----------------------------------------------
    Start animation
    -----------------------------------------------
    */

    startAnimation();

}


/*
=========================================================
ANIMATE SEARCH
=========================================================
*/

function startAnimation() {

    if (!searchResult) {
        return;
    }


    isPaused = false;


    const speed =
        Number(
            document.getElementById(
                "speedRange"
            ).value
        );


    clearAnimation();


    animationTimer =
        setInterval(() => {

            if (isPaused) {
                return;
            }


            if (
                currentHistoryIndex >=
                searchResult.history.length
            ) {

                clearAnimation();

                animateSolution();

                return;

            }


            showHistoryStep(
                currentHistoryIndex
            );


            currentHistoryIndex++;

        }, speed);

}


/*
=========================================================
SHOW SEARCH HISTORY STEP
=========================================================
*/

function showHistoryStep(index) {

    const item =
        searchResult.history[index];


    if (!item) {
        return;
    }


    /*
    -----------------------------------------------
    Current node
    -----------------------------------------------
    */

    if (item.current) {

        renderBoard(
            currentBoard,
            item.current.state
        );


        gValue.textContent =
            item.current.g;

        hValue.textContent =
            item.current.h;

        fValue.textContent =
            item.current.f;

        searchDepth.textContent =
            item.current.g;

    }


    /*
    -----------------------------------------------
    Counters
    -----------------------------------------------
    */

    if (item.generated !== undefined) {

        nodesGenerated.textContent =
            item.generated;

    }

    if (item.expanded !== undefined) {

        nodesExpanded.textContent =
            item.expanded;

    }


    /*
    -----------------------------------------------
    Frontier
    -----------------------------------------------
    */

    renderFrontier(
        item.frontier || []
    );


    /*
    -----------------------------------------------
    Explored
    -----------------------------------------------
    */

    renderExplored(
        item.explored || []
    );


    stepCounter.textContent =
        index + 1;

}


/*
=========================================================
FRONTIER DISPLAY
=========================================================
*/

function renderFrontier(frontier) {

    if (frontier.length === 0) {

        frontierList.textContent =
            "Empty";

        return;

    }


    frontierList.innerHTML = "";


    frontier
        .slice(0, 30)
        .forEach(node => {

            const item =
                document.createElement("div");

            item.className =
                "state-item";

            item.textContent =
                `${formatState(node.state)}
                 | g=${node.g}
                 h=${node.h}
                 f=${node.f}`;

            frontierList.appendChild(item);

        });

}


/*
=========================================================
EXPLORED DISPLAY
=========================================================
*/

function renderExplored(explored) {

    if (explored.length === 0) {

        exploredList.textContent =
            "Empty";

        return;

    }


    exploredList.innerHTML = "";


    [...explored]
        .slice(-30)
        .forEach(state => {

            const item =
                document.createElement("div");

            item.className =
                "state-item";

            item.textContent =
                formatState(
                    typeof state === "string"
                        ? state.split("").map(Number)
                        : state
                );

            exploredList.appendChild(item);

        });

}


/*
=========================================================
SOLUTION PATH
=========================================================
*/

function renderSolutionPath() {

    solutionPath.innerHTML = "";


    if (
        !searchResult ||
        !searchResult.found
    ) {

        solutionPath.textContent =
            "No solution calculated.";

        return;

    }


    searchResult.path.forEach(
        (node, index) => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "solution-step";


            const board =
                document.createElement("div");

            board.className =
                "puzzle-board small-board";


            renderBoard(
                board,
                node.state
            );


            const label =
                document.createElement("p");

            label.innerHTML =
                `
                <strong>Step ${index}</strong><br>
                g=${node.g},
                h=${node.h},
                f=${node.f}
                `;


            wrapper.appendChild(board);

            wrapper.appendChild(label);

            solutionPath.appendChild(wrapper);

        }
    );

}


/*
=========================================================
ANIMATE SOLUTION
=========================================================
*/

function animateSolution() {

    if (
        !searchResult ||
        !searchResult.found
    ) {

        return;

    }


    currentSolutionIndex = 0;


    const speed =
        Number(
            document.getElementById(
                "speedRange"
            ).value
        );


    clearAnimation();


    animationTimer =
        setInterval(() => {

            if (isPaused) {
                return;
            }


            if (
                currentSolutionIndex >=
                searchResult.path.length
            ) {

                clearAnimation();

                showFinalStatistics();

                return;

            }


            const node =
                searchResult.path[
                    currentSolutionIndex
                ];


            renderBoard(
                currentBoard,
                node.state
            );


            gValue.textContent =
                node.g;

            hValue.textContent =
                node.h;

            fValue.textContent =
                node.f;

            searchDepth.textContent =
                node.g;


            stepCounter.textContent =
                currentSolutionIndex;


            currentSolutionIndex++;


        }, speed);

}


/*
=========================================================
FINAL STATISTICS
=========================================================
*/

function showFinalStatistics() {

    if (!searchResult) {
        return;
    }


    solutionMessage.className =
        "alert alert-success mt-4";


    solutionMessage.innerHTML =
        `
        <strong>🎉 Solution Completed!</strong><br><br>

        Total Moves:
        <strong>${searchResult.pathCost}</strong><br>

        Nodes Generated:
        <strong>${searchResult.nodesGenerated}</strong><br>

        Nodes Expanded:
        <strong>${searchResult.nodesExpanded}</strong><br>

        Maximum Search Depth:
        <strong>${searchResult.maxDepth}</strong><br>

        Execution Time:
        <strong>${searchResult.executionTime.toFixed(3)} ms</strong><br>

        Path Cost:
        <strong>${searchResult.pathCost}</strong>
        `;


    nodesGenerated.textContent =
        searchResult.nodesGenerated;

    nodesExpanded.textContent =
        searchResult.nodesExpanded;

    searchDepth.textContent =
        searchResult.maxDepth;

}


/*
=========================================================
PAUSE
=========================================================
*/

function pauseAnimation() {

    isPaused = true;

}


/*
=========================================================
RESUME
=========================================================
*/

function resumeAnimation() {

    if (!searchResult) {
        return;
    }

    isPaused = false;

}


/*
=========================================================
NEXT STEP
=========================================================
*/

function nextStep() {

    if (!searchResult) {
        return;
    }


    isPaused = true;


    if (
        currentHistoryIndex <
        searchResult.history.length
    ) {

        showHistoryStep(
            currentHistoryIndex
        );

        currentHistoryIndex++;

    }

}


/*
=========================================================
PREVIOUS STEP
=========================================================
*/

function previousStep() {

    if (!searchResult) {
        return;
    }


    isPaused = true;


    if (currentHistoryIndex > 1) {

        currentHistoryIndex -= 2;

        showHistoryStep(
            currentHistoryIndex
        );

        currentHistoryIndex++;

    }

}


/*
=========================================================
RESET
=========================================================
*/

function resetVisualization() {

    clearAnimation();


    searchResult = null;

    currentHistoryIndex = 0;

    currentSolutionIndex = 0;

    isPaused = false;


    renderBoard(
        initialBoard,
        initialState
    );

    renderBoard(
        currentBoard,
        initialState
    );

    renderBoard(
        goalBoard,
        goalState
    );


    stepCounter.textContent = "0";

    nodesGenerated.textContent = "0";

    nodesExpanded.textContent = "0";

    searchDepth.textContent = "0";

    gValue.textContent = "0";

    hValue.textContent = "0";

    fValue.textContent = "0";


    frontierList.textContent =
        "Empty";

    exploredList.textContent =
        "Empty";

    solutionPath.textContent =
        "No solution calculated yet.";


    solutionMessage.className =
        "alert alert-secondary mt-4";

    solutionMessage.textContent =
        "Enter a puzzle and press Run.";

}


/*
=========================================================
CLEAR TIMER
=========================================================
*/

function clearAnimation() {

    if (animationTimer !== null) {

        clearInterval(animationTimer);

        animationTimer = null;

    }

}


/*
=========================================================
RANDOM PUZZLE
=========================================================
*/

function generateRandom() {

    const randomState =
        generateRandomPuzzle(
            goalState
        );


    initialState =
        randomState;


    initialInput.value =
        randomState.join(" ");


    renderBoard(
        initialBoard,
        randomState
    );

    renderBoard(
        currentBoard,
        randomState
    );


    resetVisualization();

}


/*
=========================================================
SPEED CONTROL
=========================================================
*/

const speedRange =
    document.getElementById(
        "speedRange"
    );

const speedLabel =
    document.getElementById(
        "speedLabel"
    );


speedRange.addEventListener(
    "input",
    () => {

        speedLabel.textContent =
            `${speedRange.value} ms`;

    }
);


/*
=========================================================
BUTTON EVENTS
=========================================================
*/

document
    .getElementById("runBtn")
    .addEventListener(
        "click",
        runSearch
    );


document
    .getElementById("pauseBtn")
    .addEventListener(
        "click",
        pauseAnimation
    );


document
    .getElementById("resumeBtn")
    .addEventListener(
        "click",
        resumeAnimation
    );


document
    .getElementById("stepBtn")
    .addEventListener(
        "click",
        nextStep
    );


document
    .getElementById("prevBtn")
    .addEventListener(
        "click",
        previousStep
    );


document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        resetVisualization
    );


document
    .getElementById("randomBtn")
    .addEventListener(
        "click",
        generateRandom
    );