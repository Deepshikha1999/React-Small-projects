import { useEffect, useRef, useState } from "react";
import "../styles/QuickSort.css";

const generateUniqueWeights = (length, min, max) => {
    const weights = new Set();
    while (weights.size < length) {
        weights.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(weights);
};

const LEVELS = [
    { name: "Clerk", n: 7, speed: 0.25, lives: 3, bugs: 0 },
    { name: "Manager", n: 15, speed: 0.35, lives: 3, bugs: 5 },
    { name: "Director", n: 30, speed: 0.5, lives: 5, bugs: 10 }
];

const introductryText = `📦 Quick Start: The Chaos ClerkYour goal is to sort the warehouse using the Quicksort Algorithm.\n     1. The PivotCheck the Weight at the top of the screen. This is your target.\n     2. The ScannerWhen a package enters the box, swipe based on its weight:\n        ⬅️ Swipe LEFT: If the package is Lighter or Equal ($\le$ Pivot).\n        ➡️ Swipe RIGHT: If the package is Heavier ($>$ Pivot).\n     3. Avoid Bugs 🪲Do not swipe red hazard crates or bugs.\n       Let them pass, or you'll lose a Life Line!\n     4. GoalClear the belt to "lock" the pivot in gold.\n\nComplete the Progress Map at the top to win the level and get promoted.`

export default function QuickSort({ }) {
    // --- State ---
    const [start, setStart] = useState(false);
    const [canvasReady, setCanvasReady] = useState(false);
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
    const [message, setMessage] = useState("Tap to Start!");
    const [levelIdx, setLevelIdx] = useState(0);

    // --- Core Engine Refs ---
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const swipeRef = useRef(null);
    const swapPosRef = useRef(0);

    // --- Quicksort Logic Refs ---
    const originalArrayRef = useRef([]); // Master list for progress map
    const listOfItems = useRef([]);      // Active items on the belt
    const lockedValuesRef = useRef(new Set()); // Successfully sorted values
    const pivot = useRef(0);             // The "Judge" for current round
    const stackRef = useRef([]);         // Quicksort "To-Do" piles
    const leftListRef = useRef([]);      // Temporary left pile
    const rightListRef = useRef([]);     // Temporary right pile
    const lifeLineRef = useRef(3);

    // Track where the current partition starts in the original array
    const currentPileStartIndex = useRef(0);
    const bugIndicesRef = useRef(new Set());

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("quick_sort_board");
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !pageSize) return;

        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;

        setCanvasReady(true);

    }, [pageSize])

    const startGame = () => {
        const config = LEVELS[levelIdx];
        const arr = generateUniqueWeights(config.n, 10, 99);
        originalArrayRef.current = [...arr];
        lockedValuesRef.current = new Set();
        stackRef.current = [{ pile: arr, startIndex: 0 }];
        lifeLineRef.current = 3;

        setupNextRound();
        setStart(true);
        setMessage(`Level: ${config.name}`);
        lifeLineRef.current = config.lives;
    }

    const setupNextRound = () => {
        if (stackRef.current.length === 0) {
            // VICTORY CONDITION
            if (levelIdx < LEVELS.length - 1) {
                setStart(false);
                setMessage(`Promoted! Next up: ${LEVELS[levelIdx + 1].name}`);
                setLevelIdx(prev => prev + 1);
            } else {
                setStart(false);
                setMessage("CEO: THE WAREHOUSE IS PERFECT!");
                setLevelIdx(0); // Reset for next play
            }
            return;
        }

        const task = stackRef.current.pop();
        const nextPile = task.pile;
        const startIndex = task.startIndex;

        // If only 1 item, it's already sorted by default
        if (nextPile.length <= 1) {
            if (nextPile.length === 1) lockedValuesRef.current.add(nextPile[0]);
            setupNextRound();
            return;
        }

        currentPileStartIndex.current = startIndex;
        const p = nextPile[Math.floor(Math.random() * nextPile.length)];
        pivot.current = p;
        // listOfItems.current = nextPile.filter(item => item !== p);

        const items = nextPile.filter(item => item !== p);
        listOfItems.current = items;

        // GENERATE BUGS FOR THIS ROUND
        bugIndicesRef.current = new Set();
        const config = LEVELS[levelIdx];
        let bugsCreated = 0;

        // Attempt to turn items into bugs based on level config
        for (let i = 0; i < items.length; i++) {
            if (bugsCreated >= config.bugs) break;
            // 30% chance an item is a bug
            if (Math.random() > 0.7) {
                bugIndicesRef.current.add(i);
                bugsCreated++;
            }
        }

        leftListRef.current = [];
        rightListRef.current = [];
    };

    const handleInteraction = (itemInScanner) => {
        if (!itemInScanner || swapPosRef.current === 0) return;

        if (itemInScanner.isBug) {
            lifeLineRef.current -= 1; // Penalty for touching a bug!
            setMessage("Watch out! That's a BUG!");
            swapPosRef.current = 0;
            return;
        }

        const p = pivot.current;
        const pos = swapPosRef.current; // -1 for Left, 1 for Right
        const weight = itemInScanner.weight;

        // Quicksort Logic: Weights <= Pivot go Left, Weights > Pivot go Right
        const isCorrectLeft = pos < 0 && weight <= p;
        const isCorrectRight = pos > 0 && weight > p;

        if (isCorrectLeft || isCorrectRight) {
            if (isCorrectLeft) leftListRef.current.push(weight);
            else rightListRef.current.push(weight);

            // Nullify the item on the belt (removes it from view)
            listOfItems.current[itemInScanner.index] = null;
        } else {
            lifeLineRef.current -= 1; // Wrong side!
        }

        // Check if current partition is empty (Ignoring bugs)
        const isPartitionComplete = listOfItems.current.every((item, idx) => {
            // If it's a bug OR it has been nullified (sorted), it counts as "done" for this check
            return bugIndicesRef.current.has(idx) || item === null;
        });

        // Check if current partition is empty
        if (isPartitionComplete) {
            lockedValuesRef.current.add(p);

            // 1. Reconstruct the sorted segment for the Progress Map
            const sortedSegment = [...leftListRef.current, p, ...rightListRef.current];
            const start = currentPileStartIndex.current;

            // 2. Update master array in-place so bar shows movement
            sortedSegment.forEach((val, idx) => {
                originalArrayRef.current[start + idx] = val;
            });

            // 3. Push sub-tasks with calculated start indices
            if (rightListRef.current.length > 0) {
                stackRef.current.push({
                    pile: [...rightListRef.current],
                    startIndex: start + leftListRef.current.length + 1
                });
            }
            if (leftListRef.current.length > 0) {
                stackRef.current.push({
                    pile: [...leftListRef.current],
                    startIndex: start
                });
            }

            setupNextRound();
        }
        swapPosRef.current = 0; // Reset swipe input
    };

    // --- Drawing Functions ---
    const drawPackage = (ctx, x, y, weight) => {
        const w = 100, h = 100;
        ctx.fillStyle = "#A67B5B"; ctx.fillRect(x + 5, y + 5, w, h); // Shadow
        ctx.fillStyle = "#D9B26A"; ctx.fillRect(x, y, w, h); // Box Body
        ctx.fillStyle = "#BF1F5A"; ctx.fillRect(x + 15, y + 25, 70, 50); // Label

        ctx.fillStyle = "#D5E5F2";
        ctx.font = 'bold 20px "Rye"';
        ctx.textAlign = "center";
        ctx.fillText(`${weight} kg`, x + w / 2, y + h / 2 + 8);
    };

    const drawScanner = (ctx, width, height) => {
        const x = width / 2 - 150, y = height - 300, w = 300, h = 300;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 7;
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);
        return { x, y, w, h };
    };

    //Conveyor Belt animation
    const drawConveyorBelt = (ctx, width, height, time) => {
        ctx.fillStyle = "#D97855";
        ctx.fillRect(0, height - 100, width, 100);

        const slatWidth = 12;
        const gap = 20;
        const speed = 0.05; // belt speed
        const offset = (time * speed) % (slatWidth + gap);

        ctx.fillStyle = "#8C4A32";
        for (let x = -offset; x < width; x += slatWidth + gap) {
            ctx.fillRect(x, height - 100, slatWidth, 100);
        }

        ctx.strokeStyle = "#26211F";
        ctx.lineWidth = 20;
        ctx.strokeRect(10, height - 90, width - 20, 80);
    }

    const drawProgressMap = (ctx, width) => {
        const arr = originalArrayRef.current;
        const size = 35, pad = 10;
        const startX = (width - (arr.length * (size + pad))) / 2;
        arr.forEach((val, i) => {
            const isLocked = lockedValuesRef.current.has(val);
            ctx.fillStyle = isLocked ? "#FFD700" : "#A67B5B";
            ctx.fillRect(startX + i * (size + pad), 120, size, size);
            ctx.fillStyle = isLocked ? "black" : "white";
            ctx.font = "12px Arial";
            ctx.fillText(val, startX + i * (size + pad) + size / 2, 120 + size / 2);
        });
    };

    const drawBug = (ctx, x, y) => {

        const w = 100, h = 100;
        ctx.fillStyle = "#A67B5B"; ctx.fillRect(x + 5, y + 5, w, h); // Shadow
        ctx.fillStyle = "#D9B26A"; ctx.fillRect(x, y, w, h); // Box Body
        ctx.fillStyle = "#BF1F5A"; ctx.fillRect(x + 15, y + 25, 70, 50); // Label

        ctx.fillStyle = "#D5E5F2";
        ctx.font = 'bold 20px "Rye"';
        ctx.textAlign = "center";
        ctx.fillText("BANNED", x + w / 2, y + h / 2 + 8);
    };

    // Helper to keep drawUpdate clean
    const drawUI = (ctx, width) => {
        const config = LEVELS[levelIdx];
        // Clerk ID card
        ctx.fillStyle = "beige";
        ctx.fillRect(20, 20, 120, 160);
        // ctx.strokeStyle = "#26211F";
        // ctx.strokeRect(20, 20, 120, 160);
        ctx.fillStyle = "black";
        ctx.fillText(`${config.name}`, 80, 100);

        // Pivot display
        ctx.fillStyle = "beige";
        ctx.fillRect(width / 2 - 75, 20, 150, 50);
        // ctx.strokeRect(width / 2 - 75, 20, 150, 50);
        ctx.fillStyle = "black";
        ctx.fillText(pivot.current + " " + "kg", width / 2, 50);

        // Life line
        const life = lifeLineRef.current;
        const wx = 40;
        ctx.fillStyle = "crimson";
        for (let i = 0; i < life; i++) {
            ctx.beginPath();
            ctx.arc(width - 180 + (i * 50), 45, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add the Progress Map here
        drawProgressMap(ctx, width);
    };

    const drawUpdate = (time) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawConveyorBelt(ctx, canvas.width, canvas.height, time);
        const scanner = drawScanner(ctx, canvas.width, canvas.height);

        // Render Belt Items
        const items = listOfItems.current;

        const activeCount = items.filter(i => i !== null).length;
        const config = LEVELS[levelIdx];

        const initialCount = originalArrayRef.current.length;
        const spacing = canvas.width / 2.5;
        const totalWidth = initialCount * spacing;
        const speed = config.speed;
        const speedBoost = (config.n / (activeCount + 1)) * 0.01;
        const currentSpeed = config.speed + speedBoost;
        const globalOffset = (time * speed) % (totalWidth);
        let productInScanner = null;

        items.forEach((weight, i) => {
            if (weight === null) return;
            const x = ((i * spacing + globalOffset) % (totalWidth)) - 100;
            const y = canvas.height - 200;

            if (bugIndicesRef.current.has(i)) {
                drawBug(ctx, x, y);
            } else {
                drawPackage(ctx, x, y, weight);
            }

            // Detection logic
            if (x > scanner.x && x < scanner.x + scanner.w) {
                productInScanner = {
                    weight,
                    index: i,
                    isBug: bugIndicesRef.current.has(i) // Add this flag!
                };
            }
        });

        handleInteraction(productInScanner);
        drawUI(ctx, canvas.width);

        // FORCE RESET HERE
        swapPosRef.current = 0;

        if (lifeLineRef.current <= 0) {
            setStart(false);
            setMessage("YOU'RE FIRED!");
            setLevelIdx(0);
        }
    };

    const drawStartPage = () => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;

        if (!ctx || !canvas) return;

        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        const txt = "Let's Start working!";
        let txtLen = ctx.measureText(txt).width + 20;

        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(width / 2 - txtLen / 2 - 150, height / 4 - 50, txtLen + 320, 120)

        ctx.fillStyle = "#F2F0CE";
        ctx.strokeStyle = "#D9C196";
        ctx.lineWidth = 25;

        ctx.fillRect(width / 2 - txtLen - 100, height / 4 - 50, txtLen + 300, 100);
        ctx.strokeRect(width / 2 - txtLen - 100, height / 4 - 50, txtLen + 300, 100);

        ctx.fillStyle = "black";
        let font = 35;
        ctx.font = `${font}px "Rye", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("Let's Start working", width / 2, height / 4);

        font = 20;
        ctx.font = `${font}px "Rye", serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "white";
        const lines = introductryText.split("\n");
        let x = width / 8;
        let y = 300;
        lines.forEach((line, i) => {
            const l = ctx.measureText(line).width;
            ctx.fillText(line, x, y);
            y += font + 5;
        })

    }

    useEffect(() => {
        if (!canvasReady) return;
        if (!start) {
            drawStartPage();
            return;
        }
        let frame;
        const animate = (time) => {
            drawUpdate(time);
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [start, canvasReady])

    const startMouseSwipe = (e) => {
        const { offsetX } = e.nativeEvent;
        if (!start && canvasReady) {
            startGame();
        }
        else {
            swipeRef.current = {
                x: offsetX
            }
        }
    }

    const endMouseSwipe = (e) => {
        if (!swipeRef.current) return;

        const deltaX = e.nativeEvent.offsetX - swipeRef.current.x;

        // const { offsetX} = e.nativeEvent;
        // const { x } = swipeRef.current;

        // if (x > offsetX) {
        //     swapPosRef.current = -1;

        // }
        // else if (x < offsetX) {
        //     swapPosRef.current = 1;
        // }
        if (Math.abs(deltaX) > 40) swapPosRef.current = deltaX > 0 ? 1 : -1;
        swipeRef.current = null;
    }

    useEffect(() => {
        const handleKeys = (e) => {
            if (e.key === "ArrowLeft") swapPosRef.current = -1;
            else if (e.key === "ArrowRight") swapPosRef.current = 1;
            else if (e.key === " ") startGame();
        };

        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, []);

    return (
        <div className="QuickSort">
            <h1 className="Title" style={{
                color: "#F2AE30",
                fontFamily: `"Rye", serif`,
                fontWeight: `400`,
                fontStyle: `normal`,
                fontSize: "3rem",
                backdropFilter: "blur(15px)"
            }}>The Chaos Clerk!</h1>
            <div className="Message"
                style={{
                    color: "beige",
                    fontSize: "1.5rem",
                    fontFamily: `"Rye", serif`,
                    fontWeight: `400`,
                    fontStyle: `normal`,
                }}>{message}</div>
            <div className="Board" id="quick_sort_board">
                <canvas ref={canvasRef}
                    onMouseDown={startMouseSwipe}
                    onMouseUp={endMouseSwipe}
                    style={{
                        backdropFilter: "blur(5px)"
                    }}
                ></canvas>
            </div>
        </div >
    )
}