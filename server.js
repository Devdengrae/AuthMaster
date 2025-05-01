require('dotenv').config();
const express=require("express");
const connecttoDB=require('./database/db.js');
const authRouter=require('./routes/auth-routes.js')
const homeRouter=require('./routes/home-routes.js')
const adminRouter=require('./routes/admin-routes.js')
const uploadImageRoutes=require("./routes/image-routes.js")


//connect to database
connecttoDB();


const app=express();
const PORT=process.env.PORT||3000;

app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/home',homeRouter);
app.use('/api/admin',adminRouter);
app.use('/api/images',uploadImageRoutes);  


app.listen(PORT,()=>{
    console.log(`The server is listening at port ${PORT}`)
})