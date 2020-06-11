express = require('express');
router = new express.Router();
auth = require('../middlewares/auth');
const multer = require('multer');



var fileStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./uploads/users");
    
  },
  filename: function(req, file, callback) {
    console.log(file.mimetype);
    callback(null, Date.now()+ file.originalname); // + '-' + Date.now() + ".jpg");
    //concate date.now to differinciate is there are many files with the same name
  }
});
var upload = multer({ storage: fileStorage });




userController = require('../controllers/userController');



//========== upload user or edit ===========================//
router.post('/user/signup/upload' , upload.single('img') ,async(req, res, next) => {
  console.log(req.file)
  const file = req.file
  try{
      console.log(file.filename);
      res.send({"img":file.filename})
    
  }catch(err){
    console.log(err)
    res.send(err);
  }
  
})


router.get('/users',userController.getAllUsers);

router.get('/user/me', auth , async (req, res)=>{
    
    res.send( req.user ); 
})



router.get('/users/getOneUser/:id',userController.getOneUser);

router.post('/users/signup',userController.signUp);

router.post('/users/login', userController.logIn);

router.post('/users/logout', auth ,userController.logOut);

router.post('/users/logoutAll', auth ,userController.logOutAll);


router.post ('/users/edit', auth ,userController.updateUser)

router.post('/users/comment', auth ,userController.commentOnUser);

router.get('/users/Activity', auth ,userController.getUserActivity);

module.exports = router