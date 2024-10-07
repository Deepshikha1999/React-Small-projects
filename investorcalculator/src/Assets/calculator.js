export default function calculator(org_record) {
    let record = { ...org_record };
    let totalInterest = 0;
    let investedCapital = record.initial;
    let output = [];
  
    for (let i = 1; i <= record.duration; i++) {
        let json = {};
        json.year = i;
        
        // Calculate yearly interest and fix it to 2 decimal places
        json.interestYearly = Number(((record.initial * record.return) / 100).toFixed(2));
        
        // Add yearly interest to total interest and fix it to 2 decimal places
        json.totalInterest = Number((json.interestYearly + totalInterest).toFixed(2));
        
        // Update totalInterest for the next year
        totalInterest = Number(json.totalInterest.toFixed(2));
        
        // Calculate invested value (capital + interest) and fix to 2 decimal places
        json.investedValue = Number((investedCapital + record.annual + json.totalInterest).toFixed(2));
        
        // Calculate invested capital (capital without interest) and fix to 2 decimal places
        json.investedCapital = Number((investedCapital + record.annual).toFixed(2));
        
        // Update invested capital for the next iteration
        investedCapital = Number(json.investedCapital.toFixed(2));
        
        // Update record's initial for next iteration (new invested value)
        record.initial = Number(json.investedValue.toFixed(2));
        
        // Add the year's data to the output array
        output.push(json);
    }
    
    return output;
}
