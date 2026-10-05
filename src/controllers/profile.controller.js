import foodPartner from "../models/foodpartnermodel.js"
import foodModel from "../models/foodmodel.js"

export const fetchFoodPartnerProfile = async (req,res)=>{

    const partnerId = req.params.id;

    const partner = await foodPartner.findById(partnerId);
    if(!partner){
        return res.status(400).json({message:"Foodpartner not found"});
    }
    res.status(200).json({message:"Found the food partner", data: partner});

}
 
 export const getFoodItemsByPartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        const foodItems = await foodModel.find({
            foodpartner: partnerId
        });

        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};