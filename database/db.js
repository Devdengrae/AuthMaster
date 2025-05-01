require('dotenv').config();
const mongoose=require("mongoose");
const connecttoDB=async()=>{
    try{
        await mongoose.connect(process.env.mongo_URL);
        console.log("DataBase is connected successfully");
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}
module.exports=connecttoDB;