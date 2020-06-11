const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;


InboxSchema = new Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:{
        type:String,
        required:true
    },
    

},{timestamps:true})

Inbox = mongoose.model('Inobx',InboxSchema); 


/* // for asking
AskForInboxSchema = new Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    askforId:{
        type:Schema.Types.ObjectId,
        ref:'ads',
        required:true
    },
    message:{
        type:String,
        required:true
    },
    dateOfSend:{
        type:Date,
        default:Date.now
    }

})

AskForInbox = mongoose.model('Inobx',InboxSchema); 
 */