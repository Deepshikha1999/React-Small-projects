// Directions for maze carving (up, down, left, right)
const DIRECTIONS = [
    { dx: -2, dy: 0 },  // Up
    { dx: 2, dy: 0 },   // Down
    { dx: 0, dy: -2 },  // Left
    { dx: 0, dy: 2 }    // Right
];



function generateMaze(x, y) {
    const X = x;  // Maze height (must be odd)
    const Y = y;  // Maze width (must be odd)
    // Initialize grid with all walls
    let grid = Array.from({ length: x }, (_, i) =>
        Array.from({ length: y }, (_, j) => ({
            x: i,
            y: j,
            setPlayer: false,
            wall: true,
            exit: false
        }))
    );

    function carve(x, y) {
        grid[x][y].wall = false; // Mark current cell as a passage

        let shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

        for (let { dx, dy } of shuffledDirs) {
            let nx = x + dx, ny = y + dy;

            if (nx > 0 && nx < X - 1 && ny > 0 && ny < Y - 1 && grid[nx][ny].wall) {
                grid[x + dx / 2][y + dy / 2].wall = false; // Knock down the wall
                carve(nx, ny);
            }
        }
    }

    // Start from (1,1) instead of (0,0) to stay inside bounds
    carve(1, 1);

    // Set player start at (1,1)
    grid[1][1].setPlayer = true;

    // Place the exit at the last reachable bottom-right passage
    for (let i = X - 2; i >= 1; i--) {
        for (let j = Y - 2; j >= 1; j--) {
            if (!grid[i][j].wall) {
                grid[i][j].exit = true;
                return grid;
            }
        }
    }
    // console.log(grid)
    return grid;
}

// console.log(generateMaze(X, Y));

export default generateMaze;
