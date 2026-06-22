import { asyncHandler } from "../middleware/asyncHandler.js";
import Category from "../models/Category.js";



/* ======================
   CREATE CATEGORY
====================== */
export const createCategory = asyncHandler(async (req, res) => {

  const { name } = req.body;


  if (!name || name.trim() === "") {

    return res.status(400).json({
      message: "Name is required"
    });

  }



  const existing = await Category.findOne({

    name: {
      $regex: `^${name}$`,
      $options: "i"
    }

  });



  if (existing) {

    return res.status(400).json({
      message: "Category already exists"
    });

  }



  const category = await Category.create({

    name: name.trim()

  });



  res.status(201).json(category);

});





/* ======================
   GET ALL CATEGORIES
====================== */
export const getCategories = asyncHandler(async (req, res) => {


  const categories = await Category.find({

    isDeleted:false

  }).sort({

    createdAt:-1

  });



  res.json(categories);


});





/* ======================
   UPDATE CATEGORY
====================== */
export const updateCategory = asyncHandler(async (req,res)=>{


  const { name } = req.body;



  const category =
  await Category.findById(req.params.id);



  if(!category || category.isDeleted){

    return res.status(404).json({

      message:"Category not found"

    });

  }



  if(!name || name.trim()===""){

    return res.status(400).json({

      message:"Name is required"

    });

  }





  const existing =
  await Category.findOne({

    _id:{
      $ne:req.params.id
    },


    name:{
      $regex:`^${name}$`,
      $options:"i"
    }


  });




  if(existing){

    return res.status(400).json({

      message:"Category already exists"

    });

  }





  category.name =
  name.trim();



  await category.save();




  res.json({

    message:"Category updated successfully",

    category

  });


});





/* ======================
   DELETE CATEGORY (SOFT)
====================== */
export const deleteCategory = asyncHandler(async(req,res)=>{


  const category =
  await Category.findById(req.params.id);



  if(!category || category.isDeleted){


    return res.status(404).json({

      message:"Category not found"

    });


  }



  category.isDeleted = true;



  await category.save();




  res.json({

    message:"Category deleted successfully"

  });



});





/* ======================
   RESTORE CATEGORY
====================== */
export const restoreCategory = asyncHandler(async(req,res)=>{


  const category =
  await Category.findById(req.params.id);



  if(!category){


    return res.status(404).json({

      message:"Category not found"

    });


  }




  if(!category.isDeleted){


    return res.status(400).json({

      message:"Category already active"

    });


  }




  category.isDeleted=false;



  await category.save();




  res.json({

    message:"Category restored successfully"

  });



});
/* ======================
   HARD DELETE CATEGORY
====================== */
export const hardDeleteCategory = asyncHandler(async (req, res) => {


  const category =
  await Category.findById(req.params.id);



  if(!category){

    return res.status(404).json({

      message:"Category not found"

    });

  }



  await Category.deleteOne({

    _id:req.params.id

  });



  res.json({

    message:"Category permanently deleted"

  });


});