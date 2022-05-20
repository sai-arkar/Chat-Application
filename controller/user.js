const User = require("../model/user");
const Conversation = require("../model/conversation");


exports.getUsers = async (req, res, next)=>{
     try{
          let allUsers = await User.find();
          let otherUsers = allUsers.filter((user)=> user._id.toString() != req.user._id.toString());

          // let conv = await Conversation.find();
          // console.log(conv);
          console.log("Get User Success");
          res.render("user", {
               loginUser : req.user,
               otherUsers: otherUsers
          });

     }catch(err){
          if(!err.statusCode){
               err.statusCode = 500;
          }
          next(err);
     }
}