import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function MultipleBouncingBall({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
    const g = 500;
    const R = 50;
    const damping = 0.8;

    const points = useRef([])

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
    const updatePixels = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const x = width / 2;
        const y = height / 2;


        // 🎨 gradient stroke for flavor
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");

        ctx.strokeStyle = "white";
        // ctx.fillStyle = gradient;
        // ctx.fillStyle = "black";

        for (let p of points.current) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(" + p.color.join(",") + ")"
            ctx.fill()
        }

    };



    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        if (!points.current) return

        let [width, height] = [canvasRef.current.width, canvasRef.current.height]
        let frame;
        // let startTime = performance.now()
        const animate = (time) => {
            // let t = (time - startTime) / 1000
            // startTime = time
            updatePixels();



            points.current = points.current.map((p) => {
                let x = p.x;
                let y = p.y;
                let vx = p.vx;
                let vy = p.vy;
                let startTime = p.time;
                let t = (time - startTime) / 1000;
                let timePeriod = p.timePeriod - t
                startTime = time;

                vy += g * t
                x += vx * t
                y += vy * t

                // Bounce off walls
                if (x + R > width) {
                    x = width - R;
                    vx *= -1;
                } else if (x - R < 0) {
                    x = R;
                    vx *= -1;
                }

                // Bounce off floor and ceiling
                if (y + R > height) {
                    y = height - R;
                    vy *= -1; // if damping is added vy *= -damping
                } else if (y - R < 0) {
                    y = R;
                    vy *= -1; // if damping is added vy *= -damping
                }
                return {...p, x, y, vx, vy, time: startTime, timePeriod }
            }).filter((p) => {
                if (p.timePeriod < 0)
                    return false;

                return true;
            })
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [points]);

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

            let leftOrRight = Math.random() >= 0.5 ? 1 : -1
            points.current.push({
                x: event.clientX,
                y: event.clientY,
                vx: leftOrRight * 200,
                vy: 0,
                time: performance.now(),
                timePeriod: 10,
                color: getRandomRgba()
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
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to create balls !</div>
        </div>
    );
}
