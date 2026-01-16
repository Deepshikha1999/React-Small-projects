import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    0.5
];

export default function Nanogon({}) {
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

    // Function to update pixels near cursor
    const updatePixels = (radius,delta,lastPoint) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        if(delta<0)
        ctx.clearRect(0, 0, width, height)

        let [x, y] = [width / 2, height / 2]
        let allPoints = []

        for (let i = 0; i < 360; i += 40 + delta * 5) {
            let a = x + radius * Math.sin(i * Math.PI / 180)
            let b = y + radius * Math.cos(i * Math.PI / 180)
            allPoints.push([a, b])
        }
        ctx.beginPath()
        ctx.moveTo(...lastPoint)
        for (let p of allPoints) {
            ctx.lineTo(...p)
        }
        ctx.strokeStyle = "white"
        ctx.stroke()
        return allPoints[allPoints.length - 1]
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return;

        let frame;
        let startTime = performance.now()

        // let lastFrame = 0
        // const fps = 65
        // const frameInterval = 1000/fps
        let radius = 10
        let angle = 0
        let lastPoint = [backgroundSize.width/2,backgroundSize.height/2]
        const animate = (time) => {
            // if(time - lastFrame> frameInterval){
            // lastFrame = time;
            let t = (time - startTime) / 1000
            let delta = Math.sin(time * 0.002)
            startTime = t
            lastPoint = updatePixels(radius,delta,lastPoint);
            radius = (radius + 20 * Math.sin(time * 0.002))
            angle = (angle + 1) % 360
            frame = requestAnimationFrame(animate);
            // }
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
                Math.random()]
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
            height: `${backgroundSize.height}px`,
            background: "linear-gradient(#231942,#5e548e,#9f86c0,#be95c4,#e0b1cb)"

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}