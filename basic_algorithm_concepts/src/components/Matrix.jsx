import { useEffect, useRef, useState } from "react";
import "./../styles/Matrix.css";

const g = 25;
const SHAPES = [
    // I
    [[-1, 0], [0, 0], [1, 0], [2, 0]],

    // O
    [[0, 0], [1, 0], [0, 1], [1, 1]],

    // T
    [[-1, 0], [0, 0], [1, 0], [0, 1]],

    // L
    [[0, -1], [0, 0], [0, 1], [1, 1]],

    // J
    [[0, -1], [0, 0], [0, 1], [-1, 1]],

    // S
    [[0, 0], [1, 0], [-1, 1], [0, 1]],

    // Z
    [[-1, 0], [0, 0], [0, 1], [1, 1]],
];

export default function Matrix({ }) {
    const [message, setMessage] = useState("Tetromino : Press Space to start ... ");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState(null);
    const tetrominoArray = useRef([]);
    const properties = useRef(null);
    const currentMinoRef = useRef(null);
    const currentMinoPositionRef = useRef(null);
    const [start, setStart] = useState(false);
    const prevMinoPositionRef = useRef(null);
    const lastTimeRef = useRef(0);
    const sideShiftRef = useRef(0);
    const isRotate = useRef(false);

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("matrix_board");
            setPageSize({
                width: divClass.clientWidth,
                height: divClass.clientHeight
            })
        }

        updatePageSize()
        window.addEventListener("resize", updatePageSize);
        return () => {
            window.removeEventListener("resize", updatePageSize);
        }
    }, [])

    const drawLayout = (ctx, props) => {
        let { W, H, m, n, x, y } = props;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= m; i++) {
            ctx.moveTo(x + i * g, y);
            ctx.lineTo(x + i * g, y + H);
        }

        for (let j = 0; j <= n; j++) {
            ctx.moveTo(x, y + j * g);
            ctx.lineTo(x + W, y + j * g);
        }
        ctx.stroke();
    }

    useEffect(() => {
        if (!pageSize) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;

        const W = Math.max(100 * Math.floor(width / 100), 100)
        const H = Math.max(100 * Math.floor(height / 100), 100)
        const x = Math.floor(width / 2) - (W / 2);
        const y = Math.floor(height / 2) - (H / 2);
        const m = Math.floor(W / g);
        const n = Math.floor(H / g);

        const props = {
            W: W,
            H: H,
            x: x,
            y: y,
            m: m,
            n: n
        }

        drawLayout(ctx, props);
        properties.current = props;

    }, [pageSize])

    const draw = (time) => {
        const ctx = ctxRef.current;
        const props = properties.current;
        let tetrominoArr = tetrominoArray.current;
        let currentMino = currentMinoRef.current;
        let currentPos = [...currentMinoPositionRef.current];
        let prevPos = prevMinoPositionRef.current;
    
        if (!ctx || !props || currentMino === null) return;
        const { m, n, x, y, width, height } = props; // width/height are in props from your useEffect
    
        // 1. CLEAR CURRENT PIECE from array
        if (prevPos) {
            currentMino.forEach(([dx, dy]) => {
                let py = dy + prevPos[1];
                let px = dx + prevPos[0];
                if (tetrominoArr[py]) tetrominoArr[py][px] = 0;
            });
        }
    
        // 2. HANDLE ROTATION & SIDE SHIFT
        let tempMino = currentMino;
        let tempX = currentPos[0];
    
        if (isRotate.current) {
            const rotated = currentMino.map(([dx, dy]) => [-dy, dx]);
            const canRotate = rotated.every(([dx, dy]) => {
                let nx = dx + tempX;
                let ny = dy + currentPos[1];
                return nx >= 0 && nx < m && ny >= 0 && ny < n && tetrominoArr[ny][nx] === 0;
            });
            if (canRotate) tempMino = rotated;
            isRotate.current = false;
        }
    
        if (sideShiftRef.current !== 0) {
            let nextX = tempX + sideShiftRef.current;
            const canShift = tempMino.every(([dx, dy]) => {
                let nx = dx + nextX;
                let ny = dy + currentPos[1];
                return nx >= 0 && nx < m && ny >= 0 && ny < n && tetrominoArr[ny][nx] === 0;
            });
            if (canShift) tempX = nextX;
            sideShiftRef.current = 0;
        }
    
        currentMino = tempMino;
        currentMinoRef.current = tempMino;
        currentPos[0] = tempX;
    
        // 3. HANDLE GRAVITY
        let shouldLock = false;
        if (time - lastTimeRef.current >= 500) {
            lastTimeRef.current = time;
            let nextY = currentPos[1] + 1;
            const canFall = currentMino.every(([dx, dy]) => {
                let nx = dx + currentPos[0];
                let ny = dy + nextY;
                return ny < n && nx >= 0 && nx < m && tetrominoArr[ny][nx] === 0;
            });
    
            if (canFall) {
                currentPos[1] = nextY;
            } else {
                shouldLock = true;
            }
        }
    
        // 4. LOCK PIECE AND SPAWN NEW
        if (shouldLock) {
            currentMino.forEach(([dx, dy]) => {
                let py = dy + currentPos[1];
                let px = dx + currentPos[0];
                if (tetrominoArr[py]) tetrominoArr[py][px] = 1;
            });
    
            // Line Clear
            let newGrid = tetrominoArr.filter(row => !row.every(cell => cell === 1));
            while (newGrid.length < n) newGrid.unshift(Array(m).fill(0));
            tetrominoArray.current = newGrid;
    
            // Game Over Check
            const newShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const startPos = [Math.floor(m / 2), 0];
            const isGameOver = newShape.some(([dx, dy]) => {
                let nx = dx + startPos[0];
                let ny = dy + startPos[1];
                return tetrominoArr[ny] && tetrominoArr[ny][nx] === 1;
            });
    
            if (isGameOver) {
                setStart(false);
                setMessage("GAME OVER! Press Start to play again.");
                // Final Render before stopping
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.fillStyle = "white";
                ctx.font = "bold 40px Arial";
                ctx.textAlign = "center";
                ctx.fillText("GAME OVER", canvasRef.current.width / 2, canvasRef.current.height / 2);
                return;
            }
    
            currentMinoRef.current = newShape;
            currentMinoPositionRef.current = startPos;
            prevMinoPositionRef.current = null;
        } else {
            currentMino.forEach(([dx, dy]) => {
                let py = dy + currentPos[1];
                let px = dx + currentPos[0];
                if (tetrominoArr[py]) tetrominoArr[py][px] = 1;
            });
            currentMinoPositionRef.current = currentPos;
            prevMinoPositionRef.current = [...currentPos];
        }
    
        // 5. FINAL RENDER (Always at the end)
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawLayout(ctx, props);
        ctx.fillStyle = "white";
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < m; c++) {
                if (tetrominoArr[r][c] === 1) ctx.fillRect(x + c * g, y + r * g, g - 1, g - 1);
            }
        }
    };

    useEffect(() => {
        if (!start) return;
        let frame;
        const animate = (time) => {
            draw(time);
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [start])

    const handleStart = () => {
        const props = properties.current;
        if (!props) return;
        const { m, n } = props;

        // Reset everything
        tetrominoArray.current = Array.from({ length: n }, () => Array(m).fill(0));
        currentMinoRef.current = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        currentMinoPositionRef.current = [Math.floor(m / 2), 0];
        prevMinoPositionRef.current = null;
        lastTimeRef.current = performance.now(); // Reset timer

        setStart(true);
        setMessage("Tetromino: Game started...");
    };


    useEffect(() => {

        const handleKeys = (e) => {
            if (e.key == " " && !start) {
                handleStart();
                return;
            }
            if (e.key === "ArrowLeft") {
                sideShiftRef.current = -1;
            }
            if (e.key === "ArrowRight") {
                sideShiftRef.current = 1;
            }
            if (e.key === "ArrowUp") {
                isRotate.current = true;
            }
        }

        window.addEventListener("keydown", handleKeys)
        return () => {
            window.removeEventListener("keydown", handleKeys)
        }
    }, [])

    return (
        <div className="Matrix">
            <h1 className="Title">Matrix, Tetromino</h1>
            <div className="Message">INFO : {message}</div>
    
            <div className="GameContainer"> 
                {/* Left Side: The Board */}
                <div className="Board" id="matrix_board">
                    <canvas ref={canvasRef}></canvas>
                </div>
    
                {/* Right Side: The Controls */}
                <div className="controlPanel">
                    <div className="ControlsGroup">
                        <button className="spaceBar" onClick={handleStart}>
                            {start ? "Restart Game" : "Start Game"}
                        </button>
    
                        <div className="DPad">
                            <button className="upArrow" onClick={() => (isRotate.current = true)}>Rotate</button>
                            <div className="HorizontalArrows">
                                <button className="leftArrow" onClick={() => (sideShiftRef.current = -1)}>Left</button>
                                <button className="rightArrow" onClick={() => (sideShiftRef.current = 1)}>Right</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}