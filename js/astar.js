/*
=========================================================
A* SEARCH IMPLEMENTATION
=========================================================
*/


/*
---------------------------------------------------------
Create a node
---------------------------------------------------------
*/

function createNode(
    state,
    parent,
    g,
    h,
    move = null
) {

    return {

        state: [...state],

        parent: parent,

        g: g,

        h: h,

        f: g + h,

        move: move

    };

}


/*
---------------------------------------------------------
Reconstruct solution path
---------------------------------------------------------
*/

function reconstructPath(node) {

    const path = [];

    let current = node;

    while (current !== null) {

        path.unshift(current);

        current = current.parent;

    }

    return path;
}


/*
---------------------------------------------------------
A* Search

Returns detailed information so the visualizer can show
the search process.
---------------------------------------------------------
*/

function aStarSearch(
    initial,
    goal,
    heuristicName
) {

    const startTime = performance.now();


    /*
    -----------------------------------------------------
    OPEN LIST
    -----------------------------------------------------
    */

    const openList = [];


    /*
    -----------------------------------------------------
    CLOSED SET
    -----------------------------------------------------
    */

    const closedSet = new Set();


    /*
    -----------------------------------------------------
    Store best known g(n)
    -----------------------------------------------------
    */

    const gScores = new Map();


    /*
    -----------------------------------------------------
    Search history
    -----------------------------------------------------
    */

    const history = [];


    /*
    -----------------------------------------------------
    Statistics
    -----------------------------------------------------
    */

    let nodesGenerated = 0;

    let nodesExpanded = 0;

    let maxDepth = 0;


    /*
    -----------------------------------------------------
    Initial node
    -----------------------------------------------------
    */

    const initialH =
        calculateHeuristic(
            initial,
            goal,
            heuristicName
        );

    const startNode =
        createNode(
            initial,
            null,
            0,
            initialH
        );

    openList.push(startNode);

    gScores.set(
        stateToString(initial),
        0
    );

    nodesGenerated++;


    /*
    -----------------------------------------------------
    MAIN A* LOOP
    -----------------------------------------------------
    */

    while (openList.length > 0) {


        /*
        -------------------------------------------------
        Sort according to f(n)

        If f values are equal, prefer smaller h(n).
        -------------------------------------------------
        */

        openList.sort((a, b) => {

            if (a.f !== b.f) {
                return a.f - b.f;
            }

            return a.h - b.h;

        });


        /*
        -------------------------------------------------
        Remove best node
        -------------------------------------------------
        */

        const current =
            openList.shift();


        const currentKey =
            stateToString(current.state);


        /*
        -------------------------------------------------
        Ignore already explored states
        -------------------------------------------------
        */

        if (closedSet.has(currentKey)) {
            continue;
        }


        /*
        -------------------------------------------------
        Goal test
        -------------------------------------------------
        */

        if (
            statesEqual(
                current.state,
                goal
            )
        ) {

            const executionTime =
                performance.now() - startTime;


            history.push({

                type: "goal",

                current: current,

                frontier: [...openList],

                explored: [...closedSet]

            });


            return {

                found: true,

                path: reconstructPath(current),

                history: history,

                nodesGenerated: nodesGenerated,

                nodesExpanded: nodesExpanded,

                maxDepth: maxDepth,

                executionTime: executionTime,

                pathCost: current.g

            };

        }


        /*
        -------------------------------------------------
        Add current state to closed set
        -------------------------------------------------
        */

        closedSet.add(currentKey);

        nodesExpanded++;


        /*
        -------------------------------------------------
        Generate successors
        -------------------------------------------------
        */

        const neighbors =
            getNeighbors(current.state);


        for (const neighbor of neighbors) {

            const neighborKey =
                stateToString(
                    neighbor.state
                );


            /*
            ---------------------------------------------
            Ignore explored state
            ---------------------------------------------
            */

            if (closedSet.has(neighborKey)) {
                continue;
            }


            /*
            ---------------------------------------------
            Calculate cost
            ---------------------------------------------
            */

            const tentativeG =
                current.g + 1;


            const previousG =
                gScores.has(neighborKey)
                    ? gScores.get(neighborKey)
                    : Infinity;


            /*
            ---------------------------------------------
            If this is a better path
            ---------------------------------------------
            */

            if (tentativeG < previousG) {

                const h =
                    calculateHeuristic(
                        neighbor.state,
                        goal,
                        heuristicName
                    );


                const child =
                    createNode(
                        neighbor.state,
                        current,
                        tentativeG,
                        h,
                        neighbor.move
                    );


                openList.push(child);


                gScores.set(
                    neighborKey,
                    tentativeG
                );


                nodesGenerated++;


                if (tentativeG > maxDepth) {
                    maxDepth = tentativeG;
                }

            }

        }


        /*
        -------------------------------------------------
        Save search state for visualization
        -------------------------------------------------
        */

        history.push({

            type: "expand",

            current: current,

            frontier: [...openList],

            explored: [...closedSet],

            generated: nodesGenerated,

            expanded: nodesExpanded

        });

    }


    /*
    -----------------------------------------------------
    No solution
    -----------------------------------------------------
    */

    const executionTime =
        performance.now() - startTime;


    return {

        found: false,

        path: [],

        history: history,

        nodesGenerated: nodesGenerated,

        nodesExpanded: nodesExpanded,

        maxDepth: maxDepth,

        executionTime: executionTime,

        pathCost: null

    };

}