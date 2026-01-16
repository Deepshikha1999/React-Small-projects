import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

export default function BubbleEffect({ }) {
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
    const updatePixels = (pos, r, sr, bubbles, t) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        let randomColor = rgba.map((col, i) => {
            if (i == 3) return 1;
            return 255 - col
        })
        ctx.fillStyle = "rgba(" + randomColor.join(",") + ")"
        ctx.fillRect(0, 0, width, height)

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
        // ctx.strokeStyle = "white"
        // ctx.stroke()
        ctx.fillStyle = "rgba(" + rgba.join(",") + ")"
        ctx.fill()

        if (t < 1.0) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, sr, 0, Math.PI * 2)
            // ctx.strokeStyle = "white"
            // ctx.stroke();
            ctx.fillStyle = "rgba(" + rgba.map((col, i) => {
                if (i == 3) {
                    return 0.3
                }
                return 255
            }).join(",") + ")"
            ctx.fill()
        }

        if (t > 0.1) {
            for (let i = 0; i < bubbles.length; i++) {
                ctx.beginPath();
                ctx.arc(...bubbles[i], 0, Math.PI * 2)
                // ctx.strokeStyle = "white"
                // ctx.stroke();
                ctx.fillStyle = "rgba(" + rgba.join(",") + ")"
                // ctx.fillStyle = "black"
                ctx.fill()
            }
        }

    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return;
        let frame;
        let r = 10;
        let startTime = performance.now()
        let sr = 1;
        let bubbles = []
        for (let i = 0; i < 20; i++) {
            let rr = Math.ceil(Math.random() * 25)
            let x = Math.floor(Math.random() * ((cursorPos.x + 100) - (cursorPos.x - 100)) + cursorPos.x - 100) + Math.random() * 10
            let y = Math.floor(Math.random() * ((cursorPos.y + 100) - (cursorPos.y - 100)) + cursorPos.y - 100) + Math.random() * 10
            bubbles.push([x, y, rr])
        }
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, r, sr, bubbles, t);
            r = r + 50 * t;
            sr = Math.min(sr + 20 * t, 200);
            if (t > 0.1) {
                for (let i = 0; i < bubbles.length; i++) {
                    let x_dir = cursorPos.x > bubbles[i][0] ? 1 : -1
                    let y_dir = cursorPos.y > bubbles[i][1] ? 1 : -1
                    bubbles[i][0] = bubbles[i][0] - 20 * t * x_dir
                    bubbles[i][1] = bubbles[i][1] - 20 * t * y_dir
                    bubbles[i][2] = Math.max(bubbles[i][2] - 5 * t, 0)
                }
            }
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
        }, 60)
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
        </div>
    );
}
