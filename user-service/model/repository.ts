/*
//Set up mongoose connection
//import mongoose from "mongoose";
//import UserModel from "./user-model";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;



//Import dotenv
import "dotenv/config";

//let db = mongoose.connection;
//db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createUser(params) {
  return new UserModel(params);
}
*/
