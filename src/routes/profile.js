const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfile} = require("../utils/validation");

profileRouter.get("/profile", userAuth,async (req, res) => {
    try {
        const user = req.user;
 
 
       res.send(user);
    } catch (error) {
        
        res.status(401).json({ error: "Invalid or expired token" });
    }
 });

 profileRouter.patch("/profile/edit", userAuth,async (req , res)=>{
   try{
    if(!validateEditProfile(req)){
        throw new Error("somethin wenr wrong");
   }
    const loggedin = req.user;
    console.log(loggedin);

    Object.keys(req.body).forEach((key)=>(loggedin[key]=req.body[key]));
    console.log(loggedin);

    await loggedin.save();

    res.send('upadated successfully');
}
   catch(err){
     res.send("something went wrong");
   }


    const user = req.user;
    
 });

 profileRouter.patch("/profile/edit/password", userAuth,async (req , res)=>{

 });
 

module.exports = profileRouter;