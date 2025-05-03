require('dotenv').config();
const mongoose=require("mongoose");
const connecttoDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase is connected successfully");
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}
module.exports=connecttoDB;