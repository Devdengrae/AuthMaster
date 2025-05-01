const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
        username:{
            type: String,
            required:true,
            trim:true,
            unique:true
        },
        email:{
            type:String,
            unique:true,
            requires:true,
            lowercase:true
        },
        password:{
            type: String,
            required:true
        },
        role:{
            type:String,
            enum: ['user','admin'],// only allow user or admins
            default:'user'
        }

},{Timestamps:true} )

module.exports=mongoose.model('User',UserSchema);