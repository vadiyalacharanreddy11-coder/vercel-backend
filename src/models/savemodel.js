 
import mongoose from "mongoose";

const saveModel = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    fooditems:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodmodel",
        required:true,
    },
    
    
},{timestamps:true});

const saveSchema = mongoose.model("save",saveModel);
export default saveSchema;
 