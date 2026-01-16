import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";
import image1 from "./../assets/IMG_1930.png"

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function ClippingImageIntoRect({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const imageDataRef = useRef(null);
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

        const img = new Image();
        img.src = image1
        img.onload = () => {

            let x = width / 10;
            let y = height / 10;

            ctx.beginPath()
            ctx.rect(x, y, 2 * width / 10, height - 2 * height / 10)
            ctx.rect(x + 3 * width / 10, y, 2 * width / 10, height - 2 * height / 10)
            ctx.rect(x + 6 * width / 10, y, 2 * width / 10, height - 2 * height / 10)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(img, 0, 0, width, height);
            ctx.restore()

            // for checking grid
            for (let i = 0; i < width; i += width / 10) {
                ctx.beginPath()
                ctx.moveTo(i, 0)
                ctx.lineTo(i, height - 1)
                ctx.strokeStyle = "white"
                ctx.stroke()
            }

            for (let j = 0; j < height; j += height / 10) {
                ctx.beginPath()
                ctx.moveTo(0, j)
                ctx.lineTo(width - 1, j)
                ctx.strokeStyle = "white"
                ctx.stroke()
            }
        }
        imageDataRef.current = img;



    }, [backgroundSize]);


    // Function to update pixels near cursor
    const updatePixels = () => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        // ctx.clearRect(0, 0, width, height)
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
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
