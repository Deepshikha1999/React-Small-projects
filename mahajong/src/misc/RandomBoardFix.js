const IMG_LINKS = ["https://www.ghibli.jp/gallery/majo",
  "https://www.ghibli.jp/gallery/chihiro",
  "https://www.ghibli.jp/gallery/totoro",
  "https://www.ghibli.jp/gallery/kokurikozaka",
  "https://www.ghibli.jp/gallery/kazetachinu",
  "https://www.ghibli.jp/gallery/howl",
  "https://www.ghibli.jp/gallery/mimi",
  "https://www.ghibli.jp/gallery/ponyo"]

let setBoard = (board, randomImg) => {
    const list_of_imgs = Array.from({ length: parseInt((parseInt(board.length/2))) }, (_, i) => {
        let z = i + 1
        let k = (z + "").length == 1 ? "00" + z : "0" + z
        console.log(IMG_LINKS[randomImg])
        let s = IMG_LINKS[randomImg] + k + ".jpg" // IMG_LINKS[n] configurable
        return s
      })
    console.log(list_of_imgs)
    let indexList = Array.from({ length: board.length }, (_, i) => {return i })

    for (let img of list_of_imgs) {
        for (let i = 0; i < 2; i++) {
            let x = Math.floor(Math.random() * indexList.length)
            // console.log(x,indexList[x])
            board[indexList[x]].imagePath = img
            board[indexList[x]].flipStatus = false
            indexList.splice(x, 1)
        }
    }
    return board
}

export default setBoard
// setBoard(Array.from({ length: 64 }, () => {
//     return {
//         "flipStatus": false,
//         "imagePath": null
//     }
// }), randomIndexOfImg