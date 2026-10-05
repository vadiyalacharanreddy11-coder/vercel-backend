import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    emailid:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    }
},{timestamps:true});

const userSchema = mongoose.model("user",userschema);

export default userSchema;