const express = require('express');
const router = express.Router();
const askforController = require('../controllers/askforController');
const multer = require('multer');
auth = require('../middlewares/auth')


var fileStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./uploads");
    //'./uploads':  Folder path where the file will be created
  },
  filename: function(req, file, callback) {
    console.log(file.mimetype);
    callback(null, Date.now()+ file.originalname); // + '-' + Date.now() + ".jpg");
    //concate date.now to differinciate is there are many files with the same name
  }
});
var upload = multer({ storage: fileStorage });


//========== upload images for askfor  or edit ===========================//
router.post('/Askfor/add/upload' ,upload.single('img') ,async(req, res, next) => {
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


//---------get all Askfor ---------------//
router.get('/Askfor',askforController.getAllAsks)

//------------- get one Askfor -------------//
router.get('/Askfor/:id',askforController.getOneAsk);

//---------Add new Askfor ---------------//
router.post('/Askfor/add',auth ,askforController.addNewAsk);

//========================== last 6 Asks ===================///
router.get("/lastAsks",askforController.getLastAsks)



//-------------- edit Askfor --------------// 
router.patch('/Askfor/edit/:id' , auth ,askforController.editAskfor);

//----------- most viewed Askfor ---------------//
router.get('/mostViewedAskfor',askforController.mostViewedAsks);

module.exports = router