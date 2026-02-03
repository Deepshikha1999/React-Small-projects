import { useEffect, useState } from "react";
import "./../styles/Search.css";

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const createARandomNumberSet = () => {

    let arr = Array.from({ length: 100 }, (_, i) => {
        return i + 1
    })
    return shuffle(arr);
}

export default function LinearSearch({ }) {
    const [numbers, setNumbers] = useState(createARandomNumberSet());
    const [inputNum, setInputNum] = useState(0);
    const [search, setSearch] = useState(false);
    const [message, setMessage] = useState("");
    const [index, setIndex] = useState(null);

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
        setIndex(0);
        setNumbers(createARandomNumberSet())
    };

    const stopSearch = () => {
        setSearch(false);
        setMessage("Search stopped");
    };

    useEffect(() => {
        if (!search) return;

        const timeout = setTimeout(() => {
            if (index == numbers.length) {
                setMessage("Number not found")
                setSearch(false)
            }

            if (numbers[index] == inputNum) {
                setMessage(`Number found at index ${index}`)
                setSearch(false)
            }

            else if (numbers[index] != inputNum) {
                // setMessage(`Number not found at index ${index}`)
                setIndex((oldIndex) => oldIndex + 1)
            }
        }, 300)

        return () => clearTimeout(timeout);

    }, [search, index])

    return (
        <div className="LinearSearch">
           <h1 className="Title">Linear Search</h1> 
            <div className="InputPanel">
                <label>Enter any number between 1 to 100</label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={inputNum}
                    onChange={handleChange}
                    disabled={search}
                />
                <button onClick={startSearch} disabled={search}>Search</button>
                <button onClick={stopSearch} disabled={!search} style={{backgroundColor: "crimson"}}>Stop</button>
            </div>
            <div className="Message">
                {message}
            </div>
            <div className="Grid">
                {numbers.map((i,k) =>
                    <div
                        className="Box"
                        key={i}
                        style={{
                            backgroundColor: index == k && "yellow",
                            color: index == k && "black"
                        }}
                    >
                        {numbers[k]}
                    </div>)}
            </div>
        </div>
    )
}