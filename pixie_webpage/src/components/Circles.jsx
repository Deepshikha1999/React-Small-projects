import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function Circles({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
    const circles = useRef([])

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

        let R = 200
        let x = width / 2
        let y = height / 2

        let color = rgba.join(",")
        ctx.beginPath()
        ctx.arc(x, y, R, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(" + color + ")"
        ctx.fill()

        circles.current.push({
            x,
            y,
            R,
            color: rgba.join(",")
        })

    }, [backgroundSize]);


    // Function to update pixels near cursor
    const updatePixels = (pos) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        let selectedCircle = null
        let i = 0
        for (let c of circles.current) {
            let dx = c.x - pos.x
            let dy = c.y - pos.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < c.R) {
                selectedCircle = c
                break;
            }
            i++;
        }

        if (selectedCircle) {
            let r = selectedCircle.R / 2
            let arr =  [{ x: selectedCircle.x - r, y: selectedCircle.y - r, R: r, color: rgba.join(",") },
            { x: selectedCircle.x + r, y: selectedCircle.y - r, "R": r, color: rgba.join(",") },
            { x: selectedCircle.x - r, y: selectedCircle.y + r, R: r, color: rgba.join(",") },
            { x: selectedCircle.x + r, y: selectedCircle.y + r, R: r, color: rgba.join(",") }]
            for(let a of arr){
                circles.current.push(a)
            }
            circles.current.splice(i, 1)
        }

        circles.current = circles.current.map((c) => {
            ctx.beginPath()
            ctx.arc(c.x, c.y, c.R, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(" + c.color + ")"
            ctx.fill()
            return c
        })
    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return
        let frame;
        // let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos);

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
            <div className = "message">Hover on circles to see changes !</div>
        </div>
    );
}
