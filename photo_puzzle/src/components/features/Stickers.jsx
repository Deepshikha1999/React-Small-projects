import { useEffect, useRef, useState } from "react";

const images = import.meta.glob("/src/assets/elements/*.png", {
    eager: true,
});

const imagesCat = import.meta.glob("/src/assets/photocards/*.png", {
    eager: true,
});
const imageList = Object.values(images).map(module => module.default).concat(Object.values(imagesCat).map(module => module.default));

export default function Stickers({ selectFeature, feature }) {

    return (
        <div className="Templates">
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
                            locked: false
                        }]
                    }));
                }}></img>
            })}
        </div>
    )
}