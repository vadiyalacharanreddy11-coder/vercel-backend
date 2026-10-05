import userSchema from "../models/usermodel.js";
import foodPartner from "../models/foodpartnermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";



export const register= async (req,res)=>{
    let {fullName,emailid,password}=req.body;
    const emailCheck = await userSchema.findOne({emailid});
    if(emailCheck){
        return res.status(400).json({message:"Emailid already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await userSchema.create({
        fullName,
        emailid,
        password:hashedPassword,
    })

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(201).json({message:"User Created Successfully",
        user:{
            _id:user._id,
            emailid:user.emailid,
            fullName:user.fullName,
        }
    })


}

export const login = async (req,res)=>{
    let {emailid,password}=req.body;
    let user = await userSchema.findOne({emailid});
    if(!user){
        return res.status(400).json({message:"EmailId doesn't exist!!"});
    }
    let isMAtched =await bcrypt.compare(password,user.password);
    if(!isMAtched){
        return res.status(400).json({message:"Incorrect Password!!"});
    }
    
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.cookie("token",token);
    
    res.status(201).json({message:"User Loggedin Successfully",
        user:{
            _id:user._id,
            emailid:user.emailid,
        }
    })
}

export const logout = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message:"Successfully Logged Out"});
}

export const registerFoodPartner =async (req,res)=>{
    let {businessname,contactname,phone,emailid,password,address,profilePic}=req.body;
    const emailCheck = await foodPartner.findOne({emailid});
    if(emailCheck){
        return res.status(400).json({message:"FoodPartner Emailid already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const foodpartner = await foodPartner.create({
        businessname,
        contactname,
        phone,
        emailid,
        password:hashedPassword,
        address,
        profilePic
    })

    const token = jwt.sign({id:foodpartner._id},process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(201).json({message:"FoodPartner Created Successfully",
        foodpartnerCurr:{
            _id:foodpartner._id,
            emailid:foodpartner.emailid,
            fullName:foodpartner.businessname,
        }
    })

}

export const loginFoodPartner = async (req,res)=>{
    let {emailid,password}=req.body;
    let foodpartner = await foodPartner.findOne({emailid});
    if(!foodpartner){
        return res.status(400).json({message:"EmailId doesn't exist!!"});
    }
    let isMAtched =await bcrypt.compare(password,foodpartner.password);
    if(!isMAtched){
        return res.status(400).json({message:"Incorrect Password!!"});
    }
    
    const token = jwt.sign({id:foodpartner._id},process.env.JWT_SECRET);
    res.cookie("token",token);
    
    res.status(201).json({message:"User Loggedin Successfully",
        foodpartnerCurr:{
            _id:foodpartner._id,
            emailid:foodpartner.emailid,
        }
    })
}

export const logoutFoodPartner = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message:"FoodPartner Successfully Logged Out"});
}