export default function Road ({strips}){
    return (
        <div className="Road" style = {{
            height:"100vh",
            width :"40vw",
            zIndex: "0",
            backgroundColor:"rgb(84,90,104)",
            // display: "grid",
            // gridTemplateRows: `repeat(${5}, 1fr)`,
            // placeItems: "center",
            display:"grid",
            justifyContent:"center",
            alignItems:"center",
            gap: "5em",
            borderLeft: "2em dashed yellow",
            borderRight: "2em dashed yellow",
        }}>
            {strips}
        </div>
    )
}


/**
 * 
 * zebra:
 *  <div className="Road" style = {{
            height:"100vh",
            width :"40vw",
            zIndex: "0",
            backgroundColor:"rgb(84,90,104)",
            // display: "grid",
            // gridTemplateRows: `repeat(${5}, 1fr)`,
            // placeItems: "center",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            gap: "5em",
            borderLeft: "2em dashed yellow",
            borderRight: "2em dashed yellow",
        }}>
            {strips}
        </div>
 */