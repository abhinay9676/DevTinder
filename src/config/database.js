const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    
    
};
    

// connectDB()
//     .then(() => {
//         console.log("database connection is connected");
//     })
//     .catch(() => {
//         console.log("database is not connected");
//     });


module.exports = connectDB;

