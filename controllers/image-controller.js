const Image=require('../models/image')
const {uploadToCloudinary}=require('../helpers/cloudinaryHelpers')
// const fs=require("fs")
const cloudinary = require("../config/cloudinary");
const uploadImageController=async(req,res)=>{
    try{
        if(!req.file){
            res.status(400).json({
                success:false,
                message:`file is required`,
            })
        }

        //upload to cloudinary
        const {url,publicId}=await uploadToCloudinary(req.file.path)

        //store the image url and public id along with uploaded user id in DB
        const newlyUploadImage=new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId,
        })
        await newlyUploadImage.save();

        // if we want to remove this image from the local storage
        // fs.unlinkSync(req.file.path);
        res.status(201).json({
            success:true,
            message:`Image uploaded successfully`,
            image: newlyUploadImage,
        });
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message: `Something went wrong! Please try again`
        })
    }
}

const fetchImageController=async(req,res)=>{
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||5;
    const skip=(page-1)*limit;

    const sortBy=req.query.sortBy||"createdAt";
    const sortOrder=req.query.sortOrder==='asc'?1:-1;

    const totalImages=await Image.countDocuments();
    const totalPages=Math.ceil(totalImages/limit);

    const sortObj={};
    sortObj[sortBy]=sortOrder;

    const images=await Image.find().sort(sortObj).skip(skip).limit(limit);
    
    if(images){
        return res.status(200).json({
            success:true,
            currentPage:page,
            totalPages:totalPages,
            totalImages:totalImages,
            data:images,
        })
    }
}

const deleteImageController=async(req,res)=>{
    try{
        const imageid=req.params.id;
        const userId=req.userInfo.userId;
        const image=await Image.findById(imageid);
        if(!image){
            return res.status(404).json({
                success:false,
                message:`Image not found`
            });
        }
        if(image.uploadedBy.toString()!==userId){
            return res.status(403).json({
                success:false,
                message:`You are not authorized to delete this`,
            });
        }
        await cloudinary.uploader.destroy(image.publicId);
        await Image.findByIdAndDelete(imageid);

        res.status(200).json({
            success:true,
            message:`Image deleted successfully`
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:`Something went wrong`
        })
    }
}
module.exports={
    uploadImageController,
    fetchImageController,
    deleteImageController
}