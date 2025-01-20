const express = require("express");

const requestRouter = express.Router();


// const connectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");




// requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

//     try{
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;

//       const allowedStatus = ["ignore","interested"];
//       if(!allowedStatus.includes(status)){
//        res.status(400).send("invalid status");
//       }

//       const toUser = await User.findById({
//         toUserId
//       });
//       if(!toUser){
//         res.status(400).send("user is not presented in db");
//       }


//       const existingConnectionRequest = await Connection.findOne({
//         $or: [
//             {fromUserId,toUserId},
//             {fromUserId:toUserId,toUserId:fromUserId}
//         ]
//       });

//       if(existingConnectionRequest){
//         res.status(400).send("invalid request");
//       }

      



//       const connection = new Connection({
//         fromUserId,
//         toUserId,
//         status,
//       });

    

//       const data = await connection.save();
//     //   res.json({
//     //     message: "connection request sent successfully",
//     //     data,
//     //   });
//     console.log(data);
//       res.send("sent the connection request");

//     }
//     catch(err){
//        res.status(400).send("something went wrong");
//     }



// });

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignore", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status. Please use 'ignore' or 'interested'.");
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).send("User not found in the database.");
        }

        const existingConnectionRequest = await Connection.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).send("Connection request already exists between these users.");
        }

        const connection = new Connection({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connection.save();

        res.json({
            message: "Connection request sent successfully",
            data: data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong, please try again later.");
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
       const loggedin = req.user;
       const {status,requestId} = req.params;

       const allowedStatus = ["accepted","rejected"];
       if(!allowedStatus.includes(status)){
         res.status(400).send("invalid status");
       }

       const connection =  await Connection.findOne({
        _id: requestId,
        toUserId: loggedin._id,
        status: "interested",
       });

       if(!connection){
        res.status(400).send("invalid connectionRequest");
       }

       connection.status = status;

       const data = await connection.save();
       res.json({
        message: "Connection accepted sent successfully",
        data: data,
       })
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});







module.exports = requestRouter;