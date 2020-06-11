const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const adminAuth = require('../middlewares/adminAuth')


var fileStorageAuthor = multer.diskStorage({
    destination: function(req, file, callback) {callback(null, "./uploads/authors")},
    filename: function(req, file, callback) {
      callback(null, Date.now()+ file.originalname); // + '-' + Date.now() + ".jpg");
    }
  });
var uploadAuthor = multer({ storage: fileStorageAuthor });

var fileStorage = multer.diskStorage({
    destination: function(req, file, callback) { callback(null, "./uploads");  },
    filename: function(req, file, callback) {
      callback(null, Date.now()+ file.originalname); // + '-' + Date.now() + ".jpg");
    }
  });
  var upload = multer({ storage: fileStorage });
  
//========================= add new admin ============================// 
router.post('/admin/signUp',adminController.signUp);


//========================= login admin ============================// 
router.post('/admin/login',adminController.logIn);


//========================= logout admin ============================// 
router.post('/admin/logout', adminAuth ,adminController.logOut);




//========================= get all users ===================//
router.get('/admin/getAllUsers', adminAuth ,adminController.getAllUsers);

//========================= delete an  user with all data and ads ===================//
router.post('/admin/deleteUser/:id', adminAuth ,adminController.deleteAnUser);




//========================= get all authors  ===================//
router.get('/admin/getAllAuthors', adminAuth ,adminController.getAllAuthors);

// ================== for image upload for author   ==================//
router.post('/admin/addNewAuthor/upload' , uploadAuthor.single('img') ,async(req, res, next) => {
  console.log(req.file)
  const file = req.file
  try{
      console.log(file.filename);
      res.send(file.filename)
    
  }catch(err){
    console.log(err)
    res.send(err);
  }
  
})



//========================= add new author  ===================//
router.post('/admin/addNewAuthor', adminAuth  ,adminController.addNewAuthor);

//========================= delete an author  ===================//
router.post('/admin/deleteAuthor/:id', adminAuth ,adminController.deleteAuthor);



//========================= get all books  ===================//
router.get('/admin/getAllBooks', adminAuth ,adminController.getAllBooks);

// ================== for image upload for books   ==================//
router.post('/admin/addNewBook/upload' , upload.single('img') ,async(req, res, next) => {
  console.log(req.file)
  const file = req.file
  try{
      console.log(file.filename);
      res.send(file.filename)
    
  }catch(err){
    console.log(err)
    res.send(err);
  }
  
})


//========================= add new book  ===================//
router.post('/admin/addNewBook', adminAuth , upload.single('img') ,adminController.addNewBook);

//========================= delete a book  ===================//
router.post('/admin/addNewBook/:id', adminAuth ,adminController.deleteBook);






//========================= show all ads  ===================//
router.get('/admin/getAllAds', adminAuth ,adminController.getAllAds);



//========================= delete an ads  ===================//
router.post('/admin/deleteAds/:id', adminAuth ,adminController.deleteAds);


module.exports = router