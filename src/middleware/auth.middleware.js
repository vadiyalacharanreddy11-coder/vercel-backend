import jwt from "jsonwebtoken";
import foodPartner from "../models/foodpartnermodel.js";
import userSchema from "../models/usermodel.js";


export const authFoodPartnerMiddleware = async (req,res,next)=>{

    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Please login first!!"});
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const foodpartner = await foodPartner.findById(decoded.id);

        if(!foodpartner){
            return res.status(401).json({message:"You are not a foodPartner"});
        }

        req.foodpartner=foodpartner;
        next();
        
    } catch (error) {
          return res.status(401).json({message:"Invalid token"});
    }
}

export const authUserMiddleware = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        res.status(401).json({message:"Login first Please!!"});
    }
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userSchema.findById(decoded.id);
    if(!user){
        res.status(401).json({message:"User not found"});
    }
    req.user = user
    next()

    } catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}