import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function CirclePattern({ }) {
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
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");

        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.fillStyle = gradient;

    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = (t) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        const cx = width / 2;
        const cy = height / 2;
        ctx.clearRect(0, 0, width, height);

        // gradient stroke for flavor
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");

        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.fillStyle = "black";

        let rad = 100
        ctx.fillRect(0, 0, width, height)
        // ctx.beginPath()
        // ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        // ctx.stroke()
        // ctx.closePath()
        for (let i = 0; i < 360; i += 15) {
            ctx.fillStyle = gradient;
            let x = cx + rad * Math.cos(Math.PI * i / 180)
            let y = cy + rad * Math.sin(Math.PI * i / 180)
            // ctx.beginPath()
            // ctx.arc(x, y, rad, 0, Math.PI * 2)
            // ctx.stroke()
            for (let i = 0; i < 360; i += 90) {
                ctx.fillStyle = gradient;
                let x1 = x + rad * Math.cos(Math.PI * i / 180)
                let y1 = y + rad * Math.sin(Math.PI * i / 180)
                ctx.beginPath()
                ctx.arc(x1, y1, rad, 0, Math.PI * 2)
                ctx.stroke()
            }
        }
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        // const { width, height } = canvasRef.current;

        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(t);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

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

        window.addEventListener("mousemove", updateCursorPos)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
