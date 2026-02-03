import { useEffect, useRef, useState } from "react";
import "./../styles/SlidingWindow.css";
import gold from "./../assets/gold.png";

const createArray = (n = 15) => {
    return Array.from({ length: n }, (_, i) => {
        return Math.floor(Math.random() * 10)
        // return 0;
    })
}

export default function SlidingWindow({ }) {
    const [start, setStart] = useState(false);
    const [message, setMessage] = useState(" Press Space or left click to start. Goal is to match the target with the sum of 3 numbers! ");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState({ width: "", height: "" });
    const [series, setSeries] = useState(createArray());
    const fromIndexRef = useRef(0);
    const lastTimeRef = useRef(0);
    const [targetValue, setTargetValue] = useState(0);
    const goldRef = useRef(null)


    useEffect(() => {
        let arr = [];
        for (let i = 0; i <= series.length - 3; i++) {
            const currentWindowSum = series[i] + series[i + 1] + series[i + 2];
            arr.push(currentWindowSum);
        }

        const val = arr[Math.floor(Math.random() * arr.length)];
        setTargetValue(val);

    }, [series])

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("sliding_board");
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

    const drawBar = (ctx, width, height) => {
        const [w, h, gap] = [30, 30, 10];
        const x = series.length * (w + gap);
        const startPointX = (width - x) / 2;
        const startPointY = 10;
        ctx.font = `${w}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < series.length; i++) {
            let x = i * (w + gap) + startPointX;
            ctx.fillStyle = "white";
            ctx.fillRect(x, startPointY, w, h);
            ctx.fillStyle = "black";
            ctx.fillText(series[i].toString(), x + (w / 2), (h / 2) + startPointY);
        }

        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(fromIndexRef.current * (w + gap) + startPointX - (gap / 2), startPointY / 2,
            3 * (w + gap), h + gap)


        const outerScreen = {
            width: width / 2,
            height: height / 2,
            x: width / 4,
            y: height / 4
        }

        const innerScreen = {
            width: 4 * outerScreen.width / 5,
            height: 4 * outerScreen.height / 5,
            x: width / 2 - (4 * outerScreen.width / 10),
            y: height / 2 - (4 * outerScreen.height / 10)
        }

        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Dark shadow
        ctx.shadowBlur = 15;

        let radius = 20;
        ctx.beginPath();
        ctx.fillStyle = "#A0254E";
        ctx.roundRect(outerScreen.x, outerScreen.y, outerScreen.width, outerScreen.height, radius);
        ctx.fill();

        radius = 10;
        ctx.beginPath();
        ctx.fillStyle = "#0D1F27";
        ctx.roundRect(innerScreen.x, innerScreen.y, innerScreen.width, innerScreen.height, radius);
        ctx.fill();

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        const band = {
            width: innerScreen.width / 3,
            height: innerScreen.height,
            gap: 10
        }

        ctx.font = `${band.width - 10}px Arial`;
        for (let i = 0; i < 3; i++) {
            let x = innerScreen.x + i * band.width + (gap / 2);
            let y = innerScreen.y;

            ctx.fillStyle = "#F2F2F2";
            ctx.fillRect(x, y, band.width - gap, band.height)

            ctx.fillStyle = "black";
            ctx.fillText(series[fromIndexRef.current + i], x + band.width / 2, y + band.height / 2)
        }

        radius = 5;
        ctx.beginPath();
        ctx.strokeStyle = "#C09D62";
        ctx.lineWidth = 10;
        ctx.roundRect(innerScreen.x, innerScreen.y, innerScreen.width, innerScreen.height, radius);
        ctx.stroke();


        const targetSize = {
            y: height - 50,
            x: width / 2
        }

        ctx.fillStyle = "white";
        ctx.font = `24px Arial`;
        ctx.fillText(`Target Sum: ${targetValue}`, targetSize.x, targetSize.y);
        ctx.strokeRect(innerScreen.x, targetSize.y - 35, innerScreen.width, 70)

    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;

        const img = new Image();
        img.src = gold;
        img.onload = () => {
            goldRef.current = img;
        }

        drawBar(ctx, width, height)
    }, [pageSize])

    const draw = (time) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        if (!canvas || !ctx) return;

        const delta = time - lastTimeRef.current;
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        drawBar(ctx, width, height)

        if (delta > 50) {
            let fromIndex = fromIndexRef.current;
            fromIndexRef.current = fromIndex == series.length - 3 ? 0 : fromIndex + 1;
            lastTimeRef.current = time;
        }

    }

    useEffect(() => {
        if (!start) return;
        let frame;
        const animate = (time) => {
            draw(time)
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate)
        return () => { cancelAnimationFrame(frame) }
    }, [start, series])

    const handleStart = () => {
        setStart(true);
        setSeries(createArray())
        setMessage(" Press Space or left click to start. Goal is to match the target with the sum of 3 numbers! ")
    }


    const handleStop = () => {
        setStart(false);
        const finalIndex = fromIndexRef.current;
        const sum = series[finalIndex] + series[finalIndex + 1] + series[finalIndex + 2];

        if (sum === targetValue) {
            setMessage(`JACKPOT! Sum ${sum} matches ${targetValue}!`);
            const ctx = ctxRef.current;
            const canvas = canvasRef.current;
            const goldImg = goldRef.current;
            if (!goldImg || !ctx || !canvas) return;
            const { width, height } = canvas;
            ctx.drawImage(goldImg, (width - goldImg.width) / 2, (height - goldImg.height) / 2)

        } else {
            setMessage(`Missed! Window sum was ${sum}. Target was ${targetValue}.`);
        }
    }

    useEffect(() => {
        if (!start) return;

        const timeout = setTimeout(() => {
            handleStop();
        }, 3000);

        return () => clearTimeout(timeout);

    }, [start])

    useEffect(() => {
        const handleKey = (e) => {
            if ((e.key == " " || e.button == 0)) {
                !start && handleStart();
            }
        }

        window.addEventListener("keydown", handleKey)
        window.addEventListener("mousedown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
            window.removeEventListener("mousedown", handleKey)
        }
    })

    return (
        <div className="SlidingWindow">
            <h1 className="Title">Sliding Window, Jackpot!</h1>
            <div className="Message" style={{ fontSize: "20px" }}>{message}</div>
            <div className="Board" id="sliding_board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}