const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhinay:Abhi1234@namsteenode.4xusv.mongodb.net/devTinder");
    
};

    

// connectDB()
//     .then(() => {
//         console.log("database connection is connected");
//     })
//     .catch(() => {
//         console.log("database is not connected");
//     });


module.exports = connectDB;

