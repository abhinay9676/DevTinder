const express = require("express");

const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const Connection = require("../models/connectionRequest");
const User = require("../models/user");

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

module.exports = userRouter;