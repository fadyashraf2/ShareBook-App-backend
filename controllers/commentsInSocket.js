//============= on books =============================================//
module.exports.getCommentsOnBooks = async (ID)=>{
    try {
        const book = await Book.findById(ID);
        await Book.populate(book,[{path:'CommentOnBook'},{path:'authorId'},{path:'CategoryId'}]);
        
        // console.log(await book.populate("CommentOnBook").execPopulate());
        
        
        const numberOfRates = await CommentOnBook.find({bookId:ID}).countDocuments();
        const avgRating = book.avgRating;
        // console.log(numberOfviews);
        const comments = book.CommentOnBook;
        opt = [{ path: "userId", select: "name" }];
        await CommentOnBook.populate(comments, opt);
    
        // console.log(book.CommentOnBook)
    
            
        // console.log ({comments,"reviews":{numberOfRates,avgRating}}) 
        return  {comments,"reviews":{numberOfRates,avgRating}};
        
    
    
      } catch (e) {
        console.log(e);
        return e;
      }
}


module.exports.getCommentsOnUser = async (sellerId)=>{
    try {
        
        const numberOfRates = await CommentOnUser.find({sellerId}).countDocuments();
        const avgRating = await User.findById(sellerId,{avgRating:1,_id:0});
        
        const comments = await CommentOnUser.find({sellerId});
        opt = [{ path: "sellerId", select: "name" },{ path: "customerId", select: "name" }];
        await CommentOnUser.populate(comments, opt);
    
            
        
        return  {comments,"reviews":{numberOfRates,"avgRating":avgRating.avgRating}};
    
    
      } catch (e) {
        console.log(e);
        return e;
      }
}


