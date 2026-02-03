import "./../styles/Recursion.css";
import { useEffect, useRef, useState } from "react";
import endFlag from "./../assets/endFlag.png";
import startFlag from "./../assets/startFlag.png";
import triskele from "./../assets/triskele.png";
import bricks from "./../assets/line.png";
import player from "./../assets/pacman.png";


const N = 15;
const LEVELS = 10;
export default function Recursion({ }) {
    const [message, setMessage] = useState("Use arrow button to play the game, each level we need to pass the red box to reach the end");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState(null);
    const [currentLevel, setLevel] = useState(0);
    const playerRef = useRef({ x: 0, y: 0 })
    const [mazeLevels, setMazeLevels] = useState([]);
    const [gameOver, setGameOver] = useState([]);
    const startImg = useRef(null);
    const endImg = useRef(null);
    const triskeleImg = useRef(null);
    const brickImg = useRef(null);
    const playerImg = useRef(null);
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const checkLoaded = () => {
            loadedCount++;
            if (loadedCount === 5) setAssetsLoaded(true);
        };

        const sImg = new Image();
        sImg.src = startFlag;
        sImg.onload = checkLoaded;
        startImg.current = sImg;

        const eImg = new Image();
        eImg.src = endFlag;
        eImg.onload = checkLoaded;
        endImg.current = eImg;

        const tImg = new Image();
        tImg.src = triskele;
        tImg.onload = checkLoaded;
        triskeleImg.current = tImg;

        const bImg = new Image();
        bImg.src = bricks;
        bImg.onload = checkLoaded;
        brickImg.current = bImg;

        const pImg = new Image();
        pImg.src = player;
        pImg.onload = checkLoaded;
        playerImg.current = pImg;

    }, []);

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("recursion_board");
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

    const drawLayout = (ctx, levelInfo) => {

        const { n, hurdles, hiddenLayerPos, level } = levelInfo;
        const { width, height } = canvasRef.current;
        const gx = Math.floor(width / n);
        const gy = Math.floor(height / n);
        const x = 0;
        const y = 0;

        ctx.clearRect(x, y, width, height);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.fillStyle = "#385DA6";

        // Draw Grid Lines
        // ctx.beginPath();
        // for (let i = 0; i <= n; i++) {
        //     ctx.moveTo(x + i * gx, y);
        //     ctx.lineTo(x + i * gx, y + (n * gy));
        //     ctx.moveTo(x, y + i * gy);
        //     ctx.lineTo(x + (n * gx), y + i * gy);
        // }
        // ctx.stroke();

        // Draw Hurdles
        ctx.fillStyle = "brown";
        hurdles.forEach(h => {
            if (brickImg.current?.complete) {
                ctx.drawImage(brickImg.current,
                    x + h.x * gx, y + h.y * gy, gx, gy)
            }
            else {
                ctx.fillRect(x + h.x * gx, y + h.y * gy, gx, gy)
            }
        });

        // Draw Portal (The Red Square)
        ctx.fillStyle = "black";

        if (triskeleImg.current?.complete) {
            ctx.drawImage(triskeleImg.current,
                x + hiddenLayerPos.x * gx, y + hiddenLayerPos.y * gy, gx, gy)
        }
        else {
            ctx.fillRect(x + hiddenLayerPos.x * gx, y + hiddenLayerPos.y * gy, gx, gy);
        }

        // Level Info
        const w = Math.min(width / 2, height / 2);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.font = `${w}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("LEVEL " + level.toString(), width / 2, height / 2);

        //Start and Stop flags
        // Start Flag at (0,0)
        if (startImg.current?.complete) {
            ctx.drawImage(startImg.current, x, y, gx, gy);
        }

        // End Flag at (N-1, N-1)
        if (endImg.current?.complete) {
            ctx.drawImage(
                endImg.current,
                x + (n - 1) * gx,
                y + (n - 1) * gy,
                gx,
                gy
            );
        }

    };

    const drawCircle = (ctx, current, playerPos) => {
        const { n } = current;
        const { width, height } = canvasRef.current;
        const gx = Math.floor(width / n);
        const gy = Math.floor(height / n);
        const x = 0;
        const y = 0;
        // const { gx, gy, x, y } = current;
        const circleRad = Math.min(gx, gy) / 2.5;


        if (playerImg.current?.complete) {
            ctx.drawImage(playerImg.current,
                x + (playerPos.x * gx) + (gx / 2),
                y + (playerPos.y * gy),
                circleRad * 2, circleRad * 2)
        }
        else {
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(
                x + (playerPos.x * gx) + (gx / 2),
                y + (playerPos.y * gy) + (gy / 2),
                circleRad, 0, Math.PI * 2
            );
            ctx.fill();
        }
    };

    const pathFinder = (N, hiddenLayer) => {
        let startPt = { x: 0, y: 0 };
        let endPt = { x: N - 1, y: N - 1 };

        let path = findPathRecursiveWay(N, startPt, hiddenLayer, []);
        path = path.concat(findPathRecursiveWay(N, hiddenLayer, endPt, []))

        return path;
    }

    const findPathRecursiveWay = (N, current, target, path = []) => {
        if (current.x === target.x && current.y === target.y) {
            return [...path, [current.x, current.y]];
        }

        if (current.x >= N || current.y >= N || current.x > target.x || current.y > target.y) {
            return;
        }

        const newPath = [...path, [current.x, current.y]];
        const goRightFirst = Math.random() > 0.5;
        if (goRightFirst) {
            // Try Right, then Down
            return findPathRecursiveWay(N, { x: current.x + 1, y: current.y }, target, newPath) ||
                findPathRecursiveWay(N, { x: current.x, y: current.y + 1 }, target, newPath);
        } else {
            // Try Down, then Right
            return findPathRecursiveWay(N, { x: current.x, y: current.y + 1 }, target, newPath) ||
                findPathRecursiveWay(N, { x: current.x + 1, y: current.y }, target, newPath);
        }
    }

    const createMaze = (ctx, N, width, height) => {
        let x = 0;
        let y = 0;
        let w = width;
        let h = height;

        let levels = [];

        let validSpawns = [];
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if ((i == 0 && j == 0) || (i == (N - 1) && j == (N - 1))) continue;
                validSpawns.push({
                    x: i,
                    y: j
                })
            }
        }

        for (let k = 0; k < LEVELS; k++) {
            const cellW = w / N;
            const cellH = h / N;

            const levelSpawns = [...validSpawns];
            const hiddenIndex = Math.floor(Math.random() * levelSpawns.length);
            const hidden = { ...levelSpawns[hiddenIndex] };
            const pathsArr = pathFinder(N, hidden);
            const hurdles = levelSpawns.filter((value, index) => {
                // 1. Remove the target (hiddenIndex)
                if (index === hiddenIndex) return false;

                // 2. Remove if this coordinate exists ANYWHERE in the pathsArr
                const isOnPath = pathsArr.some(p => p[0] === value.x && p[1] === value.y);

                // We only keep it if it is NOT on the path
                return !isOnPath && Math.random() > 0.5;
            });
            const level = {
                level: k + 1,
                n: N,
                x,
                y,
                width: w,
                height: h,
                hiddenLayerPos: hidden,
                gx: cellW,
                gy: cellH,
                playerPos: { x: 0, y: 0 },
                path: [...pathsArr],
                hurdles: [...hurdles],
                isHiddenLayerPassed: false
            };

            levels.push(level);

            // shrink into selected cell
            x = x + hidden.x * cellW;
            y = y + hidden.y * cellH;
            w = cellW;
            h = cellH;
        }

        ctx.clearRect(0, 0, width, height);
        // levels.forEach(lvl => drawLayout(ctx, lvl));
        drawLayout(ctx, levels[0])
        drawCircle(ctx, levels[0], levels[0].playerPos);
        setMazeLevels(levels);
        setLevel(0);
        playerRef.current = levels[0].playerPos;
    };


    useEffect(() => {
        if (!assetsLoaded) return;
        if (!pageSize) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;

        createMaze(ctx, N, width, height);

    }, [pageSize, assetsLoaded])

    // Add this helper to your component to handle the actual rendering
    const renderCanvas = (ctx, levels, activeIdx, playerPos) => {
        if (!ctx || levels.length === 0 || !pageSize) return;
        const { width, height } = pageSize;
        const activeLevel = levels[activeIdx];

        ctx.clearRect(0, 0, width, height);

        if (activeIdx > 0) drawLayout(ctx, levels[activeIdx - 1]);
        drawLayout(ctx, activeLevel);
        drawCircle(ctx, activeLevel, playerPos);

    };

    const draw = (X, Y) => {
        if (!mazeLevels.length) return;

        // Use currentLevel to get current data
        const activeLevelIdx = currentLevel;
        const currentLayout = mazeLevels[activeLevelIdx];

        const nextX = Math.min(N - 1, Math.max(0, playerRef.current.x + X));
        const nextY = Math.min(N - 1, Math.max(0, playerRef.current.y + Y));

        // Collision
        if (currentLayout.hurdles.some(h => h.x === nextX && h.y === nextY)) return;

        playerRef.current = { x: nextX, y: nextY };

        // Handle Portals (Deeper)
        if (nextX === currentLayout.hiddenLayerPos.x && nextY === currentLayout.hiddenLayerPos.y && !currentLayout.isHiddenLayerPassed) {
            const newLevels = [...mazeLevels];
            newLevels[activeLevelIdx].isHiddenLayerPassed = true;
            if (activeLevelIdx < mazeLevels.length - 1) {
                setMazeLevels(newLevels);
                setLevel(activeLevelIdx + 1); // Increment correctly
                playerRef.current = { x: 0, y: 0 };
                return; // useEffect will handle the redraw
            }
        }

        // Handle Backtracking (Shallower)
        if (currentLayout.isHiddenLayerPassed && nextX === N - 1 && nextY === N - 1) {
            if (activeLevelIdx > 0) {
                setLevel(activeLevelIdx - 1);
                playerRef.current = { ...mazeLevels[activeLevelIdx - 1].hiddenLayerPos };
                return;
            } else {
                setGameOver(true);
                setMessage("Escape Success!");
            }
        }
        // Standard Redraw
        renderCanvas(ctxRef.current, mazeLevels, activeLevelIdx, playerRef.current);
    };

    // Separate useEffect for rendering updates
    useEffect(() => {
        if (pageSize && mazeLevels.length > 0) {
            renderCanvas(ctxRef.current, mazeLevels, currentLevel, playerRef.current);
        }
    }, [currentLevel, mazeLevels, pageSize]);

    useEffect(() => {
        const handleKeys = (e) => {
            let x = 0, y = 0;
            if (e.key === "ArrowRight") x = 1;
            else if (e.key === "ArrowLeft") x = -1;
            else if (e.key === "ArrowUp") y = -1;
            else if (e.key === "ArrowDown") y = 1;
            draw(x, y);
        }
        window.addEventListener("keydown", handleKeys);
        return () => {
            window.removeEventListener("keydown", handleKeys);
        }
    }, [mazeLevels, currentLevel, gameOver])

    return (
        <div className="Recursion">
            <h1 className="Title">Recursion</h1>
            <div className="Message">INFO : {message}</div>
            <div className="Board" id="recursion_board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}