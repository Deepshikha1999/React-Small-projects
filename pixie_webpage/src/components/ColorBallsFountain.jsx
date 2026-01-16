import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function ColorBallsFountain({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
    const projectiles = useRef([]);
    let v0 = 200;
    let g = 400;

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

    // x = x0 + vx * t
    // y = y0 + vy * t + 0.5 * g * t^2
    // Function to update pixels near cursor
    const updatePixels = (cursorPos, t, leftOrRight, angleDelay) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        const now = performance.now();

        projectiles.current = projectiles.current.filter((p) => {
            const t = (now - p.startTime) / 1000;
            const x = p.x0 + p.vx * t;
            const y = p.y0 + p.vy0 * t + 0.5 * g * t * t;

            if (y > height + 50) return false;

            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = p.color;
            ctx.fill();
            return true;
        });

    };

    // Animation loop
    useEffect(() => {

        let frame;
        // let startTime = performance.now()
        const animate = (time) => {
            // let t = (time - startTime) / 1000
            updatePixels();
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!cursorPos) return;
        const interval = setInterval(() => {
            const angle = Math.random() * 90; // 0–90 degrees
            const leftOrRight = Math.random() > 0.5 ? 1 : -1;
            const vx = leftOrRight * v0 * Math.cos(angle * Math.PI / 180);
            const vy0 = -v0 * Math.sin(angle * Math.PI / 180);
            const color = `hsl(${Math.random() * 360}, 80%, 50%)`;

            projectiles.current.push({
                x0: cursorPos.x,
                y0: cursorPos.y,
                vx,
                vy0,
                color,
                startTime: performance.now()
            })
        }, 200)

        return () => clearInterval(interval)
    }, [cursorPos])

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
