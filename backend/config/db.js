import mongoose from "mongoose"

export const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://naveenkishore65:8112@cluster0.fchz7.mongodb.net/food-delivery").then(()=>console.log("DB connected"));

}