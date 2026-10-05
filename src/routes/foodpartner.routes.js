import express from "express";
import { fetchFoodPartnerProfile, getFoodItemsByPartner } from "../controllers/profile.controller.js";
const profileRouter = express.Router();

profileRouter.get("/profile/:id",fetchFoodPartnerProfile);
profileRouter.get("/food-items/:id",getFoodItemsByPartner);



export default profileRouter;




