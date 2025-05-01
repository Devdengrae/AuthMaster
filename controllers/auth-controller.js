const User=require('../models/User.js');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
require('dotenv').config();
//registerUser
const registerUser = async (req, res) => {
    try {
      //extract user information from our request body
      const { username, email, password, role } = req.body;
  
      //check if the user is already exists in our database
      const checkExistingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (checkExistingUser) {
        return res.status(400).json({
          success: false,
          message:
            "User is already exists either with same username or same email. Please try with a different username or email",
        });
      }
  
      //hash user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      //create a new user and save in your database
      const newlyCreatedUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || "user",
      });
  
      await newlyCreatedUser.save();
  
      if (newlyCreatedUser) {
        res.status(201).json({
          success: true,
          message: "User registered successfully!",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Unable to register user! please try again.",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured! Please try again",
      });
    }
  };

//loginUser
const loginUser=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success: false,
                message:"Invalid Credentials",
            });
        }
        //check if Password is correct or not
        const comparePassword=await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(400).json({
                success: false,
                message:"Invalid Creds",
            })
        }
        console.log(process.env.JWT_SECRET_KEY);


        // create user token
    const accessToken = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role:user.role
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );
  
      res.status(200).json({
        success: true,
        message: "Logged in successful",
        accessToken,
      });
    }
     catch(err){
        res.status(500).json({
            success:false,
            message:'some error happened',
        });
     }
}

//change user password
const changePassword=async(req,res)=>{
  try{
  const userId=req.userInfo.userId;
  const { oldPassword, newPassword }=req.body;
  const user=await User.findById(userId);
  if(!user){
    return res.status(400).json({
      success:false,
      message:`user not found`,
    })
  }
  const isPasswordMatch=await bcrypt.compare(oldPassword,user.password);
  if(isPasswordMatch){
    return res.status(400).json({
      success:false,
      message:`password did not match`
  });
  }

  //hash the password

  const salt=await bcrypt.genSalt(10);
  const newHashedPassword=await bcrypt.hash(newPassword,salt);

  //update user password

  user.password=newHashedPassword;
  await user.save();

  res.status(200).json({
    success:true,
    message:`password saved successfully`
  })



}
catch(err){
  return res.status(500).json({
    success:false,
    message:`Something went wrong`,
  })
}
}

module.exports={registerUser,loginUser,changePassword};