import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function CloudOnClick({}) {
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

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;
    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = (pos,t) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        // const cx = width / 2;
        // const cy = height / 2;
        ctx.clearRect(0, 0, width, height);

        // gradient stroke for flavor
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1, "white");

        ctx.strokeStyle = "white";
        ctx.fillStyle = gradient;

        const cx = pos.x;
        const cy = pos.y;
        ctx.beginPath()
        ctx.arc(cx, cy, 100, 0, Math.PI * 2)

        let prev = 0
        for (let i = 75; i >= 0; i -= 25) {
            ctx.moveTo(cx - (100 + prev), cy)
            ctx.arc(cx - (100 + prev), cy, i, 0, Math.PI * 2)

            ctx.moveTo(cx + (100 + prev), cy)
            ctx.arc(cx + (100 + prev), cy, i, 0, Math.PI * 2)

            prev += i
        }
        ctx.fill()
    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return

        let frame;
        let startTime = performance.now()
        const { width, height } = canvasRef.current;
        const animate = (time) => {
            let t = (time - startTime) / 1000
            // startTime = time;
            updatePixels(cursorPos,t);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [cursorPos]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRgba(
                [Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                    1]
            )
        }, 1000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const updateCursorPos = (event) => {
            setCursorPos({
                x: event.clientX,
                y: event.clientY
            })
        }
        window.addEventListener("mousedown", updateCursorPos)
        // window.addEventListener("mouseup", resetPoints)
        return () => {
            window.removeEventListener("mousedown", updateCursorPos)
            // window.removeEventListener("mouseup", resetPoints)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor: "darkblue"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to see clouds !</div>
        </div>
    );
}
