import { useEffect } from "react";
import CARDS from "../../misc/photocards";

const KEYS = Object.keys(CARDS);
export default function Templates({ selectFeature }) {

    const handleSelect = (url) => {
        selectFeature(prev => { return { ...prev, bgImg: url } })
    }

    return (
        <div className="Templates">
            {Object.keys(CARDS).map((key, index) => {
                return <img
                    src={CARDS[key].url}
                    className="template"
                    key={index}
                    onClick={() => handleSelect(CARDS[key].url)}></img>
            })}
        </div>
    )
}