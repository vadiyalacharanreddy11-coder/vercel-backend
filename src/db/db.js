import mongoose from "mongoose";


const createDb=()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Mongodb Connected");
    })
    .catch((err)=>{
        console.log(err.message);
    })
};

export default createDb;