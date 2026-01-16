import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function ScarySmiley({}) {
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


    // // Function to update pixels near cursor
    const updatePixels = (t) => {
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

        

        let changeFn = Math.sin(t);

        let R = 50;
        let R1 = R + changeFn * 10;

        let r = 5

        ctx.beginPath();
        ctx.ellipse(x,
            Math.min(y + changeFn * 4 * R, height - R),
            R,
            R1,
            0,
            0,
            Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "black"
        ctx.shadowBlur = 20
        ctx.fillStyle = "white";

        ctx.beginPath()
        ctx.ellipse(x - R / 2,
            y - r + changeFn * 4 * R,
            r,
            2 * r + changeFn * 10,
            0,
            0,
            Math.PI * 2);
        ctx.fill();

        ctx.beginPath()
        ctx.ellipse(x + R / 2,
            y - r + changeFn * 4 * R ,
            r,
            2 * r + changeFn * 10,
            0,
            0,
            Math.PI * 2);
        ctx.fill();

        ctx.beginPath()
        ctx.ellipse(x,
            y + 4*r + changeFn * 4 * R,
            2 * r,
            3 * r + changeFn * 10,
            0,
            0,
            Math.PI * 2);
        ctx.fill();

    };



    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(t);
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
