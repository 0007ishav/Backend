// require('dotenv').config({path: './env'})
import dotenv from "dotenv"

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants"
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path: './.env'
})

/*  DB connection approach 1
import express from "express"
const app = express()
;(async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)        
        app.on("error", () => {
            console.log("Error", error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}` );
        })
    } catch (error) {
        console.log("ERROR", error);
        throw err
    }
})()
*/

// DB connection approach 2 is writing db connection in diff. file

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening at port: ${process.env.PORT}`);
    })
})
.then(() => {
    app.on("error", () => {
        console.log("Error", error);
        throw error
    })
})
.catch((err) => {
    console.log("Mongo DB connecton failed !!", err);
})