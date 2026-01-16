import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function TanFunction({}) {
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

        // ctx.fillStyle = gradient;
        ctx.strokeStyle = gradient;

        ctx.beginPath();

        const amplitude = 100;
        const wavelength = 0.01;
        const midY = canvas.height / 2;

        for (let x = 0; x < canvas.width; x++) {
            const y = midY + amplitude * Math.tan(x * wavelength * t);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 2;
        ctx.stroke();
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
