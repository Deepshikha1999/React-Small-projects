import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet4.css"
import imgSrc from "./../assets/IMG_1928.PNG";

export default function Sheet4({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
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


        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, width, height)

        // ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 1;

        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            ctx.beginPath()
            for (let i = 0; i <= width; i += 20) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
            }
            ctx.stroke()
        }

    }, [backgroundSize])

    const updateCanvas = (time,i) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;

        // if (time - lastTimeRef.current < 100) return;
        // lastTimeRef.current = time;

        if(i>= width) return;

        // ctx.clearRect(0,0,width,height)
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, width, height)
        ctx.clearRect(i,0,20,height) 
    }

    useEffect(() => {
        let frame;
        let i = 0;
        const animate = (time) => {
            updateCanvas(time,i)
            i += 20;
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className="Sheet4" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}