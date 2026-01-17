import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function BlurOnHover({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());

    const blobs = useRef([])
    const color = useRef(`hsla(${Math.random() * 360}, 90%, 60%, 0.6)`)

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
        gradient.addColorStop(0, "#F2B3EE");
        gradient.addColorStop(0.2, "#0C1859");
        gradient.addColorStop(0.4, "#2E40A6");
        gradient.addColorStop(0.6, "#3981BF");
        gradient.addColorStop(1, "#79C4F2");

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
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
        ctx.filter = "blur(80px)";
        blobs.current.forEach(b => {

            const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            gradient.addColorStop(0, b.color);
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);

            // Move blob
            b.x += b.dx;
            b.y += b.dy;

            // Bounce off edges
            if (b.x < 0 || b.x > width) b.dx *= -1;
            if (b.y < 0 || b.y > height) b.dy *= -1;
        });

        ctx.filter = "none";

    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return
        const { width, height } = canvasRef.current;
         // Create some moving "light sources"
         blobs.current = Array.from({ length: 1 }, () => ({
            x: cursorPos.x,
            y: cursorPos.y,
            r: 200 + Math.random() * 150, // radius of glow
            dx: (Math.random() - 0.5) * 0.8, // motion speed
            dy: (Math.random() - 0.5) * 0.8,
            color: color.current
        }));
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
    }, [cursorPos]);

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
