import "../styles/MakeYourOwnCard.css";
import templates from "../assets/template.png";
import image from "../assets/image.png";
import text_img from "../assets/text.png";
import shapes from "../assets/shapes.png";
import stickers from "../assets/stickers.png";
import bg_color from "../assets/bg_color.png";
import downloadImg from "../assets/download.png";

import { useEffect, useRef, useState } from "react";
import Templates from "./features/Templates";
import Stickers from "./features/Stickers";
import Shapes from "./features/Shapes";
import TextFormat from "./features/TextFormat";
import ChangeBgColor from "./features/ChangeBgColor";
import ImageUpload from "./features/ImageUpload";


const COMP_OPTIONS = {
    templates: Templates,
    stickers: Stickers,
    shapes: Shapes,
    textFormat: TextFormat,
    colorPickerBg: ChangeBgColor,
    imageUpload: ImageUpload
}

export default function MakeYourOwnCard({ }) {
    const [menuVisible, setIsMenuVisible] = useState(false);
    const [optionSelected, setOptionSelected] = useState(null);
    const menuRef = useRef(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [feature, setFeature] = useState({
        "bgColor": "#FFFFFF",
        "bgImg": null,
        "stickers": []
    });
    const [canvassSize, setCanvasSize] = useState(null);
    const [draggingIdx, setDraggingIdx] = useState(null);
    const [selectedIdx, setSelectedIdx] = useState(null);

    useEffect(() => {
        const updatePage = (e) => {
            const divClass = document.getElementsByClassName("Card")[0];
            let width = divClass.clientWidth;
            let height = divClass.clientHeight;
            setCanvasSize({
                width: width,
                height: height
            })
        }
        updatePage();
    }, [])

    useEffect(() => {
        if (!canvasRef.current || !ctxRef.current) return;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const { width, height } = canvas
        const render = async () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = feature.bgColor;
            ctx.fillRect(0, 0, width, height);

            if (feature.bgImg) await drawLayer(ctx, feature.bgImg, 0, 0, canvas.width, canvas.height);

            for (const sticker of feature.stickers) {
                await drawLayer(ctx, sticker.url, sticker.x, sticker.y, sticker.width, sticker.height,sticker.color);
            }
        };

        render();
    }, [feature]);

    const drawLayer = (ctx, src, x, y, w, h, tintColor = null) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => {
                if (!tintColor || tintColor === "transparent") {
                    ctx.drawImage(img, x, y, w, h);
                }
                else {
                    // 1. Create a temporary offscreen canvas
                    const offCanvas = document.createElement("canvas");
                    const offCtx = offCanvas.getContext("2d");
                    offCanvas.width = w;
                    offCanvas.height = h;

                    // 2. Draw the sticker
                    offCtx.drawImage(img, 0, 0, w, h);

                    // 3. The Magic: "source-in" only keeps the new color 
                    // where the original image pixels were
                    offCtx.globalCompositeOperation = "source-in";
                    offCtx.fillStyle = tintColor;
                    offCtx.fillRect(0, 0, w, h);

                    // 4. Draw the tinted version onto the main canvas
                    ctx.drawImage(offCanvas, x, y);
                }
                resolve();
            };
        });
    };

    useEffect(() => {
        if (!canvasRef.current || !canvassSize) return;
        const canvas = canvasRef.current;
        canvas.width = canvassSize.width;
        canvas.height = canvassSize.height;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;
    }, [canvassSize])

    const handleSelect = (opt) => {
        setOptionSelected(opt);
        setIsMenuVisible(true);
    }

    useEffect(() => {
        const deselectMenu = (event) => {
            if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuVisible(false);
                setOptionSelected(null);
            }
        }
        window.addEventListener("pointerdown", deselectMenu);

        return () => {
            window.removeEventListener("pointerdown", deselectMenu);
        }
    }, [menuVisible])

    const moveSticker = (e) => {
        if (draggingIdx === null) return;
        const { offsetX, offsetY } = e.nativeEvent;

        if (feature.stickers[draggingIdx].locked) return;
        setFeature(prev => {
            // 1. Map through stickers to create a NEW array with a NEW object
            const updatedStickers = prev.stickers.map((sticker, i) => {
                if (i === draggingIdx) {
                    return {
                        ...sticker,
                        // Math: (Mouse Position) - (Half of sticker width)
                        x: offsetX - (sticker.width / 2),
                        y: offsetY - (sticker.height / 2)
                    };
                }
                return sticker;
            });

            return { ...prev, stickers: updatedStickers };
        });
    };

    // DELETE LOGIC
    const handleDelete = (index) => {
        setFeature(prev => ({
            ...prev,
            stickers: prev.stickers.filter((_, i) => i !== index)
        }));
        setSelectedIdx(null);
    };

    // FIXED ZOOM LOGIC
    const handleZoom = (index, factor) => {
        setFeature(prev => {
            const newStickers = [...prev.stickers];
            const s = newStickers[index];
            if (s.locked) return prev;
            const newWidth = s.width * factor;
            const newHeight = s.height * factor;

            newStickers[index] = {
                ...s,
                width: newWidth,
                height: newHeight,
                // Centering math: moves X/Y so the sticker expands from the center
                x: s.x - (newWidth - s.width) / 2,
                y: s.y - (newHeight - s.height) / 2
            };
            return { ...prev, stickers: newStickers };
        });
    };

    const handleFix = (index) => {
        setFeature(prev => {
            const newStickers = [...prev.stickers];
            newStickers[index].locked = true; // Toggle lock
            return { ...prev, stickers: newStickers };
        });
        setSelectedIdx(null);
    };

    const handleUnFix = (index) => {
        setFeature(prev => {
            const newStickers = [...prev.stickers];
            newStickers[index].locked = false; // Toggle lock
            return { ...prev, stickers: newStickers };
        });
        setSelectedIdx(null);
    };

    // FIXED POINTER DOWN (Hit Detection)
    const handlePointerDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        let found = false;

        // Standardize to .width and .height
        for (let i = feature.stickers.length - 1; i >= 0; i--) {
            const s = feature.stickers[i];
            if (offsetX >= s.x && offsetX <= s.x + s.width &&
                offsetY >= s.y && offsetY <= s.y + s.height) {

                // Don't drag if locked
                if (!s.locked) {
                    setDraggingIdx(i);
                }
                setSelectedIdx(i);
                found = true;
                break;
            }
        }
        if (!found) setSelectedIdx(null);
    };

    // Handle Download
    const handleDownload = () => {
        const date = new Date();
        const d = [date.getDate(),date.getMonth(),date.getFullYear(),date.getHours() ,date.getMinutes()].join("");
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 1. Convert canvas to a data URL (PNG format)
        const imageURL = canvas.toDataURL("image/png");

        // 2. Create a virtual 'a' tag
        const link = document.createElement("a");
        link.href = imageURL;

        // 3. Set the filename (using the current category name for flair)
        const fileName = `photocard_ ${d}.png`;
        link.download = fileName;

        // 4. Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="MakeYourOwnCard">
            <div className="Menu">
                <img src={templates} alt="card templates" onClick={() => handleSelect("templates")} />
                <img src={stickers} alt="stickers" onClick={() => handleSelect("stickers")} />
                <img src={shapes} alt="shapes" onClick={() => handleSelect("shapes")} />
                <img src={text_img} alt="text" onClick={() => handleSelect("textFormat")} />
                <img src={image} alt="add image" onClick={() => handleSelect("imageUpload")}/>
                <img src={bg_color} alt="add bg color" onClick={() => handleSelect("colorPickerBg")} />
                <img src={downloadImg} alt="download card" onClick={handleDownload}/>
            </div>
            {menuVisible && <div className="SubMenuContainer" ref={menuRef}>
                {optionSelected && (() => {
                    const SelectedComponent = COMP_OPTIONS[optionSelected];
                    return <SelectedComponent
                        selectFeature={setFeature}
                        feature={feature}
                    />;
                })()}
            </div>}
            {selectedIdx !== null && (
                <div
                    className="StickerActions"
                    style={{
                        position: 'absolute',
                        left: `${feature.stickers[selectedIdx].x + canvasRef.current.offsetLeft}px`,
                        top: `${feature.stickers[selectedIdx].y + canvasRef.current.offsetTop - 50}px`,
                    }}
                >
                    <button onClick={() => handleDelete(selectedIdx)}>🗑️</button>
                    <button onClick={() => handleZoom(selectedIdx, 1.1)}>+</button>
                    <button onClick={() => handleZoom(selectedIdx, 0.9)}>-</button>
                    <button onClick={() => handleFix(selectedIdx)}>📌</button>
                    <button onClick={() => handleUnFix(selectedIdx)}>📎</button>
                </div>
            )}
            <canvas
                className="Card"
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={moveSticker}
                onPointerUp={() => setDraggingIdx(null)}
                onPointerLeave={() => setDraggingIdx(null)}
            ></canvas>
        </div>
    )

}