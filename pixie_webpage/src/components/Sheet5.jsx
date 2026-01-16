import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet5.css"
import imgSrc from "./../assets/IMG_1931.PNG";

export default function Sheet5({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const imgRef = useRef(null);
    const revealRef = useRef(0);
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
            imgRef.current = img;
            console.log(img.height, img.width)
        };

    }, [backgroundSize])

    useEffect(() => {
        let frame;
        const animate = (time) => {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            const img = imgRef.current;
            if (!canvas || !ctx || !img) {
                frame = requestAnimationFrame(animate);
                return;
            }
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // frame dependent
            // const speed = 20;
            // revealRef.current += speed;

            // frame independent
            const speed = 1000;
            revealRef.current += (speed / 1000) * (time - (lastTimeRef.current || time))
            lastTimeRef.current = time;

            const revealWidth = Math.min(revealRef.current, img.width);
            ctx.drawImage(img,
                0, 0, revealWidth, img.height,
                0, 0, revealWidth, img.height);

            if (revealWidth < img.width) {
                frame = requestAnimationFrame(animate);
            }
        }

        frame = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className="Sheet5" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}