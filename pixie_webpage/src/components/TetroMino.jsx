import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function TetroMino({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());

    useEffect(() => {
        const backgroundChange = (e) => {
            setBackgroundSize({
                height: window.innerHeight,
                width: window.innerWidth,
            })
        }
        window.addEventListener("resize", backgroundChange)
        return () => {
            window.removeEventListener("resize", backgroundChange)
        }
    }, [])

    // grid: grid[row][col] -> true = empty, false = occupied
    const grid = useRef([]);
    const gridCoordinatesAndSize = useRef({});
    const jump = useRef(0); // cell size in pixels
    const currentMino = useRef(null); // array of [x,y] pixel positions
    const direction = useRef([0, 1]); // movement per tick in grid coordinates (col,row)
    const rows = 20;
    const cols = 20;

    const Tetrominos = [
        [[0, 0], [0, 1], [1, 0], [0, -1]],
        [[0, 0], [0, -1], [-1, -1], [1, 0]],
        [[0, 0], [0, -1], [0, 1], [0, 2]],
        [[0, 0], [0, -1], [0, 1], [1, 1]],
        [[0, 0], [0, -1], [0, 1], [-1, 1]],
        [[0, 0], [0, -1], [1, -1], [-1, 0]]
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize;
        canvas.width = width;
        canvas.height = height;

        const w = 640;
        const h = 640;
        const x1 = Math.floor(width / 2) - w / 2;
        const x2 = x1 + w;
        const y1 = Math.floor(height / 2) - h / 2;
        const y2 = y1 + h;
        const j = w / cols; // cell size

        gridCoordinatesAndSize.current = { x1, y1, x2, y2, w, h };
        jump.current = j;

        // grid initialization: true = empty
        const arr = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => true)
        );
        grid.current = arr;

        // draw initial grid lines
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = x1 + c * j;
                const y = y1 + r * j;
                ctx.rect(x, y, j, j);
            }
        }
        ctx.stroke();
    }, [backgroundSize]);

    // spawn a new mino at top (random column)
    const spawnMino = () => {
        const { x1, y1, w } = gridCoordinatesAndSize.current;
        const j = jump.current;
        const m = Math.floor(w / j);
        // pick a random column index between 1 and m-2 to avoid edges
        const colIndex = Math.floor(Math.random() * (m - 2)) + 1;
        const x = x1 + colIndex * j;
        const y = y1 + 0 * j + j; // start just below top border
        const index = Math.floor(Math.random() * Tetrominos.length);
        currentMino.current = Tetrominos[index].map(([dx, dy]) => [x + dx * j, y + dy * j]);
    };

    // rotate current mino clockwise around first block (pivot)
    const rotateMino = () => {
        const ctx = ctxRef.current;
        if (!currentMino.current) return;

        const { x1, y1 } = gridCoordinatesAndSize.current;
        const j = jump.current;
        const pivot = currentMino.current[0];
        const [px, py] = pivot;

        const rotated = currentMino.current.map(([x, y]) => {
            // rotate clockwise 90deg around pivot:
            // dx,dy relative to pivot => new = (dy, -dx)
            const dx = x - px;
            const dy = y - py;
            return [px + dy, py - dx];
        });

        // validate rotated positions
        for (const [x, y] of rotated) {
            const col = Math.floor((x - x1) / j);
            const row = Math.floor((y - y1) / j);
            if (
                row < 0 ||
                row >= rows ||
                col < 0 ||
                col >= cols ||
                grid.current[row][col] === false // occupied
            ) {
                return; // invalid rotation, ignore
            }
        }

        // commit rotation
        currentMino.current = rotated;
    };

    // ensure grid drawing: draw landed blocks and active mino
    const drawAll = () => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        const { x1, y1, w, h } = gridCoordinatesAndSize.current;
        const j = jump.current;

        // clear area
        ctx.clearRect(x1 - 1, y1 - 1, w + 2, h + 2);

        // redraw grid background / cells
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = x1 + c * j;
                const y = y1 + r * j;
                ctx.rect(x, y, j, j);
            }
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();

        // draw landed blocks (grid[row][col] === false)
        ctx.fillStyle = "#FF6B1A";
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid.current[r][c] === false) {
                    const x = x1 + c * j;
                    const y = y1 + r * j;
                    ctx.fillRect(x, y, j, j);
                }
            }
        }

        // draw active mino
        if (currentMino.current) {
            ctx.fillStyle = "#00B3AD";
            for (const [x, y] of currentMino.current) {
                ctx.fillRect(x, y, j, j);
            }
        }
    };

    // handle movement & locking
    const minoLogic = () => {
        if (!currentMino.current) return;

        const { x1, y1, x2, y2 } = gridCoordinatesAndSize.current;
        const j = jump.current;
        const dir = direction.current;
        const nextPositions = [];

        // compute next positions in pixels
        for (const [cx, cy] of currentMino.current) {
            const nx = cx + dir[0] * j;
            const ny = cy + dir[1] * j;
            const col = Math.floor((nx - x1) / j);
            const row = Math.floor((ny - y1) / j);

            // bounds & occupancy check
            if (
                row < 0 ||
                row >= rows ||
                col < 0 ||
                col >= cols ||
                grid.current[row][col] === false
            ) {
                // cannot move; lock piece in place (mark its current cells as occupied)
                for (const [lx, ly] of currentMino.current) {
                    const c = Math.floor((lx - x1) / j);
                    const r = Math.floor((ly - y1) / j);
                    if (r >= 0 && r < rows && c >= 0 && c < cols) grid.current[r][c] = false;
                }
                // after locking, clear full rows and spawn next
                clearFullRows();
                spawnMino();
                direction.current = [0, 1]; // reset
                return;
            }

            nextPositions.push([nx, ny]);
        }

        // if we reach here movement is valid — commit new positions
        currentMino.current = nextPositions;
    };

    // clear full rows (row where all cells === false)
    const clearFullRows = () => {
        // remove any rows that are completely occupied (false)
        const newGrid = [];
        for (let r = 0; r < rows; r++) {
            const isFull = grid.current[r].every((cell) => cell === false);
            if (!isFull) newGrid.push(grid.current[r]);
        }
        const removed = rows - newGrid.length;
        // add that many empty rows on top
        for (let i = 0; i < removed; i++) {
            newGrid.unshift(Array.from({ length: cols }, () => true));
        }
        grid.current = newGrid;
    };

    // main animation loop (step every fallDelay ms)
    useEffect(() => {
        spawnMino();
        let frame;
        const fallDelay = 600;
        let last = 0;

        const tick = (time) => {
            if (time - last > fallDelay) {
                minoLogic();
                drawAll();
                last = time;
                // reset horizontal movement after the tick so single key press moves one cell only
                if (direction.current[0] !== 0) direction.current = [0, 1];
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // color/randomizer interval (kept from original)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRgba([
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                1
            ]);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // input handlers
    useEffect(() => {
        const updateCursorPos = (event) => {
            setCursorPos({ x: event.clientX, y: event.clientY });
        };

        const updateDirection = (event) => {
            if (event.key === "ArrowLeft") {
                direction.current = [-1, 0];
                // immediately apply lateral move (optional): do a small draw so user sees instant feedback
                minoLogic();
                drawAll();
            } else if (event.key === "ArrowRight") {
                direction.current = [1, 0];
                minoLogic();
                drawAll();
            } else if (event.key === "ArrowDown") {
                direction.current = [0, 1];
                // accelerate one step
                minoLogic();
                drawAll();
            } else if (event.key === "ArrowUp") {
                // rotate
                rotateMino();
                drawAll();
            }
        };

        window.addEventListener("mousemove", updateCursorPos);
        window.addEventListener("keydown", updateDirection);
        return () => {
            window.removeEventListener("mousemove", updateCursorPos);
            window.removeEventListener("keydown", updateDirection);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Play fussy tetromino, use left right up and down nav keys!</div>
        </div>
    );
}
