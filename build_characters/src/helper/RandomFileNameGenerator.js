const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const N = 6;
function GenerateFileName(){
    let s= ''
    for(let i =0;i<N;i++){
        let n = Math.floor(Math.random()*26)
        s += letters[n]
    }
    return s;
}

// console.log(GenerateFileName())
export default GenerateFileName;