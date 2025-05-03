const express=require('express');
const {registerUser,loginUser,changePassword}=require('../controllers/auth-controller.js');
const authMiddleware=require("../middleware/auth-middleware.js")
const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/changePassword",authMiddleware,changePassword);
// router.get('/',getUser);

module.exports=router;
