import { forwardRef } from "react"

 const Block = forwardRef(({style},ref)=>{
    return (
        <div ref = {ref}className="Block" style={{...style}}></div>
    )
})

export default Block