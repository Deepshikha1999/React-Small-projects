import { useState } from "react";

export default function Menu() {
    const [expressions, setExpressions] = useState(
        Array.from({ length: 9 }, (_, i) => i + 1) 
    );

    return (
        <div className="Menu">
            {expressions.map((expression) => (
                <div className="Expressions" id={expression} key={expression}>
                    {expression}
                </div>
            ))}
        </div>
    );
}
