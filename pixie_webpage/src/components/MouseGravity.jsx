import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function MouseGravity({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
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

        let r = 2
        for (let i = 0; i < 100; i++) {
            let x = Math.floor(Math.random() * (width - 10) + 10)
            let y = Math.floor(Math.random() * (height - 10) + 10)
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fillStyle = "white"
            ctx.fill()
            points.current.push({
                x,
                y
            })
        }

    }, [backgroundSize]);


    // Function to update pixels near cursor
    const updatePixels = (pos, t) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()

        let delta = 10 * Math.sin(t)
        points.current = points.current.map(p => {
            const dx = pos.x - p.x
            const dy = pos.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const dx1 = dx / dist
            const dy1 = dy / dist

            let y2 = p.y + delta * dy1
            let x2 = p.x + delta * dx1
            //    ctx.beginPath()
            //    ctx.moveTo(pos.x,pos.y)
            //    ctx.lineTo(p.x,p.y)
            //    ctx.strokeStyle = "white"
            //    ctx.stroke() 
            ctx.beginPath()
            ctx.arc(x2, y2, 2, 0, Math.PI * 2)
            ctx.fillStyle = "white"
            ctx.fill()
            return {
                x: x2,
                y: y2
            }
        }).filter((p)=>{
            if(p.x == pos.x && p.y == pos.y) return false
            return true
        })
    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, t);

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
            height: `${backgroundSize.height}px`,
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to see changes !</div>
        </div>
    );
}
