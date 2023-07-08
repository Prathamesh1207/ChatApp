// chatName
// isGroupchat
// users
// latestmessage
// groupadmin
const mongoose=require('mongoose');

const chatmodel = mongoose.Schema({
    chatName:{type:String , trim: true},
    isGroupChat:{type:Boolean , default:false},
    users:[{                                        //array as singlechat have 2 user and groupchat have more tham 2
        type:mongoose.Schema.Types.ObjectId,        //contain id to that particular user
        ref:"User",                                 //user model,weare going to create
    },],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",//where message stored
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",       
    },

},{
    timestamps:true,
});

const Chat=mongoose.model("Chat",chatmodel);            //name , object that we are created

module.exports=Chat;