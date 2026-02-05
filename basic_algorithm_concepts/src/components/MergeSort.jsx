import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/MergeSort.css";
import morseCode from "../data/morseCode";

const WORDS = [
    "ADVERSARIES",
    "BLACKBOXES",
    "CIPHERTEXT",
    "COMPROMISE",
    "CONSPIRACY",
    "DECRYPTING",
    "DECEPTIONS",
    "ENCRYPTION",
    "INFILTRATE",
    "INTERCEPTS",
    "PROPAGANDA",
    "REDACTIONS",
    "SUBTERFUGE",
    "TECHNOLOGY",
    "BLACKMAILED"
];

const BOX_SIZE = 50;
const GAP = 10;
const LEVELS_SETUP = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2], [5, 5], [10]];

export default function MergeSortGame() {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const [pageSize, setPageSize] = useState(null);

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("merge_sort_board");
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

    // Game State
    const [isLoaded, setIsLoaded] = useState(false);
    const [gameState, setGameState] = useState({
        word: "",
        layers: [[], [], [], []], // Stores the tiles at each merge level
        currentLevel: 0,
        activeMergeIndex: 0, // Which group of the next level are we filling?
        message: "Press Start to begin your Mission"
    });

    // 1. Preload Assets
    useEffect(() => {
        const entries = Object.entries(morseCode);
        let loadedCount = 0;
        entries.forEach(([id, data]) => {
            const img = new Image();
            img.src = data.url;
            img.onload = () => {
                imagesRef.current[id] = img;
                loadedCount++;
                if (loadedCount === entries.length) setIsLoaded(true);
            };
        });
    }, []);

    // 2. Initialize Game
    const startMission = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)].substring(0, 10);
        const jumbled = word.split('').map((char, i) => ({ char, id: i }))
            .sort(() => Math.random() - 0.5);
        console.log(word)
        console.log(jumbled)
        setGameState({
            word,
            layers: [jumbled, [], [], []],
            currentLevel: 0,
            activeMergeIndex: 0,
            message: "Analyze Morse: Merge the smallest units first!"
        });
    };

    // 3. Drawing Engine
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !pageSize) return;
        const ctx = canvas.getContext("2d");
        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#1a262e"; // Spy Theme Dark
        ctx.fillRect(0, 0, width, height);

        const startX = width / 2 - ((BOX_SIZE + GAP) * 10) / 2;
        const startY = 100;

        // Draw the 4 Merge Sort Tiers
        for (let row = 0; row < 4; row++) {
            let xOffset = startX;
            const rowY = startY + row * (BOX_SIZE + 60);

            // Draw Group Containers (The Boxes)
            let currentGroupStart = xOffset;
            LEVELS_SETUP[row].forEach((groupSize) => {
                const groupWidth = groupSize * (BOX_SIZE + GAP) - GAP;
                ctx.strokeStyle = row === gameState.currentLevel + 1 ? "#00ffcc" : "#3e5666";
                ctx.lineWidth = 2;
                ctx.strokeRect(currentGroupStart - 5, rowY - 5, groupWidth + 10, BOX_SIZE + 10);
                currentGroupStart += groupSize * (BOX_SIZE + GAP);
            });

            // Draw the Tiles
            gameState.layers[row].forEach((tile, col) => {
                const tileX = startX + col * (BOX_SIZE + GAP);

                // Draw Tile Background
                ctx.fillStyle = "#2c3e50";
                ctx.fillRect(tileX, rowY, BOX_SIZE, BOX_SIZE);

                // Draw Morse Image
                if (imagesRef.current[tile.char]) {
                    ctx.drawImage(imagesRef.current[tile.char], tileX + 5, rowY + 5, BOX_SIZE - 10, BOX_SIZE - 10);
                }
            });
        }
    }, [gameState, pageSize]);

    // 4. Handle Interaction
    const handleCanvasClick = (e) => {
        if (gameState.currentLevel >= 3) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const startX = canvasRef.current.width / 2 - ((BOX_SIZE + GAP) * 10) / 2;
        const rowY = 100 + gameState.currentLevel * (BOX_SIZE + 60);

        // Check if user clicked a tile in the CURRENT active level
        const clickedCol = Math.floor((x - startX) / (BOX_SIZE + GAP));
        const withinY = y >= rowY && y <= rowY + BOX_SIZE;

        if (withinY && clickedCol >= 0 && clickedCol < 10) {
            validateMove(clickedCol);
        }
    };

    const validateMove = (colIndex) => {
        const currentLayer = gameState.layers[gameState.currentLevel];
        const clickedTile = currentLayer[colIndex];

        // Logical Merge Sort Check:
        // In a real merge, we only compare the 'heads' of two sub-groups.
        // For simplicity here: is this tile the smallest available in its sibling groups?
        // (You can expand this to strict merge sort pointer logic)

        const nextLayer = [...gameState.layers];
        nextLayer[gameState.currentLevel + 1].push(clickedTile);

        setGameState(prev => ({
            ...prev,
            layers: nextLayer,
            message: `Decoded: ${clickedTile.char}`
        }));

        // Logic to progress level once row is full
        if (nextLayer[gameState.currentLevel + 1].length === 10) {
            setGameState(prev => ({ ...prev, currentLevel: prev.currentLevel + 1 }));
        }
    };

    useEffect(() => { draw(); }, [draw]);

    return (
        <div className="MergeSort">
            <h1 className="Title">OPERATION: MERGE SORT</h1>
            <div className="Message">
                <button onClick={startMission} className="StartBtn">INITIALIZE MISSION</button>
                {" " + gameState.message}
            </div>
            <div className="Board" id="merge_sort_board">
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                />
            </div>
        </div>
    );
}