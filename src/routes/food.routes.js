import express from "express";
import { authFoodPartnerMiddleware, authUserMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";
import { createItem, deleteFoodItem, getSavedReels, handleLikes, handleSaves, userView } from "../controllers/food.controller.js";

const upload=multer({
    storage:multer.memoryStorage()
});

const foodRouter = express.Router();

// /api/food/ , middleware , createFood
foodRouter.post("/",authFoodPartnerMiddleware,upload.single("video"),createItem);
foodRouter.get("/",authUserMiddleware,userView);
// Save routes disabled:
// foodRouter.get("/saved", authUserMiddleware, getSavedReels);
// foodRouter.post("/save", authUserMiddleware, saveHandle);
foodRouter.post("/likes",authUserMiddleware,handleLikes);
foodRouter.post("/saves",authUserMiddleware,handleSaves);
foodRouter.get("/saved",authUserMiddleware,getSavedReels)
foodRouter.delete("/:id", authFoodPartnerMiddleware, deleteFoodItem);


export default foodRouter;
