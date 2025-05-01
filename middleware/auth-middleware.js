require('dotenv').config();
const jwt=require('jsonwebtoken');



const middleware=(req,res,next)=>{
    try{
        const authHeader=req.headers["authorization"];
        // console.log(authHeader);
        const accessToken=authHeader&&authHeader.split(" ")[1];
        console.log(accessToken)
        if(!accessToken){
            return res.status(401).json({
                success:false,
                message:`Access denied.No token provided`
            })
        }
        //DECODE THIS CODE  
        try{
            const decodedToken=jwt.verify(accessToken,process.env.JWT_SECRET_KEY);
            console.log(decodedToken);
            req.userInfo=decodedToken;
        }
        catch{
            return res.status(500).json({
                success:false,
                message:`Invalid Request`
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:`Error in processing the token`
        })
    }
}
module.exports=middleware;