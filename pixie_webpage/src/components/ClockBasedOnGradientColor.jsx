import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function ClockBasedOnGradientColor({}) {
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

    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = (points) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        let time = new Date()
        console.log(time.getHours(), time.getMinutes(), time.getSeconds())
        let fullTime = [time.getHours(), time.getMinutes(), time.getSeconds()]
        let angle = (fullTime[2] * 6) * Math.PI / 180;
        const g = ctx.createConicGradient(angle, width / 2, height / 2)
        g.addColorStop(0, "#662400");
        g.addColorStop(0.2, "#B33F00");
        g.addColorStop(0.4, "#FF6B1A");
        g.addColorStop(0.6, "#006663");
        g.addColorStop(1, "#00B3AD");

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height)

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


        // ctx.font = "128px Arial";
        // ctx.fillStyle = gradient;
        // ctx.fillText(fullTime.join(":"), 0, 100)
        // ctx.strokeRect(0, 0, 400, 200)
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
