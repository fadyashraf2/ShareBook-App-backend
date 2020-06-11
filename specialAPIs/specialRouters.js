const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// ------------------authors with most books --------------//
router.get("/popularAuthors", async (req, res, next) => {
  try {
    const result = await Book.aggregate([
      { $group: { _id: "$authorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 } // change to 6
    ]);
    const IdArray = [];
    result.forEach(element => {
      IdArray.push(element._id);
    });
    console.log(IdArray);

    const r = await Author.find({ _id: { $in: IdArray } });
    res.send(r);
  } catch (err) {
    console.log(err);
  }
});

// ------------------books with most comments --------------//
router.get("/booksWithMostComments", async (req, res, next) => {
  try {
    const booksArr = await CommentOnBook.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    const IdArray = [];
    booksArr.forEach(element => {
      IdArray.push(element._id);
    });
    console.log(IdArray);

    const books = await Book.find({ _id: { $in: IdArray } });
    
    var opts = [{path:'authorId',select:'Name NameAr'},{path:'CategoryId',select:'catName'}]
    await Book.populate(books,opts)
    
    
    res.send(books);
  } catch (err) {
    console.log(err);
  }
});

// ------------------categories with most books --------------//
router.get("/categoriesWithMostBooks", async (req, res, next) => {
  try {
    const result = await Book.aggregate([
      { $group: { _id: "$CategoryId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]);
    const IdArray = [];
    result.forEach(element => {
      IdArray.push(element._id);
    });

    const Categories = await Category.find({ _id: { $in: IdArray } });
    const objArr = [];

    for (let x = 0; x < Categories.length; x++) {
      objArr.push({ catName: Categories[x].catName, count: result[x].count });
      // console.log(Categories[x].catName);
    }

    console.log(objArr);

    res.send(objArr);
  } catch (err) {
    console.log(err);
  }
})

//========================== last 3 ads ===================///

router.get("/lastAds", async (req, res, next) => {
  try {
    const lastAds = await ads.aggregate([
      { $sort: { dateOfCreation: -1 } },
      { $limit: 3 },
      {$project:{userId: 1, img: 1, title: 1, CategoryId: 1, bookID:1}}
      
    ]);
    opt =[
      // {path:'City',select:'name'},
      {path:'userId',select:'name'},
      {path:'bookID',select:'title avgRating'},
      // {path:'authorId'},
      {path:'CategoryId',select:'catName'},
    ]
    await ads.populate(lastAds,opt);

    

    res.send(lastAds);
  } catch (e) {
    console.log(e);
  }
});
//========================== number of users ===================///

router.get("/numberOfUsers", async (req, res, next) => {
  try {
    const numberOfUsers = await User.countDocuments();
    res.send({ numberOfUsers });
  } catch (e) {
    console.log(e);
  }
});

//========================== number of Books ===================///

router.get("/numberOfBooks", async (req, res, next) => {
  try {
    const numberOfBooks = await Book.countDocuments();
    res.send({ numberOfBooks });
  } catch (e) {
    console.log(e);
  }
});

//========================== number of ads ===================//

router.get("/numberOfAds", async (req, res, next) => {
  try {
    const numberOfAds = await ads.countDocuments();
    res.send({ numberOfAds });
  } catch (e) {
    console.log(e);
  }
});

//========================== number of Asks ===================//

router.get("/numberOfAsks", async (req, res, next) => {
  try {
    const numberOfAsks = await Askfor.countDocuments();
    res.send({ numberOfAsks });
  } catch (e) {
    console.log(e);
  }
});





//========================== popular users ( with most ads ) ===================//
router.get("/popluarUsers", async (req, res, next) => {
  try {
    const result = await ads.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 } 
    ]);

    const IdArray = [];
    result.forEach(element => {
      IdArray.push(element._id);
    });

    const usersArr = await User.find({ _id: { $in: IdArray } });

    finalResult = [];

    for (let x = 0; x < result.length; x++) {
      finalResult.push({ count: result[x], user: usersArr[x] });
    }

    res.send(finalResult);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

//========================== popular users ( with most asks ) ===================//
router.get("/asks/popluarUsers", async (req, res, next) => {
  try {
    const result = await Askfor.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 } 
    ]);

    const IdArray = [];
    result.forEach(element => {
      IdArray.push(element._id);
    });

    const usersArr = await User.find({ _id: { $in: IdArray } });

    finalResult = [];

    for (let x = 0; x < result.length; x++) {
      finalResult.push({ count: result[x], user: usersArr[x] });
    }

    res.send(finalResult);
    console.log(finalResult)
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;



//========================== popular users ( with most ads ) ===================//
router.get("/popluarUsers", async (req, res, next) => {
  try {
    const result = await ads.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 } 
    ]);

    const IdArray = [];
    result.forEach(element => {
      IdArray.push(element._id);
    });

    const usersArr = await User.find({ _id: { $in: IdArray } });

    finalResult = [];

    for (let x = 0; x < result.length; x++) {
      finalResult.push({ count: result[x], user: usersArr[x] });
    }

    res.send(finalResult);
  } catch (err) {
    console.log(err);
  }
});


router.post('/search',async (req,res)=>{
  try{
    const searchWord = req.body.searchWord;
    console.log(searchWord)
    authorIdArr = [];
    
    authorsResult = await Author.find({$or:[{Name:{$regex: searchWord  }},{NameAr:{$regex: searchWord  }}]},{_id:1})
    
    bookResult = await Book.find({title:{$regex: searchWord  }})
    
    authorsResult.forEach( ele=> {
      authorIdArr.push(ele._id) 
    });
    adsResult = await ads.find({$or:[{title:{$regex: searchWord  }},{authorId:{$in:authorIdArr}}]},{_id:1,title:1})
    
    askResult = await Askfor.find({$or:[{title:{$regex: searchWord  }},{authorId:{$in:authorIdArr}}]},{_id:1,title:1})
    
    res.send({adsResult,askResult,bookResult});
  }catch(err){
    console.log(err)
  }
  
})

module.exports = router;


