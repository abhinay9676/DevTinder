const express = require("express");
const app = express();
const connectDB=require("./config/database");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter=require("./routes/requests");
const userRouter = require("./routes/user");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
   .then(() => {
   console.log("database connection is connected");
   app.listen(3000, ()=> {
      console.log('app is ruuning on server 3000');
   });
})
.catch((err)=>{
   console.log("database is not connected");
});

