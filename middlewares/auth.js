const jwt = require('jsonwebtoken');


const auth = async (req,res,next)=>{
    try{

        const token = req.header('Authorization').replace('Bearer ', '' );
        console.log(token)
        const decoded = jwt.verify(token,'tokenKey'); // == return ID ==  //
        console.log(decoded);
        const user = await User.findOne({_id: decoded._id ,'tokens.token': token })
        
        if(!user){
            throw new Error();       
        }

        req.user = user ;
        req.token = token;
        next();
        
    }catch (error){
        console.log(error);
        res.status(401).send({ 'error' : 'please log in '});
    }
    
}
module.exports = auth