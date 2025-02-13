import { useState, useEffect } from "react";

export default function PixelDrop() {
  const numPixels = Math.floor(window.innerWidth / 3);
  const [marginTop, setMarginTop] = useState(Array(numPixels).fill(0));
  const [widthPixel, setWidthPixel] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarginTop((prevVal) =>
        prevVal.map((item) => item + Math.floor(Math.random() * 100)) // Moves pixels smoothly
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setWidthPixel(
      marginTop.map((margin, i) => (
        <div
          key={i}
          className="pixel"
          style={{
            transform: `translateY(${margin}px)`,
            transition: "transform 1s ease-in-out",
          }}
        />
      ))
    );
  }, [marginTop]);

  return <div className="pixeldrop">{widthPixel}</div>;
}
