const Conversation = require("../model/conversation");
const Message = require("../model/message");
const User = require("../model/user");

exports.getConv = async (req, res, next)=>{
     const receiverId = req.params.rId;
     const senderId = req.user._id;

     console.log(senderId, receiverId);

     try{
          let receiver = await User.findById(receiverId);
          let allConversation = await Conversation.find();
          let conversation = allConversation.find((conv)=> (senderId.toString() === conv.senderId.toString() || conv.receiverId.toString()) && (receiverId.toString() === conv.senderId.toString() || conv.receiverId.toString()));;

          //console.log("Conversation : ", conversation);

          let messages = await Message.find({conversationId : conversation._id});
          
          console.log(messages);

          res.render("chat", {
               loginUser: req.user,
               receiver: receiver,
               messages: messages
          })
     }catch(err){
          if(!err){
               err.statusCode = 500;
          }
          next(err);
     }
     
}

exports.postChat = async (req, res, next)=>{
     const senderId = req.user._id;
     const receiverId = req.body.receiverId;
     const text = req.body.text;

     //console.log("Server : ", senderId, receiverId, text);
     
     let conversation;

     try{
          let allConversation = await Conversation.find();
          
          let result = allConversation.find((conv) => (senderId.toString() === conv.senderId.toString() || senderId.toString() === conv.receiverId.toString() ) && ( receiverId.toString() === conv.senderId.toString() || receiverId.toString() === conv.receiverId.toString() ) );

          if(result === undefined){
               const newConv = new Conversation({
                    senderId: senderId,
                    receiverId: receiverId
               });

               conversation = await newConv.save();
               console.log("Create New Conversation");
          }

          //console.log("_id", result? result._id : conversation._id);

          const msg = new Message({
               conversationId: result? result._id : conversation._id,
               sender: senderId,
               text: text
          });
          await msg.save();
          //console.log("Add new message");
          res.status(201).json({message: "Post Chat"});

          //console.log(msgResult);
          // res.redirect(`/conversation/new-conv/${receiverId}`);
     }catch(err){
          console.log(err);
          // if(!err.statusCode){
          //      err.statusCode = 500;
          // }
          // next(err);
     }
}

exports.newConv = async (req, res, next)=>{
     const senderId = req.user._id;
     const receiverId = req.body.receiverId;

     let conversation;
     try{
          let receiver = await User.findById(receiverId);
          let allConversation = await Conversation.find();
          
          let result = allConversation.find((conv) => (senderId.toString() === conv.senderId.toString() || senderId.toString() === conv.receiverId.toString() ) && ( receiverId.toString() === conv.senderId.toString() || receiverId.toString() === conv.receiverId.toString() ) );

          // console.log("conversation ", result);

          if(result === undefined){
               const newConv = new Conversation({
                    senderId: senderId,
                    receiverId: receiverId
               });

               conversation = await newConv.save();
               console.log("Create New Conversation");
          }
          console.log("conversation ", conversation || result);
          res.render("chat", {
               loginUser: req.user,
               receiver: receiver,
               conversation: conversation || result
          });
     }catch(err){
          if(!err){
               err.statusCode = 500;
          }
          next(err);
     }

}
