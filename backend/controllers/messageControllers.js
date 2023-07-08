const asyncHandler =require("express-async-handler");
const Message=require("../models/messageModel"); 
const User = require("../models/userModel");
const { populate } = require("dotenv");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async(req,res)=>{
    //now we require user who logged in (acces through protect middleware) , user Id amd chat content
    const{content , chatId}=req.body;
    if(!content||!chatId){
        console.log("Invalid data passed into request")
        return res.sendStatus(400);
    }
    var newMessage={ //message schema
         sender:req.user._id,
         content:content,
         chat:chatId,
    };

    try {
        var message=await Message.create(newMessage);

        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email",
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message, //update the latest message
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const allMessages =asyncHandler(async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","name email pic").populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports={sendMessage,allMessages};