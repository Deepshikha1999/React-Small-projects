import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function SelfThrustBouncingBall({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
    const g = 500;
    const R = 100;
    const damping = 0.8;
    const restitution = 0.9;
    const thrust = 800;

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

    }, [backgroundSize]);


    // // Function to update pixels near cursor
    const updatePixels = (points) => {
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

        ctx.strokeStyle = "white";
        // ctx.fillStyle = gradient;
        // ctx.fillStyle = "black";

        for (let p of points) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(" + p.color.join(",") + ")"
            ctx.fill()
        }

    };

    //collision
    const resolveCollision = (a, b) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = 2 * R;

        if (dist < minDist) {
            // Normalize collision vector
            const nx = dx / dist;
            const ny = dy / dist;

            // Push balls apart (to prevent sticking)
            const overlap = (minDist - dist) / 2;
            a.x -= overlap * nx;
            a.y -= overlap * ny;
            b.x += overlap * nx;
            b.y += overlap * ny;

            // Relative velocity
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const relVel = dvx * nx + dvy * ny;

            // If moving apart, skip
            if (relVel > 0) return;

            // Equal mass elastic collision
            const impulse = -(1 + restitution) * relVel / 2;
            a.vx += impulse * nx;
            a.vy += impulse * ny;
            b.vx -= impulse * nx;
            b.vy -= impulse * ny;
        }
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return

        let [width, height] = [canvasRef.current.width, canvasRef.current.height]
        let points = [
            {
                x: R + 100,
                y: R,
                vx: 200,
                vy: 50,
                time: performance.now(),
                color: getRandomRgba()
            },
            {
                x: width - R - 100,
                y: R,
                vx: -200,
                vy: -50,
                time: performance.now(),
                color: getRandomRgba()
            }
        ]
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            startTime = time
            // update physics
            for (let b of points) {
                b.vy += g * t;  // gravity
                b.x += b.vx * t;
                b.y += b.vy * t;

                // wall collisions
                if (b.x + R > width) {
                    b.x = width - R;
                    b.vx *= -restitution;
                } else if (b.x - R < 0) {
                    b.x = R;
                    b.vx *= -restitution;
                }

                // floor & ceiling
                if (b.y + R > height) {
                    b.y = height - R;
                    // b.vy *= -damping;
                    // b.vy *= -1;
                    b.vy -= thrust;
                } else if (b.y - R < 0) {
                    b.y = R;
                    // b.vy *= -damping;
                    b.vy *= -1;
                }
            }
            // Check collision between the two balls
            resolveCollision(points[0], points[1]);
            updatePixels(points);
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
            height: `${backgroundSize.height}px`,
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
