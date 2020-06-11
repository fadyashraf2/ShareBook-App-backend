//================== get All Ads ======================= //
exports.getAllAds = async (req, res) => {
  const limit =parseInt( req.query.limit );
  const skip =parseInt( req.query.skip );
    
  try {
    
    console.log(` limit ${limit}  .... skip ${skip}`);
    const  adsCount = await ads.find({}).countDocuments();
    const AllAds = await ads.find(
      {},
      { City: 0, language: 0, description: 0, views: 0, ISBN: 0 },
      
    ).skip(skip).limit(limit); // == use skip and limit ==/

    const opt = [
      { path: "bookID", select: "title img avgRating" },
      { path: "CategoryId", select: "catName" },
      { path: "userId", select: " _id name " },
      { path: "authorId", select: "Name " }
    ];
    await ads.populate(AllAds, opt);

    res.send({AllAds,adsCount});
  } catch (err) {
    res.status(500).send(err);
  }
};

//============================= add new ads ================================//

//must be authorized
exports.addNewAds = async (req, res, next) => {
  
try{
  console.log(req.body.formData);
  const afterCheck = await ads.checkAds( req ); // check for existance of book and author 
  const newAds = new ads(afterCheck);
  
  newAds.userId = req.user._id; 



  await newAds.save();
  res.status(201).send(newAds);
}catch(err){
  console.log(err)
}
 
};

//============== edit ads ============================//
exports.editAds = async (req, res, next) => {
  const updates = Object.keys(req.body);
  // console.log(updates);
  const allowedUpdates = [
     "price", "title","description", "adsType", "CategoryId", "language", "City", 
     "img", "bookID", "authorId","ISBN","authorName"
  ];
  const isVaildUpdate = updates.every(update => {
    return allowedUpdates.includes(update);
  });
  // console.log(isVaildUpdate);
  if (!isVaildUpdate) {
    return res.status(400).send({ error: "invaild updates" });
  }

  try {
    const adsID = req.params.id;
    console.log(req.user._id);
    const Ads = await ads.findOne({_id: adsID, userId: req.user._id});
    if(!Ads){
      res.status(404).send();
    }
    

    const afterCheck = await ads.checkAds( req ); // check for existance of book and author 
    console.log(afterCheck);
    
    afterEdited =await ads.findOneAndUpdate(adsID,afterCheck);
    res.send(afterEdited);
    

  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
};

// ===================== get one ads   =====================//
exports.getOneAds = async (req, res, next) => {
  const ID = req.params.id;
  try {
    const oneAds = await ads.findById(ID);
    await oneAds.updateViews();

    const opt = [
      { path: "userId", select: "name" },
      { path: "City", select: "name" },
      { path: "bookID", select: "title avgRating" },
      { path: "authorId", select: "Name " },
      { path: "CategoryId", select: "catName" }
    ];
    await ads.populate(oneAds, opt);

    res.send(oneAds);
  } catch (e) {
    res.status(500).send();
  }
};

//========================= most viewed ads ===========================//
exports.mostViewedAds = async (req, res, next) => {
  try {
    const result = await ads.aggregate([
      { $sort: { views: -1 } },
      { $limit: 3 },
      { $project: { title: 1, img: 1, userId: 1 } }
    ]);
    await ads.populate(result, { path: "userId", select: "name" });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};


//-================= upload img //////////
module.exports.uploadAdsImg = async(req,res)=>{
  try{
    res.send(req.file.filename)
  }
  catch(e){
    console.log(err);
    res.send(err);
  }
}



