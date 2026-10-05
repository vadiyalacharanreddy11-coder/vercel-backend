
import mongoose from "mongoose";

const savedListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    fooditems: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodmodel",
        required: true,
    },
}, { timestamps: true });

savedListSchema.index({ user: 1, fooditems: 1 }, { unique: true });

const SavedList = mongoose.model("savedlist", savedListSchema);
export default SavedList;
