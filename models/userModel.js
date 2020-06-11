const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')






Schema = mongoose.Schema;

GovernorateSchema = new Schema({
    name:{
        type:String,
        enum:[
            'Aswan','Asyut','Alexandria' ,'Beheira' ,
            'Beni Suef','Cairo','Dakahlia' ,'Damietta' ,
            'Faiyum', 'Gharbia', 'Giza','Ismailia','Kafr El Sheikh',
            'Luxor' ,'Matruh','Minya', 'Monufia',
            'New Valley','North Sinai', 'Port Said', 
            'Qalyubia', 'Qena', 'Red Sea', 'Sharqia',
            'Sohag', 'South Sinai','Suez'
        ],
    }
    
})

Governorate = mongoose.model('Governorate',GovernorateSchema);
 



userSchema = new Schema({
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
    phone:{
        type:String,
        required:true,
        unique:true,
        validate:/^01[0-2]|[5]{1}[0-9]{8}/
    },
    img:{
        type:String,
        
    },
    avgRating:{
        type:Number,
        default:0
    },
    GovernorateId:{
        type: Schema.Types.ObjectId, 
        ref:'Governorate'
    },
    dateOfCreation:{
        type:Date,
        default:Date.now
    },
    tokens :[{
        token:{
            type:String,
            required:true
        }
        
    }]
    
    

},{timestamps:true})



//=================== for relation between users and ads ==================//
userSchema.virtual('ads',{
    ref:'ads',
    localField:'_id',
    foreignField:'userId'

})


//=================== for relation between users and comments on book ==================//
userSchema.virtual('CommentOnBook',{
    ref:'CommentOnBook',
    localField:'_id',
    foreignField:'userId'

})



//=================== for relation between users and comments ==================//
userSchema.virtual('CommentOnUser',{
    ref:'CommentOnUser',
    localField:'_id',
    foreignField:'userId'

})



//============= for tokens ===========================//
userSchema.methods.generateAuthToken = async function () {
    
    const user =this ;
    const token = await jwt.sign({_id: user._id.toString()},'tokenKey');

    user.tokens = await user.tokens.concat({token})
    await user.save(); 
    return token
}



//=============== for hash password ===============//
userSchema.pre('save',async function(next){
    const user =this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next();

})




//============== for login =======================///
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({ email }); 
    if(!user) {
        throw new Error('unable to login')
    }
          
    const isMatch = await bcrypt.compare( password ,user.password);
    
    if(!isMatch){
        throw new Error('unable to login ')
    }
    return user
    
}

User = mongoose.model('User',userSchema);

// insert govers array in DB 
/* ['Aswan','Asyut','Alexandria' ,'Beheira' ,
    'Beni Suef','Cairo','Dakahlia' ,'Damietta' ,
    'Faiyum', 'Gharbia', 'Giza','Ismailia','Kafr El Sheikh',
    'Luxor' ,'Matruh','Minya', 'Monufia',
    'New Valley','North Sinai', 'Port Said', 
    'Qalyubia', 'Qena', 'Red Sea', 'Sharqia',
    'Sohag', 'South Sinai','Suez'
].forEach(element => {
    g1 = new Governorate({name:element});
    g1.save()
});
 */




// console.log(g1._id);
/* u1.save().then(()=>{
    // console.log(u1);
}).catch((e)=>{
    console.log(e);
}) */

/* User.findOne({_id: '5d2cabb33575f63ad8f28549'}).populate('Governorate').exec(function(err, Governorate) {
    // console.log('User : ', User);
    console.log('Story creator', Governorate.name);
  }); */

  