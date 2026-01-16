import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function Clock({}) {
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
        // const img = new Image();
        // img.src = image1;
        // img.onload = () => {
        //     imageDataRef.current = img;
        // };

    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = (points) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        const cx = width / 2;
        const cy = height / 2;
        ctx.clearRect(0, 0, width, height);
        const now = new Date();
        const ms = now.getMilliseconds();
        const s = now.getSeconds() + ms / 1000;
        const m = now.getMinutes() + s / 60;
        const h = (now.getHours() % 12) + m / 60;

        // Angles in radians
        const secAngle = (s / 60) * 2 * Math.PI;
        const minAngle = (m / 60) * 2 * Math.PI;
        const hourAngle = (h / 12) * 2 * Math.PI;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // === OUTER RING (Seconds) ===
        const secGrad = ctx.createConicGradient(secAngle - Math.PI / 2, cx, cy);
        secGrad.addColorStop(0, "#FF2E00");
        secGrad.addColorStop(0.25, "#FF6B1A");
        secGrad.addColorStop(0.5, "#FFD000");
        secGrad.addColorStop(0.75, "#00B3AD");
        secGrad.addColorStop(1, "#FF2E00");
        ctx.fillStyle = secGrad;
        ctx.fillRect(0, 0, width, height);

        // === MIDDLE RING (Minutes) ===
        const minGrad = ctx.createConicGradient(minAngle - Math.PI / 2, cx, cy);
        minGrad.addColorStop(0, "#FF2E00");
        minGrad.addColorStop(0.25, "#FF6B1A");
        minGrad.addColorStop(0.5, "#FFD000");
        minGrad.addColorStop(0.75, "#00B3AD");
        minGrad.addColorStop(1, "#FF2E00");

        ctx.save();
        ctx.beginPath();
        ctx.rect(100, 100, width - 200, height - 200);
        ctx.fillStyle = minGrad;
        ctx.fill();
        ctx.restore();

        // === INNER CORE (Hours) ===
        const hourGrad = ctx.createConicGradient(hourAngle - Math.PI / 2, cx, cy);
        hourGrad.addColorStop(0, "#004C4C");
        hourGrad.addColorStop(0.4, "#006663");
        hourGrad.addColorStop(0.7, "#00B3AD");
        hourGrad.addColorStop(1, "#004C4C");

        ctx.save();
        ctx.beginPath();
        ctx.rect(200, 200, width - 400, height - 400);
        ctx.fillStyle = hourGrad;
        ctx.fill();
        ctx.restore();

        // === DIGITAL TIME DISPLAY ===
        const hh = String(Math.floor(h)).padStart(2, "0");
        const mm = String(Math.floor(m)).padStart(2, "0");
        const ss = String(Math.floor(s)).padStart(2, "0");
        const ampm = 12 < now.getHours() && now.getHours() < 24 ? "pm" : "am";
        const timeStr = `${hh}:${mm}:${ss} ${ampm}`;

        ctx.font = "bold 80px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(timeStr, cx, cy);


        const x = width / 2;
        const y = height / 2;


        // 🎨 gradient stroke for flavor
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return

        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            startTime = time;
            updatePixels();
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
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
