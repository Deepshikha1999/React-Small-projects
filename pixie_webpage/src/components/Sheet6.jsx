import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet.css";
import imgSrc from "./../assets/IMG_1934.PNG";

export default function Sheet6({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
    const imgRef = useRef(null)
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })

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
        if (!backgroundSize) return;
        const canvas = canvasRef.current;
        const ctx = !ctxRef.current ? canvas.getContext("2d") : ctxRef.current;
        ctxRef.current = ctx;
        const { width, height } = backgroundSize;
        canvas.width = width;
        canvas.height = height;


        ctx.fillStyle = "skyblue";
        ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = "rgb(255,255,255,1)";
        ctx.lineWidth = 1;

        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            imgRef.current = img;
            console.log(img.height, img.width)
        };

    }, [backgroundSize])

    const updateCanvas = (time, x, startTime) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;
        const img = imgRef.current;
        if (!img) return;

        const baseY = backgroundSize.height / 2;
        const amplitude = 40;

        const y =
            baseY +
            Math.sin((time - startTime) / 1000) * amplitude -
            img.height / 2;


        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = "skyblue";
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, x, y)

    }

    useEffect(() => {
        let frame;
        const canvas = canvasRef.current;
        if (!canvas) return;
        let x = 0;
        const speed = 200;
        let startTime = null;
        const animate = (time) => {
            if (!startTime) startTime = time;
            const delta = (time - lastTimeRef.current) / 1000 || 0;
            lastTimeRef.current = time;

            x += speed * delta;
            updateCanvas(time, x, startTime)
            if (x >= (canvas.width)){
                x = -200;
                startTime = null;
            }
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}