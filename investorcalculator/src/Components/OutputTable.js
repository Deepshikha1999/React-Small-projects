import Record from "./Record";

const HEADERS = ["YEAR", "YEARLY INTEREST", "TOTAL INTEREST", "INVESTED VALUE", "INVESTED CAPITAL"]
export default function OutputTable({ records }) {
    return <table className="output-table">
        <tr>
            {HEADERS.map((item, index) => (<th key={index}>{item}</th>))}
        </tr>
        {records.map((item, index) => (
            <Record recordJSON={{ ...item }} key={index} />
        ))}
    </table>
}