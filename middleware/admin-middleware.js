require('dotenv').config();


const adminMiddleware=(req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status(403).json({
            success: false,
            message:`Access denied ! Admin rights required` 
        })
    }
    console.log("Passed 2");
    next();
}
module.exports=adminMiddleware;