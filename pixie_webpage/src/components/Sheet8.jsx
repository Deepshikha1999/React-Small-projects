import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet.css";
import imgSrc from "./../assets/IMG_1931.png";

export default function Sheet8({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
    const imgRef = useRef(null)
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [flipFlag, setFlipFlag] = useState(false);

    useEffect(() => {
        const disappear = (e) => {
            setFlipFlag(flag => !flag)
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

            ctx.beginPath()
            for (let i = (width - imageSize.width) / 2; i <= (width + imageSize.width) / 2; i += 50) {
                ctx.moveTo(i, (height - imageSize.height) / 2)
                ctx.lineTo(i, (height + imageSize.height) / 2)
            }

            for (let i = (height - imageSize.height) / 2; i <= (height + imageSize.height) / 2; i += 50) {
                ctx.moveTo((width - imageSize.width) / 2, i)
                ctx.lineTo((width + imageSize.width) / 2, i)
            }
            ctx.stroke()



        };

    }, [backgroundSize])

    const updateCanvas = (x) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;
        const img = imgRef.current;
        if (!img) return;

        const flag = flipFlag;
        let imageSize = {
            width: img.width,
            height: img.height
        }
        const tileSize = 50;
        const startX = (width - imageSize.width) / 2;
        const startY = (height - imageSize.height) / 2;

        ctx.clearRect(0, 0, width, height);

        for (let sx = 0; sx < imageSize.width; sx += tileSize) {
            for (let sy = 0; sy < imageSize.height; sy += tileSize) {
                if (flag) {
                    if (sx <= x)
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
                    else {
                        ctx.fillStyle = "black";
                        ctx.fillRect(startX + sx, startY + sy, tileSize, tileSize)
                    }

                }
                else {
                    if (sx > x)
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
                    else {
                        ctx.fillStyle = "black";
                        ctx.fillRect(startX + sx, startY + sy, tileSize, tileSize)
                    }
                }
            }
        }

        ctx.strokeStyle = flag ? "black" : "white";
        ctx.beginPath()
        for (let i = (width - imageSize.width) / 2; i <= (width + imageSize.width) / 2; i += 50) {
            ctx.moveTo(i, (height - imageSize.height) / 2)
            ctx.lineTo(i, (height + imageSize.height) / 2)
        }

        for (let i = (height - imageSize.height) / 2; i <= (height + imageSize.height) / 2; i += 50) {
            ctx.moveTo((width - imageSize.width) / 2, i)
            ctx.lineTo((width + imageSize.width) / 2, i)
        }
        ctx.stroke()
    }

    useEffect(() => {
        let frame;
        let x = 0;
        const tileSize = 50;
        let animate = () => {
            updateCanvas(x)
            x += tileSize;
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [flipFlag])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to see changes !</div>
        </div>
    )
}