const express = require("express");

const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const Connection = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request/pending",userAuth,async(req,res)=>{
    
    try{
        const loggedin = req.user;
        const connection = await Connection.find({
        toUserId: loggedin._id,
        status: "interested",
        }).populate("fromUserId",["firstName","lastName"]);

        const data = connection;

        console.log(data);

       
        res.json({
            message: "data feteched successfully",
            data,
        });
    }
    catch(err){

        res.status(400).send("something went wrong");

    }
})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
       const loggedin = req.user;
       const connection = await Connection.find({
        $or:[
            {fromUserId: loggedin._id,status: "accepted"},
            {toUserId: loggedin._id,status: "accepted"}
        ]
       
    }).populate("fromUserId",["firstName","lastName"])

    const data = connection.map(row=>row.fromUserId);

    res.json({
        data
    });
}
    catch(err){
       res.status(400).send("something went wrong");
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
      const loggedin = req.user;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1)*limit;

      const connection = await Connection.find({
        $or: [
            {fromUserId:loggedin._id},
            {toUserId:loggedin._id}
        ]
      }).select("fromUserId toUserId");

      const hiddenfromFeed = new Set();
       connection.forEach((req)=>{
        hiddenfromFeed.add(req.fromUserId.toString());
        hiddenfromFeed.add(req.toUserId.toString());
       });

       const users = await User.find({
        $and:
         [{_id: { $nin: Array.from(hiddenfromFeed)}},
             {_id: {$ne: loggedin._id}}
            ],
       }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    //    console.log(connection);
    //    console.log(hiddenfromFeed);
      

      res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

module.exports = userRouter;