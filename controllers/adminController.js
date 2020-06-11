express = require('express');



// ====================== sign up ======================//
exports.signUp = async (req, res, next) => {
    const newAdmin = new Admin(req.body);
    try{
        await newAdmin.save();
        const token = await newAdmin.generateAuthToken();

        res.status(201).send({newAdmin,token});
    }catch(e){
        res.status(400).send(e);
    }
    
    
};

// ====================== log in  ======================//
 exports.logIn = async (req,res,next)=>{
    try{
        const admin = await Admin.findByCredentials(req.body.email , req.body.password);
        
        const token = await admin.generateAuthToken();

        res.send({admin,token});
        
    }catch(e){
        res.status(400).send();
        console.log(e);
    }
}

// ====================== log out ======================//
 exports.logOut = async (req,res,next)=>{
    try{
        
        
        req.admin.tokens = req.admin.tokens.filter( (token) =>{
            return token.token !== req.token 

        })
        await req.admin.save()
        res.send();
        
    }catch(e){
        res.status(500).send();
        console.log(e);
    }
}

// ====================== log out from all devices ======================//
 exports.logOutAll = async (req,res,next)=>{
    try{
        req.admin.tokens = [];
        await req.admin.save()
        res.send();
        
    }catch(e){
        res.status(500).send();
        console.log(e);
    }
}


// ====================== get all users ======================//
exports.getAllUsers = async (req,res)=>{
  try{
      const users = await  User.find({},{password:0,tokens:0});
      res.send(users);
  }catch(e){
      res.status(500).send(e);
  }
}    

// ====================== delete an users ======================//
exports.deleteAnUser = async (req,res)=>{
  try{
      const ID = req.params.id
      await  User.findByIdAndDelete(ID);
      await  ads.findOneAndDelete({userId:ID});
      await  Askfor.findOneAndDelete({userId:ID});
      await  CommentOnUser.findOneAndDelete({customerId:ID});
      await  CommentOnBook.findOneAndDelete({userId:ID});

      res.send("deleted successfully");
  }catch(e){
      res.status(500).send(e);
  }
}    

//==================================



//================= get all author ==========================//
exports.getAllAuthors = async (req, res) => {
    try {
      const authors = await Author.find({});
      res.send(authors);
    } catch (err) {
      res.status(500).send(err);
    }
};
//================= get one author ==========================//
exports.getOneAuthor = async (req, res) => {
    try {
      const ID = req.params.id
      const authors = await Author.findById(ID);
      res.send(authors);
    } catch (err) {
      res.status(500).send(err);
    }
};

  
//================= add new author ==========================//
exports.addNewAuthor = async (req, res, next) => {
    const newAuthor = new Author(req.body);
    try {
      
      await newAuthor.save();
      res.status(201).send(newAuthor);
    } catch (err) {
      res.status(400).send(err);
    }

};


//====================== delete an author =====================//
exports.deleteAuthor = async (req, res, next) => {
    const ID = req.params.id
    
    try {
    await  Author.findByIdAndDelete(ID);
      res.send('deleted successfully ');
    
    } catch (err) {
      res.status(400).send(err);
    }

};




//================= get all Books ==========================//
exports.getAllBooks = async (req, res) => {
    try {
      const Books = await Book.find({});
      res.send(Books);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  };
  
  
//================= add new Book ==========================//
exports.addNewBook = async (req, res, next) => {
    const newBook = new Book(req.body);
    try {
     
      await newBook.save();
      res.status(201).send(newBook);
    } catch (err) {
      res.status(400).send(err);
    }
};
  

//====================== delete a book =====================//
exports.deleteBook = async (req, res, next) => {
    const ID = req.params.id
    
    try {
    await  Book.findByIdAndDelete(ID);
      res.send('deleted successfully ');
    
    } catch (err) {
      res.status(400).send(err);
    }

};



//================= add new Category ==========================//
exports.addNewCategory = async (req, res, next) => {
    const newCategory = new Category(req.body);
    try {
      await newCategory.save();
      res.status(201).send(newCategory);
    } catch (err) {
      res.status(400).send(err);
    }
};
    
  

//================== get All Ads ======================= //
exports.getAllAds = async (req, res) => {
  try {
    const Ads = await ads.find({});
    res.send(Ads);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

//====================== delete an ads =====================//
exports.deleteAds = async (req, res, next) => {
  const ID = req.params.id
  
  try {
  await  ads.findByIdAndDelete(ID);
    res.send('deleted successfully ');
  
  } catch (err) {
    res.status(400).send(err);
  }

};
