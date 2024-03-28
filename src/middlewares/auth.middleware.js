import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

// req & next is used but "res" is not used , we can just write "_" instead of "res"
export const verifyJWT = asyncHandler(async (req, _, next) => {
   try {
    const token = req.cookie?.accessToken || req.header("Authorozation")?.replace("Bearer ", "")
 
    if (!token) {
         throw new ApiError(401, "Unauthorized request")
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEM_SECRET)
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if (!user) {
         throw new ApiError(401, "Invalid Access Token")
    }
 
    req.user = user;
    next()
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
   }

})