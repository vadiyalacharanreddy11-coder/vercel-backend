import mongoose from "mongoose";

const likeModel = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    fooditems:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodmodel",
        required:true,
    }
},{timeStamps:true});

const likeSchema = mongoose.model("likemodel",likeModel);
export default likeSchema;