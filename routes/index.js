const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/file')

class Book {
  constructor(id = uuid(), title = '', description = '', authors = '', favorite = '', fileCover = '', fileName = '') {
    this.id = id,
    this.titlt = title,
    this.description = description,
    this.authors = authors,
    this.favorite = favorite,
    this.fileCover = fileCover,
    this.fileName = fileName
  }
}

const stor = {
  book: [],
  user: [],
};

router.get('/', (req, res) => {
  const {url} =  req
  res.json({url})
})

router.post('/api/user/login', (req, res) => {
  res.status(201)
  res.json({id: 1, mail: "test@mail.ru"})
})

router.get('/api/books', (req, res) => {
  const {book} = stor
  res.json(book)
})

router.get('/api/books/:id', (req, res) => {
  const {book} = stor
  const {id} = req.params
  const idx = book.findIndex(el => el.id === id)

  if( idx !== -1) {
    res.json(book[idx])
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
})

router.post('/api/books/', 
  fileMulter.single('upload-file'), 
  (req, res) => {
    const {book} = stor
    const {title, description, authors, favorite, fileCover, fileBook, fileName} = req.body
    const newBook = new Book(title, description, authors, favorite, fileCover, fileBook, fileName)
    book.push(newBook)

    res.status(201)
    res.json(newBook)
  }
)

router.put('/api/books/:id', (req, res) => {
  const {book} = stor
  const {title, description, authors, favorite, fileCover, fileBook, fileName} = req.body
  const {id} = req.params
  const idx = book.findIndex(el => el.id === id)

  if (idx !== -1){
    book[idx] = {
      ...book[idx],
      title,
      description, 
      authors,
      favorite, 
      fileCover, 
      fileBook,
      fileName
    }

    res.json(book[idx])
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
})

router.delete('/api/books/:id', (req, res) => {
  const {book} = stor
  const {id} = req.params
  const idx = book.findIndex(el => el.id === id)
     
  if(idx !== -1){
    book.splice(idx, 1)
    res.json('ok')
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
})

router.get('/api/books/:id/download', (req, res) => {
  const {book} = stor
  const {id} = req.params
  const idx = book.findIndex(el => el.id === id)

  if( idx !== -1) {
    res.download(book[idx].fileBook)
  } else {
    res.status(404)
    res.json('404 | Page not found')
  }
}, (req, res) => {
  express.static(res)
})

module.exports = router