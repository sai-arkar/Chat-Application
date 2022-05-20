const bcrypt = require("bcryptjs");

const User = require("../model/user");

exports.getIndex = (req, res, next)=>{
     res.render("index");
}

exports.getLogin = (req, res, next)=>{
     res.render("login");
}

exports.postSignUp = async (req, res, next)=>{
     const name = req.body.name;
     const email = req.body.email;
     const password = req.body.password;

     try{
          let user = await User.findOne({email: email});
              if(user){
                  const error = new Error("Email Already Exist!");
                  error.statusCode = 409;
                  throw error;
              }
          let hashedPassword = await bcrypt.hash(password, 12);
              const newUser = new User({
                  name: name,
                  email: email,
                  password: hashedPassword
              });
          let result = await newUser.save();
              //console.log(result);
              res.redirect("/login");
      }catch(err){
          if(!err.statusCode){
              err.statusCode = 500;
          }
          next(err);
      }
};

exports.postLogin = async (req, res, next)=>{
     const email = req.body.email;
     const password = req.body.password;
 
     try{
         let user = await User.findOne({email: email});
             if(!user){
                 const error = new Error("User Not Found");
                 error.statusCode = 404;
                 throw error;
             }
         let isEqual = await bcrypt.compare(password, user.password);
             if(!isEqual){
                 const error = new Error("Wrong Password");
                 error.statusCode = 401;
                 throw error;
             }
 
             req.session.user = user;
             await req.session.save();
 
             res.redirect("/msg/user");
     }catch(err){
         if(!err.statusCode){
             err.statusCode = 500;
         }
         next(err);
     }
 
 }