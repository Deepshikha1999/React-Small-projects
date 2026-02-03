import { useEffect, useRef, useState } from "react";
import "./../styles/Stack.css";
import jar from "./../assets/door.png";
import win from "./../assets/unlock.png";

const COLORS = {
    1: "#C50036",
    2: "#155EE4",
    3: "#FFC820",
    4: "#006E78",
    5: "#FF0094"
}

function jumble(game) {
    // 1. Get all numbers from the filled stacks
    const elements = game.flat();
    // 2. Fisher-Yates Shuffle
    for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elements[i], elements[j]] = [elements[j], elements[i]];
    }
    // 3. Put them back into 5 stacks of 5
    const result = [];
    for (let i = 0; i < 5; i++) {
        result.push(elements.slice(i * 5, (i + 1) * 5));
    }
    // 4. Add the 2 empty buffer stacks
    result.push([], []);
    return result;
}

export default function Stack({ }) {
    const [message, setMessage] = useState("Goal: All color balls should be at one column. [doubleClick to restart| click to start| select columns to transfer balls]");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState(null);
    const n = 5;
    const properties = useRef(null);
    const jarImgRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const stackRef = useRef(null);
    const [chosenCol, setChosenCol] = useState(null);
    const [start, setStart] = useState(false);
    const winImgRef = useRef(null);

    useEffect(() => {
        let countLoad = 0;
        const handleLoad = () => {
            countLoad++;
            if (countLoad == 2)
                setIsLoaded(true);
        }

        const jImg = new Image();
        jImg.src = jar;
        jImg.onload = handleLoad;
        jarImgRef.current = jImg;

        const wImg = new Image();
        wImg.src = win;
        wImg.onload = handleLoad;
        winImgRef.current = wImg;

    }, [])


    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("stack_board");
            const { left, top } = divClass.getBoundingClientRect();
            setPageSize({
                width: divClass.clientWidth,
                height: divClass.clientHeight,
                x: left,
                y: top
            })
        }

        updatePageSize()
        window.addEventListener("resize", updatePageSize);
        return () => {
            window.removeEventListener("resize", updatePageSize);
        }
    }, [])

    const drawLayout = (ctx, width, height, arr, props) => {

        const chosen = chosenCol;
        ctx.fillStyle = "#262626";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "#594F46";
        ctx.lineWidth = 1;

        const w = props.w;
        ctx.font = `${Math.floor(w / 2) - 20}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < arr.length; i++) {

            if (chosen && chosen[0] == i) {
                ctx.fillStyle = "#9F22F2";
                ctx.fillRect(i * w + 4, 0 + 4, w - 8, height - 8);
            }
            if (chosen && chosen[1] == i) {
                ctx.fillStyle = "#030BA6";
                ctx.fillRect(i * w + 4, 0 + 4, w - 8, height - 8);
            }

            ctx.strokeRect(i * w, 0, w, height);

            let h = props.h;
            let r = Math.min(h / 2, w / 2) - 2;
            for (let j = 0; j < arr[i].length; j++) {

                ctx.fillStyle = COLORS[arr[i][j]];

                ctx.beginPath();
                ctx.arc(i * w + w / 2, j * h + h / 2, r - 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "black";
                // ctx.fillText(arr[i][j].toString(), i * w + w / 2, j * h + h / 2);
            }
        }

    }

    useEffect(() => {
        if (!pageSize || !isLoaded) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;

        canvas.width = width;
        canvas.height = height;

        let arr = Array.from({ length: n }, (_, i) => {
            return Array.from({ length: n }, (_, j) => i + 1)
        });

        arr.push([]);
        arr.push([]);

        const props = {
            w: width / arr.length,
            h: height / arr[0].length
        }
        properties.current = props;

        stackRef.current = arr;
        // drawLayout(ctx, width, height, arr, props);

        let s = Math.min(width, height);
        if (jarImgRef.current.complete) {
            ctx.drawImage(jarImgRef.current, width / 2 - s / 2, height / 2 - s / 2, s, s)
        }
        ctx.font = `${Math.floor(s / 4)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#BFD1D9";
        ctx.fillText("Knock to Unlock", width / 2, height / 2)

    }, [pageSize, isLoaded])


    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const arr = stackRef.current;
        const chosen = chosenCol;
        const props = properties.current;
        const winImg = winImgRef.current;

        if (!canvas || !ctx || !arr || !props) return;

        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        drawLayout(ctx, width, height, arr, props);

        if (!chosen || chosen.length <= 1) return;

        const fromIdx = chosen[0];
        const toIdx = chosen[1];
        const sourceStack = arr[fromIdx]; // Direct reference
        const targetStack = arr[toIdx];

        // 1. Validation
        if (sourceStack.length === 0 || targetStack.length >= n) {
            setChosenCol(null);
            return;
        }

        // 2. Determine Color and Count
        const colorToMove = sourceStack[0];
        const targetColor = targetStack[0];

        // If target isn't empty and colors don't match, cancel move
        if (targetStack.length > 0 && colorToMove !== targetColor) {
            setChosenCol(null);
            return;
        }

        // 3. Count how many of the SAME color are stacked at the top of Source
        let count = 0;
        while (count < sourceStack.length && sourceStack[count] === colorToMove) {
            count++;
        }

        // 4. Calculate available space in Target
        const spaceAvailable = n - targetStack.length;
        const amountToMove = Math.min(count, spaceAvailable);

        // 5. Execute Move
        for (let i = 0; i < amountToMove; i++) {
            const ball = sourceStack.shift();
            targetStack.unshift(ball);
        }

        const isWin = arr.every(stack =>
            stack.length === 0 || (stack.length === n && stack.every(ball => ball === stack[0]))
        );

        if (isWin) {
            setStart(false);
            drawLayout(ctx, width, height, arr, props);
            let s = Math.min(width / 2, height / 2);
            ctx.drawImage(winImg, width / 2 - s / 2, height / 2 - s / 2, s, s);
            ctx.font = `${Math.floor(s / 2) - 20}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#BFD1D9";
            ctx.fillText("Click to open next door", width / 2, height / 2)

        }

        stackRef.current = arr;
        setChosenCol(null);

    }

    useEffect(() => {
        if (!start) return;
        let frame;
        const animate = () => {
            draw();
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [chosenCol, start])

    const handleStart = () => {
        setStart(true);
        let arr = jumble(Array.from({ length: n }, (_, i) => {
            return Array.from({ length: n }, (_, j) => i + 1)
        }));

        stackRef.current = arr;
        setChosenCol(null);
    }

    const handleCanvasClick = (e) => {
        if (!start) {
            handleStart();
            return;
        }

        const { offsetX, offsetY } = e.nativeEvent;
        if (!canvasRef.current || !stackRef.current || !pageSize || !properties.current) return;
        const { width, height } = canvasRef.current;
        const arr = stackRef.current;
        const w = properties.current.w;

        for (let i = 1; i <= arr.length; i++) {
            let x = i * w;
            if (offsetX < x && offsetX >= x - w && offsetY >= 0 && offsetY < height) {
                setChosenCol(prev => {
                    if (!prev) return [(i - 1)];
                    let newArr = [...prev];
                    if (!newArr.includes(i - 1)) {
                        newArr.length == 2 && newArr.shift();
                        return [...newArr, (i - 1)];
                    }
                    else {
                        newArr.splice(newArr.indexOf(i - 1), 1)
                        return [...newArr];
                    }
                })
                return;
            }
        }

        setChosenCol(null);
    }

    return (
        <div className="Stack">
            <h1 className="Title">Stack, Arrange to unlock</h1>
            <div className="Message">{message}</div>
            <div className="Board" id="stack_board">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasClick}
                    onDoubleClick={handleStart}
                ></canvas>
            </div>
        </div>
    )
}