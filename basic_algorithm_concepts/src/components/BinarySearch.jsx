import { useEffect, useRef, useState } from "react";
import "./../styles/Search.css";

const createARandomNumberSet = () => {

    let arr = Array.from({ length: 100 }, (_, i) => {
        return i + 1
    })
    return arr;
}

export default function BinarySearch({ }) {
    const [numbers, setNumbers] = useState(createARandomNumberSet());
    const [inputNum, setInputNum] = useState(0);
    const [search, setSearch] = useState(false);
    const [message, setMessage] = useState("");
    const [midIndex, setMidIndex] = useState(null);

    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(numbers.length - 1);

    const handleChange = (e) => {
        let n = parseInt(e.target.value);
        setInputNum(n)
    }

    const startSearch = () => {
        if (inputNum === "") {
            setMessage("Please enter a number");
            return;
        }
        setSearch(true);
        setMessage(`Searching for ${inputNum}...`);
        setHigh(numbers.length)
        setLow(0)
    };

    const stopSearch = () => {
        setSearch(false);
        setMessage("Search stopped");
    };

    useEffect(() => {
        if (!search) {
            return;
        }
        const timeout = setTimeout(() => {
            const mid = Math.floor((low + high) / 2);
            setMidIndex(mid);

            if(low>=high){
                if (numbers[mid] === inputNum) {
                    setMessage(`Number found at index ${mid}`);
                    setSearch(false);
                }
                else{
                    setSearch(false);
                    setMessage("Number not found")
                }
                return;
            }

            if (numbers[mid] === inputNum) {
                setMessage(`Number found at index ${mid}`);
                setSearch(false);
            }
            else if (inputNum < numbers[mid]) {
                setMessage(`${inputNum} < ${numbers[mid]} → searching left`);
                setHigh(mid - 1);
            }
            else {
                setMessage(`${inputNum} > ${numbers[mid]} → searching right`);
                setLow(mid + 1);
            }
        }, 1000);

        return () => clearTimeout(timeout);

    }, [search, low, high])

    return (
        <div className="BinarySearch">
            <h1 className="Title">Binary Search</h1>
            <div className="InputPanel">
                <label>Search a number between 1 to 100</label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={inputNum}
                    onChange={handleChange}
                    disabled={search}
                />
                <button onClick={startSearch} disabled={search}>Search</button>
                <button onClick={stopSearch} disabled={!search} style={{ backgroundColor: "crimson" }}>Stop</button>
            </div>
            <div className="Message">
                {message}
            </div>
            <div className="Grid" style={{gridTemplateColumns: `repeat(${Math.floor(Math.sqrt(numbers.length))}, 1fr)`}}>
                {numbers.map((i,k) =>
                    <div
                        className="Box"
                        key={i}
                        style={{
                            backgroundColor: k<=high && k>=low? "#F0008C": k==midIndex? "orange": "#222",
                            color: midIndex == k && "black",
                            border: `1px solid ${numbers[midIndex]==i ? "blue": "#555"}`
                        }}
                    >
                        {numbers[k]}
                    </div>)}
            </div>
        </div>
    )
}