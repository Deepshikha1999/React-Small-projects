import { useState } from "react";
import ColorMix from "./ColorMix";

const images = import.meta.glob("/src/assets/shapes/*.png", {
    eager: true,
});
const imageList = Object.values(images).map(module => module.default);

export default function Shapes({ selectFeature, feature }) {
    const [selectedColor, setSelectedColor] = useState("#000000");

    return (
        <div className="Templates">
            <ColorMix color = {selectedColor} handleColor = {setSelectedColor}/>
            {imageList.map((img, index) => {
                return <img src={img} className="sticker" key={index} onClick={() => {
                    selectFeature(prev => ({
                        ...prev,
                        stickers: [...prev.stickers, {
                            url: img,
                            x: 150, // Default X position
                            y: 200, // Default Y position
                            width: 100,
                            height: 100,
                            locked: false,
                            color: selectedColor
                        }]
                    }));
                }}></img>
            })}
        </div>
    )
}