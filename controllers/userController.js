express = require('express');



// ====================== sign up ======================//
exports.signUp = async (req, res, next) => {
    const newUser = new User(req.body);
    try{
        
        await newUser.save();
        const token = await newUser.generateAuthToken();

        res.status(201).send({newUser,token});
    }catch(e){
        res.status(400).send(e);
    }
    
    
};

// ====================== log in  ======================//
 exports.logIn = async (req,res,next)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password);
        
        const token = await user.generateAuthToken();

        res.send({user,token});
        
    }catch(e){
        res.status(400).send();
        console.log(e);
    }
}

// ====================== log out ======================//
 exports.logOut = async (req,res,next)=>{
    try{
        // console.log(token);
        // const token = req.token;
        console.log(req.user);
        req.user.tokens = req.user.tokens.filter( (token) =>{
            return token.token !== req.token 

        })
        await req.user.save()
        res.send();
        
    }catch(e){
        res.status(500).send();
        console.log(e);
    }
}

// ====================== log out from all devices ======================//
 exports.logOutAll = async (req,res,next)=>{
    try{
        req.user.tokens = [];
        await req.user.save()
        res.send();
        
    }catch(e){
        res.status(500).send();
        console.log(e);
    }
}

//===================== get one user page ====================//
exports.getOneUser = async (req, res) => {
    const ID = req.params.id;
    try {
      const user = await User.findById(ID,{password:0,tokens:0});
          
      res.send(user);
      // return  comments
  
  
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  };
  
  

// ====================== get all users ======================//
exports.getAllUsers = async (req,res)=>{
    try{
        const users = await  User.find({});
        res.send(users);
    }catch(e){
        res.status(500).send(e);
    }
}    



// ====================== update user ======================//
exports.updateUser = async (req,res)=>{
    const updates = Object.keys(req.body);
    console.log(updates);
    const allowedUpdates = ['name','email','password','phone','img','GovernorateId'];
    const isVaildUpdate = updates.every((update)=>{ return allowedUpdates.includes(update) });
    console.log(isVaildUpdate);
    if(!isVaildUpdate){
        return res.status(400).send({'error' : 'invaild updates'});
    }

    try{
        const user = req.user
        // const user = await User.findById(ID);
        updates.forEach((update)=>{
            user[update] = req.body[update];
        })
       await user.save() ;
       if(!user){
           res.status.send(404).send();
       }
       res.send(user);
       console.log(user)
    }catch(e){
        res.status(400).send(e)
    }
}



// ====================== comment on user  ======================//
exports.commentOnUser =  async (req, res, next) => {
    const newComment = new CommentOnUser(req.body);
    try{
        newComment.customerId = req.user._id;
        await newComment.save();
        res.status(201).send(newComment);
    }catch(e){
        res.status(400).send(e);
    }
    
    
}


//============================== user activity ===========================//
exports.getUserActivity = async(req,res,next)=>{
    try{    
        const userId = req.user._id;
        AllAds    =   await ads.find({userId});
        AllAsks   =   await ads.find({userId});
        AllCommentsOnBooks   =   await CommentOnBook.find({userId});
        AllCommentsOnUsers   =   await CommentOnUser.find({customerId:userId});

        res.send({AllAds,AllAsks,AllCommentsOnBooks,AllCommentsOnUsers})
    }catch(err){
        console.log(err);
        res.status(500).send(err)
    }
}
