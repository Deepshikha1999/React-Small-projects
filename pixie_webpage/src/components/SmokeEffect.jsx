import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

export default function SmokeEffect({ }) {
    const canvasRef = useRef(null);
    const particles = useRef([]);

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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { width, height } = backgroundSize;
        canvas.width = width;
        canvas.height = height;

        const spawnSmoke = () => {
            // Spawn a few particles every frame
            for (let i = 0; i < 3; i++) {
                particles.current.push({
                    x: width / 2 + (Math.random() - 0.5) * 40,  // jitter horizontally
                    y: height / 1.2,                            // starting near bottom
                    vx: (Math.random() - 0.5) * 30,             // horizontal drift
                    vy: -50 - Math.random() * 50,               // upward velocity
                    size: 20 + Math.random() * 30,              // initial size
                    life: 2 + Math.random(),                    // seconds to live
                    maxLife: 2 + Math.random(),
                    color: `rgba(200,200,200,1)`                // light gray smoke
                });
            }
        };

        const updateSmoke = (dt) => {
            particles.current = particles.current
                .map((p) => ({
                    ...p,
                    x: p.x + p.vx * dt,
                    y: p.y + p.vy * dt,
                    size: p.size + 10 * dt,             // expand over time
                    life: p.life - dt                   // decrease life
                }))
                .filter((p) => p.life > 0);            // remove dead particles
        };

        const drawSmoke = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter"; // makes smoke blend softly

            for (let p of particles.current) {
                const alpha = Math.max(p.life / p.maxLife, 0);
                ctx.beginPath();
                ctx.fillStyle = `rgba(180,180,180,${alpha})`;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = "source-over";
        };

        let lastTime = performance.now();
        const animate = (time) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            spawnSmoke();
            updateSmoke(dt);
            drawSmoke();

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [backgroundSize]);

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor:"black"

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
