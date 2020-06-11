const mongoose = require('mongoose');
const validator = require('validator');


Schema =  mongoose.Schema;


askforSchema = new Schema({
    title:{
        type:String,
        require:true
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
    
    askType:{
        type:String,
        enum:['Borrow','Sale']
    },
    authorName:{
        type:String
    },
    authorId:{
        type: Schema.Types.ObjectId, 
        ref:'Author'
    },
    

    CategoryId:{
        type: Schema.Types.ObjectId, 
        ref:'Category'
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





askforSchema.methods.updateViews = async function(){
    const thisAsk = this
    thisAsk.views +=1
    await Askfor.updateOne({_id:thisAsk._id},{views: thisAsk.views});
    
}



// ====== check for book and author existance  before  add or edit  an ads
askforSchema.statics.checkAds =  async (req)=>{
    const thisAsk = req.body;
    ///////--check if book exists in books collection.///
    try {
        let BookExisted = await Book.findOne({
          $or: [{ _id: thisAsk.bookID }, { title: thisAsk.title }]
        });
        
        const newAsk = thisAsk;
    
    
        if (BookExisted) {
          //////------------------ book found in DB -------------------------//////
          console.log("existed");
    
          
          newAsk.bookID = await BookExisted._id;
          newAsk.authorId = await BookExisted.authorId;
          newAsk.ISBN = await BookExisted.ISBN;
          newAsk.CategoryId = await BookExisted.CategoryId;
          

          // console.log(newAds);
          // await newAds.save();  /// 
          // res.status(201).send(newAds);
          // next();
          return newAsk;
        } else {
          //////// ------------ book not found in data base  ----------------//
          console.log("not existed");
          let AuthorExisted = await Author.findOne({
            $or: [
              { _id: thisAsk.authorId },
              { Name: thisAsk.authorName },
              { NameAr: thisAsk.authorName }
            ]
          })
          
          // console.log(isAuthorExisted);
          
          
          if (AuthorExisted) {
            // ------- book not found but author is found ------///
            console.log("author exists but book not");
            
            const newBook = new Book({
              title: thisAsk.title,
              img: thisAsk.img,
              authorId: AuthorExisted._id,
              CategoryId:thisAsk.CategoryId,
              ISBN : thisAsk.ISBN

            });
            await newBook.save();
            
            newAsk.bookID = await newBook._id;
            newAsk.authorId = await newBook.authorId;
            newAsk.CategoryId = await newBook.CategoryId;
            return newAsk;
            
            // res.status(201).send(newAds);
          } else {
            
            
            // ------- book & author not found  ------///
            console.log("author and book not found");
            const newAuthor = await new Author({
              Name: thisAsk.authorName
            });
    
            await newAuthor.save();
    
            //new  book
            const newBook = await new Book({
              title: thisAsk.title,
              img: thisAsk.img,
              authorId: newAuthor._id,
              CategoryId: thisAsk.CategoryId,
              ISBN : thisAsk.ISBN
              
            });
            await newBook.save();
            
            console.log(newBook);
            newAsk.bookID = await newBook._id;
            newAsk.authorId = await newBook.authorId;
            
            return newAsk;
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








Askfor = mongoose.model('Askfor',askforSchema);

