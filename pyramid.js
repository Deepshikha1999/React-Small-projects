let arr = Array.from({length:6},()=>(Array.from({length:11},()=>(null))))

let[ x,y] = [6,6]
for (let i =0;i<6;i++){
    for(let j=0;j<x;j++){
        arr[i][j]="0"
    }
    for (let k=x;k<y;k++){
        arr[i][k]="5"
    }
    for(let l = y;l<11;l++){
        arr[i][l]="0"
    }
    x--;
    y++;
}

for (let i=0;i<6;i++){
    console.log(...arr[i])
}