const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')








AdminSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        lowercase: true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error('email not valid') ;
            }
        }
        
    },
    password:{
        type:String,
        required:true,
    },
    
    tokens :[{
        token:{
            type:String,
            required:true
        }
        
    }]
    
    

},{timestamps:true})





//============= for tokens ===========================//
AdminSchema.methods.generateAuthToken = async function () {
    
    const admin =this ;
    const token = await jwt.sign({_id: admin._id.toString()},'tokenKey');

    admin.tokens = await admin.tokens.concat({token})
    await admin.save(); 
    return token
}



//=============== for hash password ===============//
AdminSchema.pre('save',async function(next){
    const admin =this 
    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password,8)
    }
    next();

})




//============== for login =======================///
AdminSchema.statics.findByCredentials = async(email,password)=>{
    const admin = await Admin.findOne({ email }); 
    if(!admin) {
        throw new Error('unable to login')
    }
          
    const isMatch = await bcrypt.compare( password ,admin.password);
    
    if(!isMatch){
        throw new Error('unable to login ')
    }
    return admin
    
}

Admin = mongoose.model('Admin',AdminSchema);
