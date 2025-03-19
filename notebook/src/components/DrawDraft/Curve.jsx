import { useMemo } from "react"

export default function Curve({ properties }) {

    const coords = useMemo(() => {
        let arrProp = properties.points.split(" ").map((prop) => (prop.split(",")))
        if (arrProp.length == 3) {
            let d = "M" + arrProp[0].join(" ") + " Q" + arrProp[1].join(" ") + " " + arrProp[arrProp.length - 1].join(" ")
            return d
        }
        else {
            let d = "M" + arrProp[0].join(" ") + " Q" + arrProp[0].join(" ") + " " + arrProp[arrProp.length - 1].join(" ")
            return d
        }
    }, [properties])

    console.log(coords)
    return (
        <>
            {coords && <path d={coords}
                stroke={properties.strokeColor}
                strokeWidth={properties.strokeWidth}
                fill={properties.fill}
            />}
        </>
    )
}