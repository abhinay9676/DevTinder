const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req , res ,next)  =>{

try{


    const {token} = req.cookies;
    const decodeobj = await jwt.verify(token,"Dev@tinder");

     const {_id}=decodeobj;

          console.log(_id);

          const user = await User.findById(_id);

          if(!user){
            res.send("user not found");
          }

           req.user = user;

          next();
    
}

catch(err){
   res.send("something went wrong");
}
}
     


module.exports={
    userAuth,
}