const express=require('express');
const router=express.Router();
const authmiddleware=require('../middleware/auth-middleware.js');

router.get('/welcome',authmiddleware,(req,res,next)=>{
    res.json({
        message:`Welcome to the home page`
    })
});

module.exports=router;