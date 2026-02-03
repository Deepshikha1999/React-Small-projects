import "./../styles/IterativeSubdivision.css";
import { useEffect, useRef, useState } from "react";

export default function IterativeSubdivision({ }) {
    const [message, setMessage] = useState("Click in between circle to find the golden ball");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
    const circlesRef = useRef([]);
    const [stop, setStop] = useState(false);

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("iterative_board");
            setPageSize({
                width: divClass.clientWidth,
                height: divClass.clientHeight
            })
        }

        updatePageSize()
        window.addEventListener("resize", updatePageSize);
        return () => {
            window.removeEventListener("resize", updatePageSize);
        }
    }, [])

    const initiate = (ctx, width, height) => {
        const circle = {
            x: width / 2,
            y: height / 2,
            radius: Math.min(height / 2, width / 2),
            color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1],
            isTreasure: false
        }

        circlesRef.current.push(circle);

        ctx.fillStyle = `rgba(${circle.color})`;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;
        initiate(ctx, width, height);

    }, [pageSize])

    const draw = (X, Y) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        if (!canvas || !ctx) return;
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        let tempCircles = [...circlesRef.current];
        let newCircles = [];
        let deleteIndices = [];

        const pos = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        tempCircles.forEach((value, index) => {
            let { x, y, radius, color } = value;
            let dx = X - x;
            let dy = Y - y;
            if (dx * dx + dy * dy <= radius * radius) {
                if (value.isTreasure) {
                    setMessage("Golden ball found");
                    setStop(true);
                    return;
                }
                deleteIndices.push(index);
                let r = radius / 2;
                let c = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1];
                for (let p of pos) {
                    let j = {
                        x: x + p[0] * r,
                        y: y + p[1] * r,
                        radius: r,
                        color: c,
                        isTreasure: Math.random() >= 0.9 ? true : false
                    }
                    newCircles.push(j);
                }
            }
        })

        for (let d of deleteIndices) {
            tempCircles.splice(d, 1);
        }

        circlesRef.current = tempCircles.concat(newCircles);
        circlesRef.current.forEach((value, index) => {
            createCircle(ctx, value);
        })

    }

    const createCircle = (ctx, circle) => {
        ctx.fillStyle = `rgba(${circle.color})`;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    useEffect(() => {
        const handleMouseOver = (e) => {
            if (stop) {
                const ctx = ctxRef.current;
                const canavs = canvasRef.current;
                if (!ctx || !canavs) return;
                const { width, height } = canavs;
                circlesRef.current = [];
                initiate(ctx, width, height);
                setMessage("Click in between circle to find the golden ball");
                setStop(false);
            };
            let x = e.offsetX;
            let y = e.offsetY;
            console.log(x, y);
            draw(x, y);
        }
        window.addEventListener("mousedown", handleMouseOver);
        return () => {
            window.removeEventListener("mousedown", handleMouseOver);
        }
    })

    return (
        <div className="IterativeSubdivision">
            <h1 className="Title">Iterative Subdivision, Find the golden ball! ...</h1>
            <div className="Message">{message}</div>
            <div className="Board" id="iterative_board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}