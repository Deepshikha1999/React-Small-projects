export default function InputFields({fieldTitle,fieldName,defaultValue,setInput}){
    function handleChange(e){
        const  {name,value} = e.target;
        setInput(oldInput=>{
            return {
                ...oldInput,
                [name]: parseFloat(value)
            }
        })
    }
    return <div className="field">
        <label>{fieldTitle}</label>
        <input type="text" name={fieldName} defaultValue = {defaultValue} onChange={handleChange}/>
    </div>
}