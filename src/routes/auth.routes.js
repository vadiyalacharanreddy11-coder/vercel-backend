import express from "express";
import { login, loginFoodPartner, logout, register, registerFoodPartner } from "../controllers/auth.controller.js";

const authrouter = express.Router();

//User Routes
authrouter.post("/user/register",register);
authrouter.post("/user/login",login)
authrouter.get("/user/logout",logout);
authrouter.get("/me", async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(200).json({ user: null, foodpartner: null });
        }

        const jwt = (await import("jsonwebtoken")).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userSchema = (await import("../models/usermodel.js")).default;
        const foodPartnerSchema = (await import("../models/foodpartnermodel.js")).default;

        const user = await userSchema.findById(decoded.id);
        const foodpartner = await foodPartnerSchema.findById(decoded.id);

        return res.status(200).json({
            user: user ? { _id: user._id, emailid: user.emailid, fullName: user.fullName } : null,
            foodpartner: foodpartner ? { _id: foodpartner._id, emailid: foodpartner.emailid, businessname: foodpartner.businessname } : null,
        });
    } catch (error) {
        return res.status(200).json({ user: null, foodpartner: null });
    }
});

//FoodPartner Routes
authrouter.post("/foodpartner/register",registerFoodPartner);
authrouter.post("/foodpartner/login",loginFoodPartner);
authrouter.get("/foodpartner/logout",logout);



export default authrouter;