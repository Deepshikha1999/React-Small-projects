import { useState } from "react";

export default function ColorMix({color, handleColor}){
    // const [selectedColor, setSelectedColor] = useState("#000000");

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        handleColor(newColor);
    };

    return (
        <div className="ColorPickerContainer">
            <label htmlFor="cardColor" className="ColorLabel">
                PICK COLOR
            </label>
            <div className="SwatchWrapper">
                <input
                    type="color"
                    id="cardColor"
                    value={color}
                    onChange={handleColorChange}
                    className="NativeColorInput"
                />
                {/* This div visually represents the selected color */}
                <div
                    className="ColorDisplay"
                    style={{ backgroundColor: color }}
                ></div>
            </div>
            <span className="HexCode">{color.toUpperCase()}</span>
        </div>
    )
}