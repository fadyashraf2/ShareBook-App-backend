adsSchema.statics.checkAds =  async (req)=>{
    const ThisAds = req.body;
    ///////--check if book exists in books collection.///
    try {
        let isBookExisted = await Book.findOne({
          $or: [{ _id: ThisAds.bookID }, { title: ThisAds.title }]
        }).lean();
        const newAds = new ads(ThisAds);
        newAds.img = await req.file.filename;
    
        if (isBookExisted) {
          //////------------------ book found in DB -------------------------//////
          console.log("existed");
    
          let oldBook = await Book.findOne({ title: ThisAds.title });
          newAds.bookID = await oldBook._id;
          newAds.authorId = await oldBook.authorId;
          newAds.ISBN = await oldBook.ISBN;
          newAds.CategoryId = await oldBook.CategoryId;
    
          console.log(newAds);
          // await newAds.save();  /// hi
          // res.status(201).send(newAds);
          // next();
          return newAds;
        } else {
          //////// ------------ book not found in data base  ----------------//
          console.log("not existed");
          let isAuthorExisted = await Author.findOne({
            $or: [
              { _id: ThisAds.authorId },
              { Name: ThisAds.authorName },
              { NameAr: ThisAds.authorName }
            ]
          }).lean();
          
          // console.log(isAuthorExisted);
          
          
          if (isAuthorExisted) {
            // ------- book not found but author is found ------///
            console.log("author exists but book not");
            
            const newBook = new Book({
              title: ThisAds.title,
              img: ThisAds.img,
              authorId: isAuthorExisted._id
            });
            await newBook.save();
            
            newAds.bookID = await newBook._id;
            newAds.authorId = await newBook.authorId;
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
              authorId: newAuthor._id
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
