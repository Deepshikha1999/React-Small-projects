import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function Rotation({}) {
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


    // // Function to update pixels near cursor
    const updatePixels = (pos, t) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        let gradient = ctx.createLinearGradient(0, 0, 0, height)

        gradient.addColorStop(0, "#662400")
        gradient.addColorStop(0.2, "#B33F00")
        gradient.addColorStop(0.4, "#FF6B1A")
        gradient.addColorStop(0.6, "#006663")
        gradient.addColorStop(1, "#00B3AD")

        ctx.fillStyle = gradient;
        ctx.strokeStyle = gradient;

        let [x, y] = [width / 2, height / 2]
        let R = 400
        ctx.beginPath();
        // ctx.arc(x, y, R, 0, Math.PI, true)
        // ctx.closePath()

        ctx.arc(x, y, 2, 0, Math.PI * 2)
            for (let i = -180; i <= 0; i += 5) {
                let b = i / 15
                const angle = (i + b * 10 * Math.sin(0.2 * t)) * Math.PI / 180;
                const x2 = x + R * Math.cos(angle);
                const y2 = y + R * Math.sin(angle);
                ctx.moveTo(x, y);
                ctx.lineTo(x2, y2);

                ctx.moveTo(x2, y2);
                ctx.arc(x2, y2, 10, 0, Math.PI * 2)
                ctx.fill()
            }
        ctx.stroke()

    };


    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, t);
            // if (t < 5)
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        // let angle = 1
        const intervalId = setInterval(() => {
            setRgba(
                [Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                    1]
            )
            // updatePixels(angle);
            // angle = (angle + 10)%360
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

        const resetPoints = (event) => {
            points.current = createPixelGrid(canvasRef.current.width, canvasRef.current.height)
        }

        window.addEventListener("mousemove", updateCursorPos)
        // window.addEventListener("mouseup", resetPoints)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
            // window.removeEventListener("mouseup", resetPoints)
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
