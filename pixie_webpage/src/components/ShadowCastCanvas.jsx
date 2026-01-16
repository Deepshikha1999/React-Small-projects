import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

export default function ShadowCastCanvas({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState([Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
        0.5])

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

    // Function to update pixels near cursor
    const updatePixels = (pos) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        let coord = [
            [width / 2 - 100, height / 2 + 100],
            [width / 2 + 100, height / 2 + 100],
            [width / 2 + 100, height / 2 - 100],
            [width / 2 - 100, height / 2 - 100]
        ]

        // for (let c of coord) {
        //     ctx.beginPath()
        //     ctx.moveTo(pos.x, pos.y)
        //     ctx.lineTo(...c)
        //     ctx.strokeStyle = "black"
        //     ctx.stroke()
        // }

        let maxArea = 0;
        for (let i = 0; i < coord.length; i++) {
            const c1 = coord[i];
            const c2 = coord[(i + 1) % coord.length]; // wraps to first corner

            const areaOfTriangle = 0.5 * (c1[0] * (c2[1] - pos.y) + c2[0] * (pos.y - c1[1]) + pos.x * (c1[1] - c2[1]))
            if (areaOfTriangle < maxArea) continue;
            let colorShadow = ctx.createLinearGradient(...c1, ...c2)
            colorShadow.addColorStop(0, "rgba(0,0,0,0.7)")
            colorShadow.addColorStop(1, "rgba(0,0,0,0.2)")
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);  // cursor as apex
            ctx.lineTo(c1[0], c1[1]);  // first corner
            ctx.lineTo(c2[0], c2[1]);  // next corner
            ctx.closePath();

            // random color per triangle for visualization
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 10;
            ctx.fillStyle = colorShadow;
            ctx.fill();

            maxArea = areaOfTriangle;

        }

        ctx.fillStyle = "crimson"
        ctx.fillRect(width / 2 - 100, height / 2 - 100, 200, 200)

    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return;
        let frame;
        const animate = (time) => {

            updatePixels(cursorPos);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [cursorPos]);


    useEffect(() => {
        // let angle = 1
        const intervalId = setInterval(() => {
            setRgba([Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.random()])
            // updatePixels(angle);
            // angle = (angle + 10)%360
        }, 100)
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
