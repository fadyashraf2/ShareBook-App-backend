const jwt = require('jsonwebtoken');


const adminAuth = async (req,res,next)=>{
    try{

        const token = req.header('Authorization').replace('Bearer ', '' );
        console.log(token)
        const decoded = jwt.verify(token,'tokenKey'); // == return ID ==  //
        console.log(decoded);
        const admin = await Admin.findOne({_id: decoded._id ,'tokens.token': token })
        
        if(!admin){
            throw new Error();       
        }

        req.admin = admin ;
        req.token = token;
        next();
        
    }catch (error){
        console.log(error);
        res.status(401).send({ 'error' : 'please log in '});
    }
    
}
module.exports = adminAuth