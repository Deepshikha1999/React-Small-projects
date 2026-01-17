import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function SniperPointer({}) {
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
    const updatePixels = (cursorPos) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        const cx = width / 2;
        const cy = height / 2;
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#F2B3EE");
        gradient.addColorStop(0.2, "#0C1859");
        gradient.addColorStop(0.4, "#2E40A6");
        gradient.addColorStop(0.6, "#3981BF");
        gradient.addColorStop(1, "#79C4F2");

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.fillStyle = gradient;

        ctx.beginPath()
        ctx.moveTo(0, cursorPos.y)
        ctx.lineTo(width, cursorPos.y)

        ctx.moveTo(cursorPos.x, 0)
        ctx.lineTo(cursorPos.x, height)
        ctx.stroke()

        // ctx.strokeRect(cursorPos.x - 40, cursorPos.y - 40, 100, 100)
        let pts = [
            [cursorPos.x - 40, cursorPos.y - 40],
            [cursorPos.x + 40, cursorPos.y - 40],
            [cursorPos.x + 40, cursorPos.y + 40],
            [cursorPos.x - 40, cursorPos.y + 40]
        ]

        for (let p of pts) {
            console.log(p)
            let pc = [15, 15]
            if (p[0] > cursorPos.x) {
                pc[0] = -15
            }

            if (p[1] > cursorPos.y) {
                pc[1] = -15
            }

            ctx.beginPath()
            ctx.moveTo(p[0], p[1] + pc[1])
            ctx.lineTo(...p)
            ctx.lineTo(p[0] + pc[0], p[1])
            ctx.stroke()
        }

        ctx.fillStyle = "rgba(65, 70, 77, 0.2)";
        ctx.beginPath()
        ctx.arc(cursorPos.x, cursorPos.y, 100, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.beginPath()
        ctx.arc(cursorPos.x, cursorPos.y, 5, 0, Math.PI * 2)
        ctx.fill()
    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return
        const { width, height } = canvasRef.current;
        let frame;
        let startTime = performance.now()
        // const { width, height } = canvasRef.current;

        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos);
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

        window.addEventListener("mousemove", updateCursorPos)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
        }
    }, [])

    return (
       <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor : "black"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Move to point target !</div>
        </div>
    );
}
