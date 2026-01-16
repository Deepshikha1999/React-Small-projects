import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function SineFunction({}) {
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

    const createPixelGrid = (width, height) => {
        let n = 20
        let pixels = []

        for (let j = 0; j < height + (n / 2); j += n / 2) {
            for (let i = n; i < width + n; i += n) {
                let x = Math.floor(Math.random() * n) + i - n
                let upOrDown = (i / n) % 2 == 0 ? 1 : -1
                let y = Math.floor(Math.random() * (n / 2)) + (j - (upOrDown * n / 2))
                let [x_, y_] = [i - n / 2, j + upOrDown * n / 2]
                pixels.push([[i, j], [x_, y_], [i - n, j]])
            }
        }
        return pixels
    }

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;

        // points.current = createPixelGrid(width, height)
        // ctx.strokeStyle = "white"
        // ctx.fillStyle = "white"

        // ctx.beginPath()
        // for (let p of points.current) {
        //     ctx.moveTo(...p[0])
        //     ctx.quadraticCurveTo(...p[1], ...p[2])
        // }
        // ctx.stroke()

    }, [backgroundSize]);


    // // Function to update pixels near cursor
    const updatePixels = (pos, t) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        let gradient = ctx.createLinearGradient(0, 0, 0, height)

        gradient.addColorStop(0, "#662400")
        gradient.addColorStop(0.2, "#B33F00")
        gradient.addColorStop(0.4, "#FF6B1A")
        gradient.addColorStop(0.6, "#006663")
        gradient.addColorStop(1, "#00B3AD")

        // ctx.fillStyle = gradient;
        // ctx.strokeStyle = gradient;
        // ctx.beginPath()
        // for (let p of points.current) {
        //     ctx.moveTo(...p[0])
        //     ctx.quadraticCurveTo(...p[1], ...p[2])
        // }
        // ctx.stroke()

        ctx.beginPath()
        // y=Asin(kx+ωt+ϕ)
        // let A = 25; //amplitude or height of wave
        let bias = 100;
        let wavelength = 0.0005; // smaller more wave (1/frequency)
        let speed = 2;
        let midY = height / 2;
        for (let A = 0; A < 1000; A+=10) {
            for (let x = 0; x < width; x++) {
                const y = A * Math.sin(x * wavelength + t * speed)
                ctx.lineTo(x, y)
            }
        }
        ctx.strokeStyle = gradient;
        ctx.stroke()

    };


    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, t);
            // if (t < 5)
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

        const resetPoints = (event) => {
            points.current = createPixelGrid(canvasRef.current.width, canvasRef.current.height)
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
            height: `${backgroundSize.height}px`,
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
