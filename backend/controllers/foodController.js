import foodModel from '../models/foodModels.js'
import fs from 'fs'



const addFood = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded."
            });
        }

        // Log the file information to check
        console.log(req.file);

        // The uploaded image filename
        let image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });

        try {
            await food.save();
            // Send a success response and return to prevent further execution
            return res.json({
                success: true,
                message: "Food added successfully",
                file: image_filename
            });
        } catch (error) {
            console.log(error);
            // Send an error response and return
            return res.status(500).json({
                success: false,
                message: "Error saving food"
            });
        }

    } catch (error) {
        // Send an error response and return
        return res.status(500).json({
            message: "Error adding food",
            error
        });
    }
};



//all food list
const listFood = async(req,res) =>{

    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    }catch(error)
    {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
  
}


// remove food items
const removeFood = async (req,res) =>{

        try{
                //Find the item by id    
                const food = await foodModel.findById(req.body.id);

                //delete the item from folder
                fs.unlink(`uploads/${food.image}`,()=>{})

                //delete the items from DB
                await foodModel.findByIdAndDelete(req.body.id)

                res.json({success:true,message:"Food Removed"})
        }catch(error)
        {
            console.log(error);
            res.json({success:false,message:"Error"})
        }
}

export {
    addFood,listFood,removeFood
}