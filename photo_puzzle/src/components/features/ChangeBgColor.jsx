import { useEffect, useState } from "react";

export default function ChangeBgColor({ selectFeature, feature }) {
    const [selectedColor, setSelectedColor] = useState(feature.bgColor);

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setSelectedColor(newColor);
        selectFeature(prev => { return { ...prev, bgColor: newColor } })
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
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="NativeColorInput"
                />
                {/* This div visually represents the selected color */}
                <div
                    className="ColorDisplay"
                    style={{ backgroundColor: selectedColor }}
                ></div>
            </div>
            <span className="HexCode">{selectedColor.toUpperCase()}</span>
        </div>
    )
}