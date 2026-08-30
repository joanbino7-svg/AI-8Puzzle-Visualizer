# 🧩 AI 8-Puzzle Visualizer

An interactive web application that demonstrates the working of the A* Search algorithm for solving the classical 8-Puzzle problem.

The application visually demonstrates the search process, generated states, frontier, explored states, heuristic values, path cost and final solution path.

---

## Student Details

**Name:** Joan Elizabeth Bino

**Register Number:** 24BCE2670

**Course:** Artificial Intelligence

**Assignment:** Interactive 8-Puzzle Problem Solver

**Assigned Algorithm:** A* Search

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
- View the frontier/open list
- View the explored/closed list
- View g(n), h(n) and f(n)
- Animate the final solution
- View performance statistics

---

## 8-Puzzle Problem

The 8-Puzzle consists of eight numbered tiles and one blank space arranged on a 3 × 3 board.

The objective is to move the tiles until the initial state becomes the goal state.

The blank tile can move:

- Up
- Down
- Left
- Right

Each valid movement has a path cost of 1.

---

## Implemented Algorithm

### A* Search

A* is an informed search algorithm that evaluates nodes using:

```text
f(n) = g(n) + h(n)