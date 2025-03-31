import { useEffect, useState } from 'react'
import './App.css'
import Book from './components/Book'
import { FaBoxOpen, FaDumpster, FaPlus } from "react-icons/fa"


const defaultFileName = "Untitled_";

function App() {
  const [books, setBooks] = useState([])
  const [fileName, setFileName] = useState(null)
  const [renameIndex, setRenameIndex] = useState(null)
  const [showButton, setShowButtons] = useState(null)
  const [openCurrentBook, setOpenCurrentBook] = useState(null)


  function createEmptyBook() {
    setBooks((currBooks) => {
      let newBooks = [...currBooks]
      newBooks.push([fileName, [],newBooks.length])
      setOpenCurrentBook(newBooks[newBooks.length - 1])
      return newBooks
    })
    setFileName(null)
  }

  function setName() {
    setFileName(defaultFileName + books.length)
  }

  function Rename(index) {
    setRenameIndex(index)
  }

  function SetName(e) {
    if (e.keyCode == 13) {
      setRenameIndex(null)
    }
  }

  function RenameBookName(e, index) {
    setBooks((currbooks) => {
      let newbooks = [...currbooks]
      newbooks[index][0] = e.target.value;
      return newbooks;
    })
  }

  useEffect(() => {
    if (renameIndex != null) {
      const timeout = setTimeout(() => {
        setRenameIndex(null)
      }, 5000)
      return () => (clearTimeout(timeout))
    }
  }, [renameIndex])

  function HandleMouseOver(index) {
    setShowButtons(index)
  }
  function HandleMouseLeave(index) {
    setShowButtons(null)
  }

  function HandleDelete(index) {
    setBooks((currBooks) => {
      let newBooks = [...currBooks]
      newBooks.splice(index, 1)
      return newBooks
    })
  }

  return (
    <div className='App'>
      <div className='Header'>
        <div className="Title">NOTEBOOK</div>
        <button className="Exit" onClick={() => {
          setOpenCurrentBook(null)
        }}>
          EXIT
        </button>
        {openCurrentBook == null && <div className='row'
          onClick={setName}
          style={{
            top: "10%",
            position: "absolute"
          }}>
          {fileName == null ?
            <><FaPlus className="Icon" /> Create new book</> :
            <input
              className="InputFieldForFileName"
              type="text"
              defaultValue={fileName}
              onChange={(e) => {
                setFileName(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  createEmptyBook()
                }
              }}
            />}
        </div>}

      </div>


      {
        openCurrentBook == null ?
          <div className='BookStore'>
            {books.map((book, i) => (
              <div className='row'
                key={i}
                onMouseOver={(e) => HandleMouseOver(i)}
                onMouseLeave={(e) => HandleMouseLeave(i)}
              >

                {renameIndex != null && renameIndex == i ?
                  <input
                    className="InputFieldForFileName"
                    type="text" defaultValue={book[0]}
                    onChange={(e) => { RenameBookName(e, i) }}
                  /> :
                  <div
                    onDoubleClick={() => (Rename(i))}
                    onKeyDown={SetName}
                  >{book[0]}
                  </div>}

                {showButton != null && showButton == i && <>
                  <button className="buttons" onClick={() => { setOpenCurrentBook(book) }}>
                    <FaBoxOpen /> OPEN
                  </button>
                  <button className="buttons" onClick={(e) => HandleDelete(i)}>
                    <FaDumpster /> DEL
                  </button>
                </>}
              </div>
            ))}
          </div> :
          <Book
            filename={openCurrentBook[0]}
            setBooks={setBooks}
            id={openCurrentBook[2]}
            book={openCurrentBook[1]}>
          </Book>
      }

    </div>
  )
}

export default App
