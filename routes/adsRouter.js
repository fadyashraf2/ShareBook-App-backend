const express = require('express');
const router = express.Router();
const adsController = require('../controllers/adsController');
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



//========== upload images for ads or edit ===========================//
router.post('/ads/add/upload' ,upload.single('img') ,async(req, res, next) => {
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


//---------get all ads ---------------//
router.get('/ads',adsController.getAllAds)

//------------- get one ads -------------//
router.get('/ads/:id',adsController.getOneAds);

//---------Add new ads ---------------//
router.post('/ads/add',auth ,adsController.addNewAds);


//-------------- edit ads --------------// 
router.patch('/ads/edit/:id' , auth ,adsController.editAds);

//----------- most viewed ads ---------------//
router.get('/mostViewedAds',adsController.mostViewedAds);

module.exports = router