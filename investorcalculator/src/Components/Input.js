import InputFields from "./InputFields"
const feildJSON = [
    {
        fieldTitle: "INITIAL INVESTMENT",
        fieldName: "initial"
    },
    {
        fieldTitle: "ANNUAL INVESTMENT",
        fieldName: "annual"
    },
    {
        fieldTitle: "EXPECTED RETURN",
        fieldName: "return"
    },
    {
        fieldTitle: "DURATION",
        fieldName: "duration"
    },
]

export default function Input({setInput,input}) {
    return <div className="InputBox">
        {feildJSON.map((item,index)=><InputFields {...item} defaultValue={input[item.fieldName]} setInput={setInput} key={index}/>)}
    </div>
}