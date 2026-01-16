import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet.css";
import imgSrc from "./../assets/IMG_1931.png";

export default function Sheet10({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
    const imgRef = useRef(null)
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [scatterFlag, setScatterFlag] = useState(false);

    useEffect(() => {
        const disappear = (e) => {
            setScatterFlag(flag => !flag)
        }
        const backgroundChange = (e) => {
            setBackgroundSize({
                height: window.innerHeight,
                width: window.innerWidth,
            })
        }
        window.addEventListener("resize", backgroundChange)
        window.addEventListener("mousedown", disappear)
        return () => {
            window.removeEventListener("resize", backgroundChange)
            window.removeEventListener("mousedown", disappear)
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
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 1;

        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            imgRef.current = img;
            let imageSize = {
                width: img.width,
                height: img.height
            }

            const tileSize = 50;
            const startX = (width - imageSize.width) / 2;
            const startY = (height - imageSize.height) / 2;

            // Draw tiles
            for (let sx = 0; sx < imageSize.width; sx += tileSize) {
                for (let sy = 0; sy < imageSize.height; sy += tileSize) {

                    ctx.drawImage(
                        img,
                        sx,
                        sy,
                        tileSize,
                        tileSize,
                        startX + sx,
                        startY + sy,
                        tileSize,
                        tileSize
                    );
                }
            }
        };

    }, [backgroundSize])

    const updateCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;
        const img = imgRef.current;
        if (!img) return;

        const flag = scatterFlag;
        let imageSize = {
            width: img.width,
            height: img.height
        }
        const tileSize = 50;
        const startX = !flag ? (width / 2 - imageSize.width) : (width - imageSize.width) / 2;
        const startY = !flag ? (height / 2 - imageSize.height) : (height - imageSize.height) / 2;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "black";

        for (let sx = 0; sx < imageSize.width; sx += tileSize) {

            let gap_x = !flag? 2 * sx : sx;
            for (let sy = 0; sy < imageSize.height; sy += tileSize) {
                let gap_y = !flag? 2 * sy : sy;
                ctx.drawImage(
                    img,
                    sx,
                    sy,
                    tileSize,
                    tileSize,
                    startX + gap_x,
                    startY + gap_y,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    useEffect(() => {
        let frame;
        let animate = () => {
            updateCanvas()
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [scatterFlag])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}