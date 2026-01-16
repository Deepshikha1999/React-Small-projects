import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet.css";
import imgSrc from "./../assets/snowflakes/IMG_1938.png";

export default function Sheet12({ }) {
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


        ctx.fillStyle = "skyblue";
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1;

        ctx.fillRect(0, 0, width, height)

        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            imgRef.current = img;
            let imageSize = {
                width: img.width,
                height: img.height
            }


            for (let i = 0; i <= width; i += imageSize.width) {
                for (let j = 0; j <= height; j += imageSize.height) {
                    ctx.drawImage(img,i,j)
                }
            }

            // ctx.beginPath()
            // for (let i = 0; i <= width; i += imageSize.width) {
            //     ctx.moveTo(i, 0)
            //     ctx.lineTo(i, height)
            // }

            // for (let i = 0; i <= height; i += imageSize.height) {
            //     ctx.moveTo(0, i)
            //     ctx.lineTo(width, i)
            // }
            // ctx.stroke()



        };

    }, [backgroundSize])

    // const updateCanvas = (x) => {
    //     const canvas = canvasRef.current;
    //     const ctx = ctxRef.current;
    //     if (!canvas || !ctx) {
    //         return;
    //     }
    //     const { width, height } = canvas;
    //     const img = imgRef.current;
    //     if (!img) return;

    //     const flag = flipFlag;
    //     let imageSize = {
    //         width: img.width,
    //         height: img.height
    //     }
    //     const tileSize = 50;
    //     const startX = (width - imageSize.width) / 2;
    //     const startY = (height - imageSize.height) / 2;

    //     ctx.clearRect(0, 0, width, height);
    //     ctx.fillStyle = "gold";
    // }

    // useEffect(() => {
    //     let frame;
    //     let x = 0;
    //     const tileSize = 50;
    //     let animate = () => {
    //         updateCanvas(x)
    //         x += tileSize;
    //         frame = requestAnimationFrame(animate)
    //     }

    //     frame = requestAnimationFrame(animate)
    //     return () => cancelAnimationFrame(frame)
    // }, [flipFlag])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}