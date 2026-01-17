import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function PixelTrail({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
    const [prevPos, setPrevPos] = useState([]);

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
    const updatePixels = () => {
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
        // ctx.fillStyle = gradient;
        ctx.fillStyle = "white";

        const n = prevPos.length;
        const mid = (n - 1) / 2;
        const sigma = n / 4; // controls spread of Gaussian

        for (let i = 0; i < prevPos.length; i++) {
            let pp = prevPos[i]
            let xp = pp.x - (pp.x % 32)
            let yp = pp.y - (pp.y % 32)
            ctx.fillRect(xp, yp, 32, 32)

            // Gaussian weight for opacity
            const weight = Math.exp(-0.5 * Math.pow((i - mid) / sigma, 2));
            const layers = Math.floor(weight * 3);
            for (let j = 0; j <= layers; j++) {
                ctx.fillRect(xp, yp - j * 32, 32, 32);
                ctx.fillRect(xp, yp + j * 32, 32, 32);
            }
        }
    };

    // Animation loop
    useEffect(() => {
        if (!prevPos || prevPos.length == 0) return

        const { width, height } = canvasRef.current;
        let frame;
        let startTime = performance.now()
        // const { width, height } = canvasRef.current;
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels();
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [prevPos]);

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
        let timeout = null;
        const updateCursorPos = (event) => {

            clearTimeout(timeout);
            setCursorPos((prev) => {
                // Store previous position inside the same update to avoid race condition
                setPrevPos(pos => {
                    let newPos = [...pos]
                    if (prev)
                        newPos.push(prev)

                    if (newPos.length > 30) newPos.shift();
                    return newPos
                });
                return { x: event.clientX, y: event.clientY };
            });

            timeout = setTimeout(() => {
                setPrevPos([])
            }, 200)
        }

        window.addEventListener("mousemove", updateCursorPos)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
            clearTimeout(timeout)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor: "#0D0126"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Move to see the trail !</div>
        </div>
    );
}
