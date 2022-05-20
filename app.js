const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const URI = "mongodb+srv://root:root@cluster0.hl7kn.mongodb.net/ChatApplication?retryWrites=true&w=majority";

const User = require('./model/user');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const convRoutes = require("./routes/conversation");

const app = express();

const store = new MongoDBStore({
     uri: URI,
     collection: 'sessions'
   });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(
     session({
       secret: 'my secret',
       resave: false,
       saveUninitialized: false,
       store: store
     })
 );
 
 app.use((req, res, next) => {
     if (!req.session.user) {
         return next();
     }
     User.findById(req.session.user._id)
         .then(user => {
             if(!user){
                 return next();
             }
             //console.log("user", user);
             req.user = user;
             next();
         })
         .catch(err =>{
             next(new Error(err));
         });
 });

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(authRoutes);
app.use("/msg", userRoutes);
app.use("/conversation", convRoutes);

app.use((error, req, res, next)=>{
     // console.log(error);
     const status = error.statusCode || 500;
     const message = error.message;
     const data = error.data;
     res.status(status).json({message: message, data: data});
});

// Source For Socket.io
let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
};
  
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
  
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};


mongoose.connect(URI)
     .then(()=>{
          const server = app.listen(3000 || process.env.PORT);
          console.log("Connected!");
          const io = require("./socket").init(server);
          
          io.on("connection", (socket)=>{
              console.log("Client Connected!");

              // Take User'Id and socketId From User
              socket.on("addUser", (userId)=>{
                    addUser(userId, socket.id);
                    // console.log(users);
                    io.emit("getusers", users);
              });

              // Send and Get Message
              socket.on("sendMessage", ({ senderId, receiverId, text})=>{
                  const sender = getUser(senderId);
                  console.log("sender : ", sender);
                  const receiver = getUser(receiverId);
                  console.log("receiver : ", receiver);

                  io.to(receiver.socketId).to(sender.socketId).emit("getMessage", {
                      senderId,
                      text
                  })
              });

              socket.on("disconnect", ()=>{
                  console.log("A user disconnected!");
                  removeUser(socket.id);
              })
          })
          
     })
     .catch(err => console.log(err));