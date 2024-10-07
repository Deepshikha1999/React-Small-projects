export default function Record({recordJSON}){
    return <tr>
        {Object.keys(recordJSON).map((item,index)=>{
            if(item.toUpperCase()!=='YEAR')
            return <td key={index}>$ {recordJSON[item].toFixed(2)}</td>
            else
            return <td key={index}>{recordJSON[item]}</td>
        })}
    </tr>
}

// year,investmentvalue,interestYearly,totalInterest,investedcapital