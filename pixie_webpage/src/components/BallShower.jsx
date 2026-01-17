import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function BallShower({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba())

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

        let [x0, y0] = [cursorPos.x, cursorPos.y];
        let v0 = 200;
        let g = 400;
        let angle = 0;
        for (let i = 0; i < 180; i += 15) {

            let t_ = t - angleDelay[i / 15]
            if (t_ < 0) continue;
            angle = i;
            let vx = leftOrRight * v0 * Math.cos(angle * Math.PI / 180)
            let vy0 = -v0 * Math.sin(angle * Math.PI / 180)
            let x = x0 + (vx * t_)
            let y = y0 + (vy0 * t_) + (0.5 * g * t_ * t_)

            // stop drawing once out of view
            if (y > height || x < 0 || x > width) continue;

            ctx.beginPath()
            ctx.arc(x, y, 10, 0, Math.PI * 2)
            ctx.shadowColor = "white"
            ctx.shadowBlur = 10
            ctx.fillStyle = "rgba("+rgba.join(",")+")"
            ctx.fill()
        }


    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return;
        let frame;
        let startTime = performance.now()
        let leftOrRight = Math.random() >= 0.5 ? 1 : -1;
        let angleDelay = []
        for (let i = 0; i < 180; i += 15) {
            angleDelay.push(Math.sin(i * 0.025))
        }
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, t, leftOrRight, angleDelay);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [cursorPos]);


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

        window.addEventListener("mousedown", updateCursorPos)
        return () => {
            window.removeEventListener("mousedown", updateCursorPos)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to see changes !</div>
        </div>
    );
}
