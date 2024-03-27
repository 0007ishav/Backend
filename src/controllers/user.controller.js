import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"   // For throwing errors
import { User } from "../models/user.models.js"   // For checking of the already exists user
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    /* Steps to register user
        1 - Get user details from frontend
        2 - Validation - Not empty
        3 - Check if user already exists: username, email
        4 - Check for images, check for avatar
        5 - Upload them to cloudinary, avatar checking
        6 - Create user object - create entry in DB
        7 - Remove password & refresh token field from response
        8 - Check for user creation
        9 - Return response
    */

    const {fullName, userName, email, password} = req.body
    console.log("FullName", fullName);
    console.log("Username: ", userName);
    console.log("Email: ", email);
    // console.log("Password: ", password);

    // if (fullName === "") {
    //     throw new ApiError(400, "Full name is required!")
    // }

    if (
        [fullName, email, userName, password].some((field) => 
        field?.trim() == "")    // This will check all values
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName } , { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // console.log(req.body);
    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    } else {
        
    }
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",  // Check for coverImage . if has then get the url , if not just let it empty
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"    // By default all field are selected
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}