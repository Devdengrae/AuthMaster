const express=require('express');

const adminMiddleware=require('../middleware/admin-middleware');
const authMiddleware=require('../middleware/auth-middleware.js');

const router=express.Router();
router.get('/welcome',authMiddleware,adminMiddleware,(req,res)=>{
     res.status(200).json({
        success:true,
        message:`welcome to admin page`
     })
})
module.exports=router;