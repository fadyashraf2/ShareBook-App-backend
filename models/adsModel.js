const mongoose = require('mongoose');
const validator = require('validator');


Schema =  mongoose.Schema;


adsSchema = new Schema({
    title:{
        type:String
    },
    bookID:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required:true,
        
    },
    
    description:{
        type:String,
        
    },
    ISBN:{
        type:String
    },
    img:{
        type:String,
        
    },
    price:{
        type:String,
        default:'free'
    },
    adsType:{
        type:String,
        enum:['Borrow','Sale']
    },
   /*  authorName:{
      type:String,
      required:false
    }, */
    authorId:{
        type: Schema.Types.ObjectId, 
        ref:'Author',
        required:true
    },
    /* dateOfCreation:{
        type:Date,
        default:Date.now
    }, */
    CategoryId:{
        type: Schema.Types.ObjectId, 
        ref:'Category',
        // required:true
    },
    views:{
        type:Number,
        default:0
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    edition:{
        type:String
    },
    language:{
        type:String,
    },
    City:{
        type:Schema.Types.ObjectId,
        ref:'Governorate'
    }
    
},{timestamps:true})

adsSchema.index({title:'text'})


adsSchema.methods.updateViews = async function(){
    const thisAds = this
    thisAds.views +=1
    await ads.updateOne({_id:thisAds._id},{views: thisAds.views});
    
}



// ====== check for book and author existance  before  add or edit  an ads
adsSchema.statics.checkAds =  async (req)=>{
    const ThisAds = req.body;
    ///////--check if book exists in books collection.///
    try {
        let BookExisted = await Book.findOne({
          $or: [{ _id: ThisAds.bookID }, { title: ThisAds.title }]
        });
        // const newAds = new ads(ThisAds);
        const newAds = ThisAds;
        // console.log(req.file.filename );
         
    
    
        if (BookExisted) {
          //////------------------ book found in DB -------------------------//////
          console.log("existed");
    
          
          newAds.bookID = await BookExisted._id;
          newAds.authorId = await BookExisted.authorId;
          newAds.ISBN = await BookExisted.ISBN;
          newAds.CategoryId = await BookExisted.CategoryId;
          
    
          // console.log(newAds);
          // await newAds.save();  /// 
          // res.status(201).send(newAds);
          // next();
          return newAds;
        } else {
          //////// ------------ book not found in data base  ----------------//
          console.log("not existed");
          let AuthorExisted = await Author.findOne({
            $or: [
              { _id: ThisAds.authorId },
              { Name: ThisAds.authorName },
              { NameAr: ThisAds.authorName }
            ]
          })
          
          // console.log(isAuthorExisted);
          
          
          if (AuthorExisted )  {
            // ------- book not found but author is found ------///
            console.log("author exists but book not");
            console.log(`author ${AuthorExisted}`)
            
            const newBook = new Book({
              title: ThisAds.title,
              img: ThisAds.img,
              authorId: AuthorExisted._id,
              CategoryId:ThisAds.CategoryId,
              ISBN : ThisAds.ISBN

            });
            await newBook.save();
            
            newAds.bookID = await newBook._id;
            newAds.authorId = await newBook.authorId;
            newAds.CategoryId = await newBook.CategoryId;
            return newAds;
            
            // res.status(201).send(newAds);
          } else {
            
            
            // ------- book & author not found  ------///
            console.log("author and book not found");
            const newAuthor = await new Author({
              Name: ThisAds.authorName
            });
    
            await newAuthor.save();
    
            //new  book
            const newBook = await new Book({
              title: ThisAds.title,
              img: ThisAds.img,
              authorId: newAuthor._id,
              CategoryId: ThisAds.CategoryId,
              ISBN :  ThisAds.ISBN
            });
            await newBook.save();
            
            console.log(newBook);
            newAds.bookID = await newBook._id;
            newAds.authorId = await newBook.authorId;
            
            return newAds;
            // next();
            // await newAds.save();
            // res.status(201).send(newAds);
          }
    
          // await newBook.save();
          
        }
      } catch (err) {
        console.log(err);
        throw new Error();
      }
    
    
}

ads = mongoose.model('ads',adsSchema);

