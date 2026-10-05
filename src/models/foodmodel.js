import mongoose from "mongoose";

const foodModelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    video:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
     foodpartner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodpartner",
    },
    likes:{
        type:Number,
        default:0,
    },
    saves:{
        type:Number,
        default:0,
    }
    
},{timestamps:true});

const foodModel = mongoose.model("foodmodel",foodModelSchema);

export default foodModel;