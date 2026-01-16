import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";
import image1 from "./../assets/IMG_1931.PNG";

export default function ClipImage() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imgRef = useRef(null);

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Resize handling
  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Init canvas & image
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    canvas.width = size.width;
    canvas.height = size.height;

    const img = new Image();
    img.src = image1;
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
  }, [size]);

  // Draw once
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = imgRef.current;
    if (!canvas || !ctx || !img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();

    const tile = 10;
    const size = 5;

    for (let x = 0; x < canvas.width; x += tile) {
      for (let y = 0; y < canvas.height; y += tile) {
        ctx.rect(x, y, size, size);
      }
    }

    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  return (
    <div
      className="Sheet"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
