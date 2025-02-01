const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://devTinder:Sai1234@cluster0.asqjo.mongodb.net/devTinder");
    
    
};
    

// connectDB()
//     .then(() => {
//         console.log("database connection is connected");
//     })
//     .catch(() => {
//         console.log("database is not connected");
//     });


module.exports = connectDB;

