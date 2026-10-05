import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
     businessname:{
        type:String,
        required:true
     },
     contactname:{
        type:String,
        required:true
     },
     phone:{
        type:Number,
        required:true
     },
     emailid:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true
     },
     address:{
        type:String,
        required:true
     },
     profilePic:{
        type:String,
        default:null
     },

},{timestamps:true});

const foodPartner = mongoose.model("foodpartner",foodPartnerSchema);

export default foodPartner;
