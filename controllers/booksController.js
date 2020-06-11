// --------------Add new Book --------------------.///
exports.addNewBook = async (req, res, next) => {
  const newBook = new Book(req.body);
  try {
    await newBook.save();
    res.status(201).send(newBook);
  } catch (err) {
    res.status(400).send(err);
  }
};

// -------------get all Books---------------------- //////////////
exports.getAllBooks = async (req, res) => {
  try {
    const Books = await Book.find({});
    res.send(Books);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

// -------------get one Book with its comments---------------------- //////////////
exports.getOneBook = async (req, res) => {
  const ID = req.params.id;
  try {
    const book = await Book.findById(ID);
    book.updateViews();

    // from schema.virtual
    // await book.populate("CommentOnBook").execPopulate();
    
    await Book.populate(book,[{path:'CommentOnBook'},{path:'authorId'},{path:'CategoryId'}]);
    
    // console.log(await book.populate("CommentOnBook").execPopulate());
    
    
    const reviews = await CommentOnBook.find({bookId:ID}).countDocuments();

    
    // console.log(numberOfviews);
    const comments = book.CommentOnBook;
    opt = [{ path: "userId", select: "name" }];
    await CommentOnBook.populate(comments, opt);

    // console.log(book.CommentOnBook)

        
    res.send({ book, reviews});
    // return  comments


  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};



//////////////////////////////////////////////////////////////
/* const server = require("http").createServer(app);
const socket = require("socket.io");
const io = socket.listen(server);


 */



//----- comment on Book --------------////
exports.makeNewComment = async (req, res, next) => {
  req.body.userId  = req.user._id;
  // console.log(req.body.userId)
  const newComment = new CommentOnBook(req.body);
  try {
    await newComment.save();
    /* CommentOnBook.populate(newComment,{path:'userId'},{path:'bookId'})
    io.emit('commentAdded', ) */
    res.status(201).send(newComment);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};






// -------------Add new Category---------------------- //////////////
exports.addNewCategory = async (req, res, next) => {
  const newCategory = new Category(req.body);
  try {
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (err) {
    res.status(400).send(err);
  }
};

// ----------------get all Categories---------------------- //////////////
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.send(categories);
  } catch (err) {
    res.status(500).send(err);
  }
};

//---------------add new Author ---------------------//
exports.addNewAuthor = async (req, res, next) => {
  const newAuthor = new Author(req.body);
  try {
    await newAuthor.save();
    res.status(201).send(newAuthor);
  } catch (err) {
    res.status(400).send(err);
  }
};

// -------------get all authors ------------------//
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    res.send(authors);
  } catch (err) {
    res.status(500).send(err);
  }
};
