import { useEffect, useRef, useState } from "react";
import "../styles/HeapSort.css";
import generateUniqueWeights from "../data/Helper";
import hand from "../assets/RescueCity/robot-arm_10739037.png";
import blast from "../assets/RescueCity/blast.png";

const shadesOfDanger = {
    0: "#F23322",
    1: "#F2620F",
    2: "#F28322",
    3: "#F2A413",
    4: "#F2BF27",
    5: "#2180A6"
}

const images = import.meta.glob("/src/assets/RescueCity/potions/*.png", {
    eager: true,
});

const imageList = Object.values(images).map(module => module.default);

export default function HeapSort({ }) {
    const [start, setStart] = useState(false);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState({ width: 100, height: 100 });
    const potionsRef = useRef([]);
    const targetPoint = useRef({ x: 0, y: 0 });
    const selectedPoint = useRef(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const handRef = useRef(null);
    const potionImagesRef = useRef([]);
    const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
    const imagePreference = useRef([]);
    const timeRecordRef = useRef(0);
    const timerRef = useRef(false);
    const timer = useRef(0);
    const lastTimeRef = useRef(0);
    const selectedIndex = useRef(null);
    const isBlast = useRef(false);
    const blastRef = useRef(null);
    const explosionProgress = useRef(0); // 0 to 1

    useEffect(() => {
        let count = 0;
        const handleCount = () => {
            count++;
            if (count == 2 + imageList.length) {
                setIsLoaded(true);
            }
        }

        const imgHand = new Image();
        imgHand.src = hand;
        imgHand.onload = handleCount;
        handRef.current = imgHand;

        imageList.forEach((value, index) => {
            const imgP = new Image();
            imgP.src = value;
            imgP.onload = handleCount;
            potionImagesRef.current.push(imgP);
        })

        const imgB = new Image();
        imgB.src = blast;
        imgB.onload = handleCount;
        blastRef.current = imgB;

    }, [])

    const potionCreator = () => {
        const n = 2 * Math.pow(2, 4) - 1;
        const array = generateUniqueWeights(n, 1, 100);
        const heap = heapify(array);
        return heap;
    }

    const heapify = (arr) => {
        const maxCausalityHeap = [...arr];
        const size = maxCausalityHeap.length;

        // Start from last non-leaf node
        for (let i = Math.floor(size / 2); i >= 0; i--) {
            heapifyDown(maxCausalityHeap, i, size);
        }

        return maxCausalityHeap;
    };

    const heapifyDown = (heap, index, size) => {
        let largest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left < size && heap[left] > heap[largest]) {
            largest = left;
        }

        if (right < size && heap[right] > heap[largest]) {
            largest = right;
        }

        if (largest !== index) {
            [heap[index], heap[largest]] = [heap[largest], heap[index]];
            heapifyDown(heap, largest, size);
        }
    };

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementsByClassName("HeapSort")[0];
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

    const header = (ctx, width, height) => {
        // header

        ctx.save();
        ctx.beginPath();

        ctx.shadowColor = "#15BFA0";
        ctx.shadowBlur = 15;
        let font = height / 20;
        ctx.font = `${font}px "Rye", serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        ctx.fillStyle = "#15BFA0";
        ctx.fillText("The Sorcerer’s Pantry", 10, 10);

        if (timerRef.current) {
            let h = height / 2 - 200;
            font = height / 40;
            ctx.font = `${font}px "Rye", serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(timer.current, width / 2, (h + 10) / 2);
        }

        if (timerRef.current) {
            const panicRatio = 1 - (timer.current / 5000); // 0 at 5s, 1 at 0s

            // Pulsing Red Background Glow
            const pulse = Math.sin(Date.now() / 100) * 0.1 + 0.1;
            ctx.fillStyle = `rgba(242, 51, 34, ${panicRatio * pulse})`;
            ctx.fillRect(0, 0, width, height);

            // Timer Text
            ctx.fillStyle = timer.current < 2000 ? "#F23322" : "#F2E85C";
            ctx.font = `${height / 30}px "Rye", serif`;
            ctx.textAlign = "center";
            ctx.fillText(`STABILIZE: ${(timer.current / 1000).toFixed(2)}s`, width / 2, height / 10);
        }

        ctx.restore();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !pageSize || !isLoaded) return;

        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;
        header(ctx, width, height);

        if (potionImagesRef.current.every((img) => img.complete))
            setIsCanvasLoaded(true);

    }, [pageSize, isLoaded])

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const X = e.clientX - rect.left;
        const Y = e.clientY - rect.top;

        const { width, height } = pageSize;
        const arr = [...potionsRef.current];
        const pref = [...imagePreference.current];

        // These MUST match your drawRacks constants exactly
        const centerX = width / 2;
        const startY = height / 2 - 150;
        const h = 75;
        const w = 75;
        const verticalGap = 100;
        const levelWidth = width * 0.8;
        const maxLevels = 4;

        let clickedIndex = -1;
        let p = 0;

        // 1. Detect which element was clicked using tree coordinates
        for (let i = 0; i <= maxLevels; i++) {
            let nodesInLevel = Math.pow(2, i);
            let xStep = levelWidth / nodesInLevel;

            for (let j = 0; j < nodesInLevel; j++) {
                let currentIndex = p + j;
                if (currentIndex >= arr.length) break;

                // Replicate the exact X/Y calculation from drawRacks
                let nodeX = (centerX - levelWidth / 2) + (j * xStep) + (xStep / 2) - (w / 2);
                let nodeY = startY + i * verticalGap;

                // Collision detection
                if (X >= nodeX && X <= nodeX + w && Y >= nodeY && Y <= nodeY + h) {
                    clickedIndex = currentIndex;
                    break;
                }
            }
            if (clickedIndex !== -1) break;
            p += nodesInLevel;
        }

        // 2. Automatic Swap Logic (Heapify Down step)
        if (clickedIndex !== -1) {
            const left = 2 * clickedIndex + 1;
            const right = 2 * clickedIndex + 2;
            let largest = clickedIndex;

            if (left < arr.length && arr[left] > arr[largest]) {
                largest = left;
            }

            if (right < arr.length && arr[right] > arr[largest]) {
                largest = right;
            }

            if (largest !== clickedIndex) {
                // Swap values and image preferences
                [arr[clickedIndex], arr[largest]] = [arr[largest], arr[clickedIndex]];
                [pref[clickedIndex], pref[largest]] = [pref[largest], pref[clickedIndex]];

                potionsRef.current = arr;
                imagePreference.current = pref;

                // // Visual feedback: briefly highlight the new position
                // selectedIndex.current = largest;
                // setTimeout(() => {
                //     if (selectedIndex.current === largest) selectedIndex.current = null;
                // }, 200);
                selectedPoint.current = true; // Briefly change cursor scale
                setTimeout(() => selectedPoint.current = false, 150);
            }
        }
    };

    const handleMouseOver = (e) => {
        targetPoint.current = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY
        }
    }

    const targetCursor = (ctx) => {
        const r = selectedPoint.current ? 40 : 60;
        let { x, y } = targetPoint.current;
        ctx.drawImage(handRef.current, x - r / 2, y - r / 2, r, r);
    }

    const drawRacks = (ctx, width, height, time, amplitudes) => {
        let arr = potionsRef.current;
        const potions = potionImagesRef.current;
        const potionPref = imagePreference.current;

        const centerX = width / 2;
        const startY = height / 2 - 150;
        const h = 75;
        const w = 75;
        const verticalGap = 100; // Space between levels

        let p = 0; // Global index tracker

        // Set font styles
        ctx.font = `${h / 3}px "Rye", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Depth of the tree (max levels)
        const maxLevels = 4;

        for (let i = 0; i <= maxLevels; i++) {
            let nodesInLevel = Math.pow(2, i);

            // The horizontal "spread" for this level
            // Level 0 has one spot, Level 1 has 2, etc.
            // We use a denominator that shrinks to space nodes evenly
            let levelWidth = width * 0.8;
            let xStep = levelWidth / nodesInLevel;

            for (let j = 0; j < nodesInLevel; j++) {
                let currentIndex = p + j;
                if (currentIndex >= arr.length) break;

                // Calculate exact X and Y for this specific node
                // This centers the level and spaces nodes by xStep
                let nodeX = (centerX - levelWidth / 2) + (j * xStep) + (xStep / 2) - (w / 2);
                let nodeY = startY + i * verticalGap;

                let amps = amplitudes[currentIndex] * Math.sin((time / 1000) * 2 * Math.PI);

                // --- DRAW CONNECTIONS TO CHILDREN ---
                const leftChild = 2 * currentIndex + 1;
                const rightChild = 2 * currentIndex + 2;

                ctx.save();
                ctx.strokeStyle = "rgba(21, 191, 160, 0.3)";
                ctx.lineWidth = 2;
                [leftChild, rightChild].forEach((childIdx, isRight) => {
                    if (childIdx < arr.length) {
                        // Calculate child position for line drawing
                        let childLevel = i + 1;
                        let childLevelNodes = Math.pow(2, childLevel);
                        let childXStep = levelWidth / childLevelNodes;
                        let childInLevelIdx = (j * 2) + (isRight ? 1 : 0);

                        let childX = (centerX - levelWidth / 2) + (childInLevelIdx * childXStep) + (childXStep / 2);
                        let childY = startY + childLevel * verticalGap;

                        ctx.beginPath();
                        ctx.moveTo(nodeX + w / 2, nodeY + h);
                        ctx.lineTo(childX, childY);
                        ctx.stroke();
                    }
                });
                ctx.restore();

                // --- DRAW POTION ---

                // Highlight if selected
                if (selectedIndex.current === currentIndex) {
                    ctx.save();
                    ctx.shadowColor = "yellow";
                    ctx.shadowBlur = 30;
                    ctx.strokeStyle = "yellow";
                    ctx.lineWidth = 3;
                    ctx.strokeRect(nodeX, nodeY + amps, w, h);
                    ctx.restore();
                }

                // Highlight Violation (Smaller than children)
                if ((leftChild < arr.length && arr[currentIndex] < arr[leftChild]) ||
                    (rightChild < arr.length && arr[currentIndex] < arr[rightChild])) {
                    ctx.save();
                    ctx.strokeStyle = shadesOfDanger[0];
                    ctx.lineWidth = 3;
                    ctx.strokeRect(nodeX - 5, nodeY + amps - 5, w + 10, h + 10);
                    ctx.restore();
                }

                // Draw the actual image
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#15BFA0";
                ctx.drawImage(potions[potionPref[currentIndex]], nodeX, nodeY + amps, w, h);

                // Draw Label background and text
                ctx.shadowBlur = 0;
                ctx.fillStyle = "rgba(0,0,0,0.7)";
                ctx.fillRect(nodeX, nodeY + amps + (2 * h) / 4, w, h / 3);
                ctx.fillStyle = "#F2E85C";
                ctx.fillText(arr[currentIndex], nodeX + w / 2, nodeY + amps + (3 * h) / 4);
                ctx.restore();
            }
            p += nodesInLevel;
        }

        // Sparkle only at the root (index 0)
        sparkle(ctx, centerX - w / 2, startY, w, h);
    }

    const sparkle = (ctx, x, y, w, h) => {
        ctx.fillStyle = "white";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";
        for (let i = 0; i < 5; i++) {
            let px = x + Math.floor(Math.random() * w);
            let py = y + Math.floor(Math.random() * h);
            ctx.beginPath();
            ctx.arc(px, py, Math.floor(Math.random() * 5 + 1), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const drawBlast = (time) => {
        const ctx = ctxRef.current;
        const { width, height } = pageSize;
        if (explosionProgress.current <= 0) return;

        ctx.save();

        // 1. Initial Build-up (The "Rumble")
        if (explosionProgress.current < 0.3) {
            const intenseShake = 20 * explosionProgress.current;
            ctx.translate(Math.random() * intenseShake, Math.random() * intenseShake);
            // Draw the racks under the shake effect
            draw(time, potionsRef.current.map(() => Math.floor(Math.random() * 20) + 10));
        }

        // 2. The Big White Flash
        const flashAlpha = explosionProgress.current < 0.5 ? explosionProgress.current * 2 : 1 - (explosionProgress.current - 0.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);

        // 3. Draw the Blast Asset in the center
        const bW = 400 * explosionProgress.current;
        const bH = 400 * explosionProgress.current;
        ctx.globalAlpha = 1 - explosionProgress.current;
        ctx.drawImage(blastRef.current, width / 2 - bW / 2, height / 2 - bH / 2, bW, bH);

        // 4. Cinematic Text
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#F23322";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 15;
        ctx.font = `italic bold ${height / 12}px "Rye", serif`;
        ctx.textAlign = "center";
        ctx.fillText("CRITICAL FAILURE", width / 2, height / 2);

        ctx.restore();

        explosionProgress.current += 0.015;
        if (explosionProgress.current > 1) {
            setStart(false);
            isBlast.current = false;
            explosionProgress.current = 0;
        }
    }

    const draw = (time, amplitudes) => {
        const ctx = ctxRef.current;
        if (!ctx || !canvasRef.current) return;

        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);

        if (!targetPoint.current) return;

        if (!start) {
            // Show Instructions if game hasn't started
            drawInstructions(ctx, width, height);
        } else {
            // Show Game if it has started
            header(ctx, width, height);
            drawRacks(ctx, width, height, time, amplitudes);
        }
    
        targetCursor(ctx);
        targetCursor(ctx);
    }

    useEffect(() => {
        if (!isCanvasLoaded) return;
        const amplitudes = potionsRef.current.map(() => Math.floor(Math.random() * 5) + 2);
        let frame;

        const animate = (time) => {
            // Calculate Delta Time (time since last frame)
            const deltaTime = time - lastTimeRef.current;
            lastTimeRef.current = time;

            // --- GAME LOGIC START ---

            // Update Global Clock
            timeRecordRef.current += Math.floor(deltaTime);

            // Handle the Panic Timer
            if (timerRef.current) {
                timer.current -= Math.floor(deltaTime);
                if (timer.current <= 0) {
                    timer.current = 0;
                    timerRef.current = false;
                    checkBlastCondition();
                }
            }

            // Trigger Extraction every 15 seconds
            if (Math.floor(timeRecordRef.current / 15000) > Math.floor((timeRecordRef.current - deltaTime) / 15000) && !isBlast.current) {
                triggerExtraction();
            }

            // Add element every 25 seconds
            if (Math.floor(timeRecordRef.current / 25000) > Math.floor((timeRecordRef.current - deltaTime) / 25000) && !isBlast.current) {
                addElement();
            }

            // --- GAME LOGIC END ---

            !isBlast.current ? draw(time, amplitudes) : drawBlast(time);
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [isCanvasLoaded, start]);

    const triggerExtraction = () => {
        let arr = [...potionsRef.current];
        let pref = [...imagePreference.current];

        if (arr.length > 1) {
            // Heap Sort Step: Move last leaf to root
            arr[0] = arr.pop();
            pref[0] = pref.pop();

            potionsRef.current = arr;
            imagePreference.current = pref;

            // Start the "Panic Timer"
            timer.current = 5000;
            timerRef.current = true;
        }
    };

    const addElement = () => {
        let arr = [...potionsRef.current];
        let pref = [...imagePreference.current];

        if (arr.length > 1) {
            arr.push(Math.ceil(Math.random() * 100));
            pref.push(Math.floor(Math.random() * imageList.length));

            potionsRef.current = arr;
            imagePreference.current = pref;

            // Start the "Panic Timer"
            timer.current = 5000;
            timerRef.current = true;
        }
    }

    const checkBlastCondition = () => {
        const arr = potionsRef.current;
        // Check if the root is smaller than either child
        const isViolated = (arr[0] < arr[1]) || (arr[0] < arr[2]);

        if (isViolated) {
            // alert("BOOM! The Pantry Exploded!");
            // setStart(false); // Stop the game
            isBlast.current = true;
            explosionProgress.current = 0.01;
        }
    };

    const handleStart = () => {
        const heapArr = potionCreator();
        potionsRef.current = heapArr;
        imagePreference.current = heapArr.map(() => Math.floor(Math.random() * imageList.length));
        
        // RESET ALL REFS
        lastTimeRef.current = performance.now(); // Critical fix
        timeRecordRef.current = 0;
        timer.current = 0;
        timerRef.current = false;
        isBlast.current = false;
        explosionProgress.current = 0;
        
        setStart(true);
    }

    const drawInstructions = (ctx, width, height) => {
        ctx.save();
        
        // Darken the background for readability
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, height);
    
        // --- BACKSTORY ---
        ctx.fillStyle = "#15BFA0";
        ctx.font = `${height / 25}px "Rye", serif`;
        ctx.textAlign = "center";
        ctx.fillText("The Alchemist's Burden", width / 2, height * 0.15);
    
        ctx.fillStyle = "#F2E85C";
        ctx.font = `${height / 50}px "serif"`;
        const story = [
            "The Great Sorcerer is brewing the Elixir of Ages.",
            "He demands the heaviest ingredients first to stabilize the cauldron.",
            "As his apprentice, you must keep the heaviest potions at the very top.",
            "If a lighter potion reaches the top when he extracts... THE PANTRY EXPLODES."
        ];
        story.forEach((line, i) => {
            ctx.fillText(line, width / 2, height * 0.25 + (i * 30));
        });
    
        // --- HOW TO PLAY ---
        
        ctx.fillStyle = "#15BFA0";
        ctx.font = `${height / 30}px "Rye", serif`;
        ctx.fillText("Mastering the Pantry", width / 2, height * 0.5);
    
        const rules = [
            "🧪 TOP POTION: Must always be the largest number.",
            "🖱️ CLICK: Swaps a potion with its LARGEST child to sink it down.",
            "⏲️ PANIC: When a potion is removed, you have 5s to fix the tree.",
            "💥 BLAST: If the top isn't the biggest when time is up—BOOM!"
        ];
        
        ctx.textAlign = "left";
        ctx.font = `${height / 55}px "serif"`;
        rules.forEach((rule, i) => {
            ctx.fillText(rule, width * 0.25, height * 0.6 + (i * 35));
        });
    
        // --- START PROMPT ---
        ctx.textAlign = "center";
        ctx.fillStyle = "#F2E85C";
        ctx.font = `italic ${height / 40}px "Rye", serif`;
        // Pulsing effect for the start text
        const pulse = Math.abs(Math.sin(Date.now() / 500));
        ctx.globalAlpha = pulse;
        ctx.fillText("DOUBLE CLICK TO BEGIN THE RITUAL", width / 2, height * 0.85);
    
        ctx.restore();
    };

    return (
        <div className="HeapSort">
            <canvas ref={canvasRef}
                onClick={handleCanvasClick}
                onDoubleClick={handleStart}
                style={{ cursor: "none" }}
                onMouseMove={handleMouseOver}
                onMouseDown={() => selectedPoint.current = true}
                onMouseUp={() => selectedPoint.current = false}></canvas>
        </div>
    )
}