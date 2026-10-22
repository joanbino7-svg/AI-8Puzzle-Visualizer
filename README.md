# AI 8-Puzzle Visualizer

An interactive web application that demonstrates the working of the **A\* Search algorithm** for solving the classical 8-Puzzle problem.

The application visually demonstrates the search process, generated states, frontier, explored states, heuristic values, path cost, and the final solution path.

**Live Demo:** https://joanbino7-svg.github.io/AI-8Puzzle-Visualizer/

---

## Student Details

| Field | Value |
|---|---|
| **Name** | Joan Elizabeth Bino |
| **Register Number** | 24BCE2670 |
| **Course** | Artificial Intelligence |
| **Assignment** | Interactive 8-Puzzle Problem Solver |
| **Assigned Algorithm** | A* Search |

---

## Project Objective

The objective of this project is to understand state-space search and demonstrate the working of the A* Search algorithm using an interactive 8-Puzzle solver.

The application allows users to:
- Enter an initial puzzle state
- Enter a goal state
- Generate a random solvable puzzle
- Select a heuristic
- Run A* Search
- Visualize the search process
- View the frontier / open list
- View the explored / closed list
- View g(n), h(n) and f(n)
- Animate the final solution
- View performance statistics

---

## 8-Puzzle Problem

The 8-Puzzle consists of eight numbered tiles and one blank space arranged on a 3 × 3 board. The objective is to move the tiles until the initial state becomes the goal state.

The blank tile can move: **Up, Down, Left, Right**

Each valid movement has a path cost of 1.

---

## Technologies Used

- **HTML5** — page structure
- **CSS3** — styling and layout
- **JavaScript (ES6)** — puzzle logic and A* search implementation

---

## Search Algorithm Implemented

### A* Search

A* is an informed search algorithm that evaluates nodes using:

```
f(n) = g(n) + h(n)
```

Where:
- `g(n)` = cost from the start node to the current node (path cost so far)
- `h(n)` = estimated cost from the current node to the goal (heuristic)
- `f(n)` = total estimated cost of the cheapest solution through node `n`

A* expands the node with the lowest `f(n)` value first, which — combined with an admissible heuristic — guarantees it finds the shortest possible solution.

**Completeness:** Yes (if a solution exists and the state space is finite)
**Optimality:** Yes (when the heuristic is admissible, as both heuristics below are)
**Time Complexity:** O(b^d) in the worst case (b = branching factor, d = depth of solution)
**Space Complexity:** O(b^d) — A* keeps all generated nodes in memory

---

## Heuristics Used

### 1. Misplaced Tiles
Counts the number of tiles that are not in their goal position (excluding the blank tile). A simple, admissible heuristic, but a looser estimate since it ignores how far out of place each tile actually is.

### 2. Manhattan Distance
For each tile, sums the number of grid moves (rows + columns) needed to reach its goal position. A tighter, more accurate admissible heuristic that generally results in A* expanding far fewer nodes than Misplaced Tiles.

---

## How to Run the Project

### Option 1: Run Online
Visit the live deployed site: **https://joanbino7-svg.github.io/AI-8Puzzle-Visualizer/**

### Option 2: Run Locally
1. Clone the repository:
   ```
   git clone https://github.com/joanbino7-svg/AI-8Puzzle-Visualizer.git
   ```
2. Navigate into the project folder:
   ```
   cd AI-8Puzzle-Visualizer
   ```
3. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox).
   - No build step or server is required — it is a pure static HTML/CSS/JS project.

---

## Screenshots

> <img width="1346" height="609" alt="image" src="https://github.com/user-attachments/assets/cb22c730-2ced-4c70-b63d-0ff57bb6fc21" />
<img width="1346" height="609" alt="image" src="https://github.com/user-attachments/assets/756458f9-dc57-424e-afb2-3a09ce5b5e4e" />
<img width="1346" height="609" alt="image" src="https://github.com/user-attachments/assets/9fac3d9c-95dc-4449-915e-27f3f543c73b" />

---

## References

- Russell, S. & Norvig, P. — *Artificial Intelligence: A Modern Approach*
- GeeksforGeeks — [A* Search Algorithm](https://www.geeksforgeeks.org/a-search-algorithm/)
- MDN Web Docs — HTML, CSS, JavaScript documentation

---

## Repository Structure

```
AI-8Puzzle-Visualizer/
│── index.html
│── css/
│── js/
│── README.md
```
