import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function ClickSpark({ }) {
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
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#F2B3EE");
        gradient.addColorStop(0.2, "#0C1859");
        gradient.addColorStop(0.4, "#2E40A6");
        gradient.addColorStop(0.6, "#3981BF");
        gradient.addColorStop(1, "#79C4F2");

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.fillStyle = gradient;

    }, [backgroundSize]);



    // // Function to update pixels near cursor4
    const updatePixels = (cursorPos, radius) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#F2B3EE");
        gradient.addColorStop(0.2, "#0C1859");
        gradient.addColorStop(0.4, "#2E40A6");
        gradient.addColorStop(0.6, "#3981BF");
        gradient.addColorStop(1, "#79C4F2");

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        // ctx.fillStyle = gradient;
        ctx.fillStyle = "white";


        if (radius < 20)
            for (let i = 0; i < 360; i += 30) {
                ctx.beginPath()
                ctx.arc(cursorPos.x + radius * Math.cos(i * Math.PI / 180), cursorPos.y + radius * Math.sin(i * Math.PI / 180), 1, 0, Math.PI * 2)
                ctx.fill()
            }
    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return
        const { width, height } = canvasRef.current;
        let frame;
        let startTime = performance.now()
        let radius = 10;
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, radius);
            radius = Math.min(radius + 5 * t, 20)
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
        return () => {
            window.removeEventListener("mousedown", updateCursorPos)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
