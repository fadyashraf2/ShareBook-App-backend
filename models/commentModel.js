const mongoose = require('mongoose');
const validator = require('validator');


const Schema = mongoose.Schema;

CommentOnUserSchema = new Schema({
    sellerId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
   
    avgRating:{
        type:Number,
    }
},{timestamps:true})

CommentOnUserSchema.pre('save',async function(){
    const comment = this
    
    
    const rate = await CommentOnUser.aggregate([
        { $match: { sellerId: comment.sellerId} },
        {
          $group: {
            _id: "$sellerId",
            avgRating: { $avg: "$avgRating" }
          }
        }
      ])
      if( rate.length > 0 ){
        const updateUser = await User.updateOne({_id:comment.sellerId}, {avgRating:rate[0].avgRating}) 
        console.log(updateUser)
      }else{
        const updateUser = await User.updateOne({_id:comment.sellerId}, {avgRating:comment.avgRating}) 
        console.log(updateUser)
      }
    
      console.log(rate)

      
})






CommentOnUser = new mongoose.model('CommentOnUser',CommentOnUserSchema);



CommentOnBookSchema = new Schema({
    bookId:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    
    avgRating:{
        type:Number,
    }
},{timestamps:true})




CommentOnBookSchema.pre('save',async function(){
    const comment = this
    
    
    const rate = await CommentOnBook.aggregate([
        { $match: { bookId: comment.bookId} },
        {
          $group: {
            _id: "$bookId",
            avgRating: { $avg: "$avgRating" }
          }
        }
      ])
      if( rate.length > 0 ){
        const updateBook = await Book.updateOne({_id:comment.bookId}, {avgRating:rate[0].avgRating}) 
        console.log(updateBook)
      }else{
        const updateBook = await Book.updateOne({_id:comment.bookId}, {avgRating:comment.avgRating}) 
        console.log(updateBook)
      }
    
      console.log(rate)

      
})

CommentOnBook = new mongoose.model('CommentOnBook',CommentOnBookSchema);