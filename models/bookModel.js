const mongoose = require("mongoose");
const validator = require("validator");

Schema = mongoose.Schema;


//category //////////////////////////////////////
CategorySchema = new Schema({
  catName: {
    type: String,
    required: true,
    unique: true
  }
});

Category = new mongoose.model("Category", CategorySchema);
///////////////////////////////////


//author -------------------------///////////////////////////////////
AuthorSchema = new Schema({
  Name: {
    type: String,
    required: true,
    unique: true
  },
  NameAr:{
    type: String,
    // unique: true,
    // sparse:true
  },
  img: {
    type: String
  },
  description: {
    type: String
  }
});

Author = new mongoose.model("Author", AuthorSchema);
//-------------------------------------------------------------//




//book ------------------ //////////
bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  ISBN: {
    type: String,
    unique: true
  },
  img: {
    type: String
  },

  avgRating: {
    type: Number,
    default: 0
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Author"
  },
  dateOfCreation: {
    type: Date,
    default: Date.now
  },
  CategoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  views: {
    type: Number,
    default: 0
  }
});

bookSchema.methods.updateViews = async function(){
  book = this
  book.views +=1
  await Book.updateOne({_id:book._id},{views:book.views})
  
}


bookSchema.virtual('CommentOnBook',{
  ref:'CommentOnBook',
  localField:'_id',
  foreignField:'bookId'
})

Book = mongoose.model("Book", bookSchema);

