const express= require("express");
const dotenv= require("dotenv");
const {chats} = require("./data/data");
const connectDB = require("./config/db");
const userRoutes= require("./routes/userRoutes");
const chatRoutes= require("./routes/chatRoutes");
const messageRoutes =require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


const app=express();
dotenv.config();
connectDB();

app.use(express.json()); //tell server to accept the json data

app.get("/",(req,res)=>{
    res.send("hello");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat",(req,res)=>{
//     res.send(chats);
// });

// app.get("/api/chat/:id",(req,res)=>{
//     const singleChat= chats.find((c)=>c._id=req.params.id);
//     res.send(singleChat);
// })

const PORT=process.env.PORT || 5000


// app.listen(PORT,console.log(`Server started on PORT ${PORT}`));


//socket io implementation for server side
const server = app.listen(PORT,console.log(`Server started on PORT ${PORT}`));

const io=require("socket.io")(server,{
    pingTimeout:60000, //remain active till 60s
    cors:{
        origin:"http://localhost:3000",
    },
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat",(room)=>{ 
        socket.join(room);
        console.log("user joined room: " + room);
    });

    //for typing indicator
    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


    socket.on("new message",(newMessageReceived)=>{
        var chat =newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received",newMessageReceived);
        })
    })

    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })



})