//================== get All Asks ======================= //
exports.getAllAsks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    console.log(` limit ${limit}  .... skip ${skip}`);
    const askCount = await Askfor.find({}).countDocuments();
    const AllAsks = await Askfor.find(
      {},
      { City: 0, language: 0, description: 0, views: 0, ISBN: 0 }
    )
      .skip(skip)
      .limit(limit); // == use skip and limit ==/

    const opt = [
      { path: "bookID", select: "title img avgRating" },
      { path: "CategoryId", select: "name" },
      { path: "userId", select: " _id name " },
      { path: "authorId", select: "Name " }
    ];
    await Askfor.populate(AllAsks, opt);

    res.send({ AllAsks, askCount });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//============================= add new Askfor ================================//

//must be authorized
exports.addNewAsk = async (req, res, next) => {
  try {
    const afterCheck = await Askfor.checkAds(req); // check for existance of book and author
    const newAsk = new Askfor(afterCheck);
    newAsk.userId = req.user._id;
    await newAsk.save();
    res.status(201).send(newAsk);
  } catch (err) {
    console.log(err);
  }
};

//============== edit askfor ============================//
exports.editAskfor = async (req, res, next) => {
  const updates = Object.keys(req.body);
  // console.log(updates);
  const allowedUpdates = [
    "price",
    "title",
    "description",
    "askType",
    "CategoryId",
    "language",
    "City",
    "img",
    "bookID",
    "authorId",
    "ISBN",
    "authorName"
  ];
  const isVaildUpdate = updates.every(update => {
    return allowedUpdates.includes(update);
  });
  // console.log(isVaildUpdate);
  if (!isVaildUpdate) {
    return res.status(400).send({ error: "invaild updates" });
  }

  try {
    const AskId = req.params.id;
    console.log(req.user._id);
    const Ask = await Askfor.findOne({ _id: AskId, userId: req.user._id });
    if (!Ask) {
      res.status(404).send({ error: "no found ask   " });
    }

    const afterCheck = await Askfor.checkAds(req); // check for existance of book and author
    // console.log(afterCheck);

    afterEdited = await Askfor.findOneAndUpdate(AskId, afterCheck);
    res.send(afterEdited);
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
};

// ===================== get one Ask   =====================//
exports.getOneAsk = async (req, res, next) => {
  const ID = req.params.id;
  try {
    const oneAsk = await Askfor.findById(ID);
    await oneAsk.updateViews();

    const opt = [
      { path: "userId", select: "name" },
      { path: "City", select: "name" },
      { path: "bookID", select: "title avgRating" },
      { path: "authorId", select: "Name " },
      { path: "CategoryId", select: "catName " },
    ];
    await Askfor.populate(oneAsk, opt);

    res.send(oneAsk);
  } catch (e) {
    res.status(500).send(e);
  }
};

//========================= most viewed asks ===========================//
exports.mostViewedAsks = async (req, res, next) => {
  try {
    const result = await Askfor.aggregate([
      { $sort: { views: -1 } },
      { $limit: 3 },
      { $project: { title: 1, img: 1, userId: 1 } }
    ]);
    await Askfor.populate(result, { path: "userId", select: "name" });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

//========================== last 6 Asks ===================///

module.exports.getLastAsks = async (req, res, next) => {
  try {
    const lastAsks = await Askfor.aggregate([
      { $sort: { dateOfCreation: -1 } },
      { $limit: 6 },
      { $project: { userId: 1, img: 1, title: 1, CategoryId: 1, bookID: 1 } }
    ]);
    opt = [
      // {path:'City',select:'name'},
      { path: "userId", select: "name" },
      { path: "bookID", select: "title avgRating" },
      // {path:'authorId'},
      { path: "CategoryId", select: "catName" }
    ];
    await Askfor.populate(lastAsks, opt);
    res.send(lastAsks);
  } catch (e) {
    console.log(e);
  }
};
