const express=require("express");

const authRouter = express.Router();
const {validateSignupData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");


authRouter.post("/signup",async(req , res)=>{

   // const user = new User(req.body);
   // console.log(user);
    try{


     validateSignupData(req);

     const {firstName,lastName,emailId,password} = req.body;

     const passwordhash= await bcrypt.hashSync(password, 10);
     console.log(passwordhash);

      const user = new User({
         firstName,
         lastName,
         emailId,
         password: passwordhash
      });
      console.log(user);
      await user.save();
      res.send("user added successfully");
     }


      catch(err){
      res.status(400).send("something went wrong");
     }
      
});


authRouter.post("/login", async (req, res) => {
   try {
       const { emailId, password } = req.body;

       // Find user by email
       const user = await User.findOne({ emailId });
       if (!user) {
           return res.status(404).send({ error: "User not found" });
       }

       // Validate password
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if (isPasswordValid){

      //  create a jwt token
      
      const token = await jwt.sign({_id : user._id},"Dev@tinder");
      console.log(token);


      //  attach token to a cookie and send back to browser

        res.cookie("token", token);
        res.status(200).send(user);
       }
       else{
         return res.status(401).send({ error: "Invalid credentials" })
       }

       // Successful login response
       
   } catch (err) {
       console.error("Login Error:", err.message);
       res.status(500).send({ error: "Login failed", details: err.message });
   }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now() + 0), httpOnly: true });
    res.send("user is logged out");
});


module.exports=authRouter;