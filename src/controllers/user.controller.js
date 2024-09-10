import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import {User} from "../models/user.js" 
import { upload_cloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser=asyncHandler(async(req,res)=>{
    //step to register the user
    //get details from frontend
    //validation - not empty
    //check if user already exists: user , email 
    //check avatar and images as in it compulsory
    //take to the local server
    //upload to cloudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token filed from response
    //check for user creation
    //return res

    //step1
    const {fullName,email,username,password}=req.body
    console.log("email:",email)

    //step2
    if(
        //here we are check togther all field are empty or not (if empty then throw error)
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new ApiErrors(400,"All fields are Required")
    }

    //step3
   const existeduser= await User.findOne({
        $or:[{username},{email}]
    })
    if(existeduser){
        throw new ApiErrors(409,"user with email or username already exist")
    }

    //step 4
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiErrors(400,"Avatar file is required")
   }

   //step 5
   const avatar =await upload_cloudinary(avatarLocalPath)
   const coverImage=await upload_cloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiErrors(400,"Avatar file is required")
   }

   //step6
  const user= await User.create({
    fullName,
    avatar:avatar.url,
    //we have to check cover image exist or not because we have not check before
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })

   const createduser=await User.findById(user._id).select(
   //not want in response 
    "-password -refreshToken"
   )

   if(!createduser){
    throw new ApiErrors(500,"some thing wrong while registering user")
   }

   return res.status(201).json(
    new ApiResponse(200,createduser,"User registered Successfully")
   )
})

export {registerUser}