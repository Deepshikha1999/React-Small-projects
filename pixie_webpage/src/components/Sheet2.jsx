import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet2.css"

export default function Sheet2({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })

    useEffect(() => {
        const backgroundChange = (e) => {
            console.log("here")
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


        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = "rgb(255,255,255,1)";
        ctx.lineWidth = 1;

        ctx.font = "15px Arial";
        ctx.fillStyle = "green";
        for (let i = 0; i <= width; i += 20) {
            for (let j = 0; j <= height; j += 20) {
                ctx.fillText(String.fromCharCode(Math.random() * (125 - 48) + 48),
                    i, j + 20)
            }
        }

    }, [backgroundSize])

    const updateCanvas = (time) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;

        if (time - lastTimeRef.current < 50) return;
        lastTimeRef.current = time;

        ctx.clearRect(0,0,width,height)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height)

        ctx.font = "15px Arial";
        ctx.fillStyle = "green";
        for (let i = 0; i <= width; i += 20) {
            for (let j = 0; j <= height; j += 20) {
                ctx.fillText(String.fromCharCode(Math.random() * (125 - 48) + 48),
                    i, j + 20)
            }
        }
    }

    useEffect(() => {
        let frame;
        const animate = (time) => {
            updateCanvas(time)
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className="Sheet2" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}