import foodModel from "../models/foodmodel.js";
import { uploadFun } from "../services/storage.services.js";
import { v4 as uuid } from "uuid";
import foodPartner from "../models/foodpartnermodel.js";
import likeSchema from "../models/likemodel.js";
import saveSchema from "../models/savemodel.js";
import savedListSchema from "../models/savedlistmodel.js";


// ✅ CREATE FOOD ITEM (upload + save in DB)
export const createItem = async (req, res) => {
  try {
    

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

   
    const fileBase64 = req.file.buffer.toString("base64");

 
    const uploadResult = await uploadFun(fileBase64, uuid());

    
    const newFood = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: uploadResult.url,
      foodpartner: req.foodpartner || null, // if using auth middleware
    });

    res.status(201).json({
      message: "Food item created successfully",
      data: newFood,
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};


// ✅ GET ALL FOOD ITEMS
export const userView = async (req, res) => {
  try {
    const [foodItems, likeStats] = await Promise.all([
      foodModel.find({}).lean(),
      likeSchema.aggregate([
        {
          $group: {
            _id: { fooditems: "$fooditems", user: "$user" },
            likedByCurrentUser: {
              $max: { $cond: [{ $eq: ["$user", req.user._id] }, 1, 0] },
            },
          },
        },
        {
          $group: {
            _id: "$_id.fooditems",
            likes: { $sum: 1 },
            likedByCurrentUser: { $max: "$likedByCurrentUser" },
          },
        },
      ]),
    ]);

    const likesByFoodId = new Map(
      likeStats.map((stats) => [stats._id.toString(), stats])
    );
    const foodItemsWithLikes = foodItems.map((item) => {
      const stats = likesByFoodId.get(item._id.toString());
      return {
        ...item,
        likes: stats?.likes ?? 0,
        likedByCurrentUser: Boolean(stats?.likedByCurrentUser),
      };
    });

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: foodItemsWithLikes,
    });

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

/* Save feature disabled. The previous getSavedReels and saveHandle implementations
   are intentionally kept out of the active backend. */

export const handleLikes = async (req, res) => {
  try {
    const { foodId, liked } = req.body;
    const userId = req.user._id;

    if (!foodId || typeof liked !== "boolean") {
      return res.status(400).json({ message: "foodId and liked are required" });
    }

    const foodItem = await foodModel.findById(foodId).select("_id");
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (liked) {
      await likeSchema.updateOne(
        { user: userId, fooditems: foodId },
        { $setOnInsert: { user: userId, fooditems: foodId } },
        { upsert: true }
      );
    } else {
      await likeSchema.deleteMany({ user: userId, fooditems: foodId });
    }

    const uniqueUsersWhoLiked = await likeSchema.distinct("user", {
      fooditems: foodId,
    });

    return res.json({
      message: liked ? "Liked" : "Unliked",
      currLikeCount: uniqueUsersWhoLiked.length,
      currLiked: liked,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);
    return res.status(500).json({ message: "Unable to update like" });
  }
};

export const handleSaves = async (req, res) => {
  const { foodId } = req.body;
  const userId = req.user._id;

  try {
    const isAlreadySaved = await savedListSchema.findOne({
      user: userId,
      fooditems: foodId,
    });

    const currentFood = await foodModel.findById(foodId);
    const currentSaveCount = Number(currentFood?.saves || 0);

    if (isAlreadySaved) {
      await savedListSchema.deleteOne({
        user: userId,
        fooditems: foodId,
      });

      const updatedSaveCount = Math.max(0, currentSaveCount - 1);
      await foodModel.findByIdAndUpdate(foodId, {
        saves: updatedSaveCount,
      });

      return res.json({
        message: "Unsaved",
        currSaveCount: updatedSaveCount,
        currSaved: 0,
      });
    }

    await savedListSchema.create({
      user: userId,
      fooditems: foodId,
    });

    const updatedSaveCount = currentSaveCount + 1;
    await foodModel.findByIdAndUpdate(foodId, {
      saves: updatedSaveCount,
    });

    return res.json({
      message: "Saved",
      currSaveCount: updatedSaveCount,
      currSaved: 1,
    });
  } catch (error) {
    console.log("SAVE ERROR:", error.message);
    return res.status(500).json({ message: "Unable to update saved status" });
  }
};

export const getSavedReels = async (req, res) => {
  try {
    const userId = req.user._id;

    const saved = await savedListSchema.find({ user: userId }).populate("fooditems");
    const savedItems = saved
      .map((entry) => entry.fooditems)
      .filter(Boolean);

    return res.status(200).json({
      savedItems,
    });
  } catch (error) {
    console.log("GET SAVED ERROR:", error.message);
    return res.status(500).json({
      message: "Unable to fetch saved reels",
    });
  }
};

export const deleteFoodItem = async (req, res) => {
  try {
    const foodId = req.params.id;
    const partnerId = req.foodpartner?._id?.toString();

    const foodItem = await foodModel.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (partnerId && foodItem.foodpartner?.toString() !== partnerId) {
      return res.status(403).json({ message: "You can only delete your own food items" });
    }

    await likeSchema.deleteMany({ fooditems: foodId });
    await savedListSchema.deleteMany({ fooditems: foodId });
    await saveSchema.deleteMany({ fooditems: foodId });
    await foodModel.findByIdAndDelete(foodId);

    return res.status(200).json({
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.log("DELETE FOOD ERROR:", error.message);
    return res.status(500).json({ message: "Unable to delete food item" });
  }
};