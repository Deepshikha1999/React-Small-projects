import { useEffect, useState } from "react";
import "./App.css";
import PixelDrop from "./components/PixelDrop";

function App() {
  const [heightPixels, setHeightPixels] = useState([]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setHeightPixels((oldOne) => {
        if (oldOne.length >= 20) return oldOne; // Stops after 20 instances
        return [...oldOne, <PixelDrop key={oldOne.length} />];
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return <div className="App">{heightPixels}</div>;
}

export default App;
