import { useEffect, useRef, useState } from "react";
import fonts from "../../misc/fontMap"
import ColorMix from "./ColorMix";
import "../../styles/TextFormatter.css";

export default function TextFormat({ selectFeature, feature }) {
    const [font, setFont] = useState("Arial");
    const [fontWeight, setFontWeight] = useState(400);
    const [fontSize, setFontSize] = useState(20);
    const [fillColor, setFillColor] = useState("#000000");
    const [strokeColor, setStrokeColor] = useState("transparent");
    const [text, setText] = useState("Example");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [imgaeUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 200;

        ctxRef.current = ctx;

        ctx.fillStyle = fillColor;
        ctx.strokeColor = strokeColor;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = `${fontWeight} ${fontSize}px ${font}`;

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        if (strokeColor !== "transparent") {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
        }

    }, [fillColor,strokeColor,fontWeight,fontSize,font,text])

    const addTextSticker = () => {
        const url = canvasRef.current.toDataURL(); // Convert text to an image
        selectFeature(prev => ({
            ...prev,
            stickers: [
                ...prev.stickers,
                { url, x: 50, y: 50, width: canvasRef.current.width, height: canvasRef.current.height }
            ]
        }));
    };

    return (
        <div className="TextFormatter">
            <div className="TextFormatter">
             <div className="PreviewBox">
                <canvas ref={canvasRef} width={300} height={150}></canvas>
            </div>

            <div className="InputGroup">
                <label>Input Text</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            </div>

            <div className="ControlGrid">
                <div className="ControlItem">
                    <label>Font Family</label>
                    <select onChange={(e) => setFont(e.target.value)}>
                        {fonts.map((f, i) => <option key={i} value={f.font}>{f.font}</option>)}
                    </select>
                </div>
                
                <div className="ControlItem">
                    <label>Weight: {fontWeight}</label>
                    <input type="range" min="100" max="900" step="100" value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} />
                </div>

                <div className="ControlItem">
                    <label>Size: {fontSize}px</label>
                    <input type="range" min="10" max="100" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
                </div>
            </div>

            <div className="ColorGrid">
                <div><label>Fill</label><ColorMix handleColor={setFillColor} color={fillColor} /></div>
                <div><label>Stroke</label><ColorMix handleColor={setStrokeColor} color={strokeColor} /></div>
            </div>

            <button className="AddBtn" onClick={addTextSticker}>Add Text Sticker</button>
        </div>
        </div>
    )
}