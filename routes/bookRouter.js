const express = require('express');
const router = new express.Router();
const BookController = require('../controllers/booksController');
const auth = require('../middlewares/auth');

//for Book
//--------------- Add new Book ----------------//
router.post('/books/addBook', BookController.addNewBook);

//------------------- Get All Books ----------------------//
router.get('/books',BookController.getAllBooks)


//------------------- Get one Book ----------------------//
router.get('/book/:id',BookController.getOneBook);



//-------------- add new comment -------------////
router.post('/books/addComment', auth ,BookController.makeNewComment);

///////////////////////////////////////////////////////////////////////////



//for Category

//add New Category ---------//
router.post('/books/addCategory',BookController.addNewCategory ); // should be authorized for admin only

// get all Categories
router.get('/books/categories',BookController.getAllCategories)

//////////////////////////////////////////////////////



//for author 
// --------------------add new author --------//
router.post('/books/addAuthor',BookController.addNewAuthor); // should be authorized for admin only

//-------------get all authors-----------//
router.get('/books/authors',BookController.getAllAuthors);
/////////////////////


module.exports = router;