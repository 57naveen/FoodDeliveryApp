import foodModel from '../models/foodModels.js'
import fs from 'fs'



// add food item
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
        })

        try {

            await food.save();
            res.json({
                success: true,
                message: "food Added"
            })
        } catch (error) {
            console.log(error)
            res.json({
                success: false,
                message: "error"
            })
        }

        // Further processing of the request (e.g., saving food data to the database)
        res.status(200).json({
            message: "Food added successfully",
            file: image_filename
        });
    } catch (error) {
        res.status(500).json({
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