import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function Orbit({}) {
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


    // // Function to update pixels near cursor
    const updatePixels = (angle) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const x = width / 2;
        const y = height / 2;


        // 🎨 gradient stroke for flavor
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");

        ctx.strokeStyle = "black";
        // ctx.fillStyle = gradient;
        ctx.fillStyle = "black";

        let [a, b] = [400, 100]
        ctx.beginPath()
        ctx.ellipse(x, y, a, b, 0, 0, Math.PI * 2)
        ctx.stroke()

        let [a1, b1] = [a - 100, b - 25]
        ctx.beginPath()
        ctx.ellipse(x, y, a1, b1, 0, 0, Math.PI * 2)
        ctx.stroke()

        let [a2, b2] = [a - 200, b - 50]
        ctx.beginPath()
        ctx.ellipse(x, y, a2, b2, 0, 0, Math.PI * 2)
        ctx.stroke()


        // trace the points for traversal
        // let bias = t * 10
        // let size = Math.sin(t) * 10
        // for (let i = 0; i <= 360; i += 15) {
        //     let [x1, y1] = [x + a * Math.cos((i + bias) * Math.PI / 180), y + b * Math.sin((i + bias) * Math.PI / 180)]
        //     ctx.beginPath()
        //     ctx.arc(x1, y1, 50 + size, 0, Math.PI * 2)
        //     ctx.fill()
        // }

        let size = (0.5 + 0.5 * Math.sin(Math.PI * angle / 180)) * 20
        let [x1, y1] = [x + a * Math.cos(angle * Math.PI / 180), y + b * Math.sin(angle * Math.PI / 180)]
        ctx.beginPath()
        ctx.arc(x1, y1, 20 + size, 0, Math.PI * 2)
        ctx.fill()

        let size2 = (0.5 + 0.5 * Math.sin(Math.PI * (angle + 15)/ 180)) * 20
        let [x2, y2] = [x + a1 * Math.cos((angle + 15) * Math.PI / 180), 
        y + b1 * Math.sin((angle + 15) * Math.PI / 180)]
        ctx.beginPath()
        ctx.arc(x2, y2, 15 + size2, 0, Math.PI * 2)
        ctx.fill()

        let size3 = (0.5 + 0.5 * Math.sin(Math.PI * (angle + 30) / 180)) * 20
        let [x3, y3] = [x + a2 * Math.cos((angle + 30) * Math.PI / 180), 
        y + b2 * Math.sin((angle + 30) * Math.PI / 180)]
        ctx.beginPath()
        ctx.arc(x3, y3, 10 + size3, 0, Math.PI * 2)
        ctx.fill()


    };



    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        let angle = 0
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(angle, t);
            angle = (angle + 1 + (t * 0.002)) % 360
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
