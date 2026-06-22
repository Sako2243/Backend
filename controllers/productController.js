import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../middleware/asyncHandler.js";


// =====================================
// Helper: Upload buffer to Cloudinary
// =====================================
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },

      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};



// =====================================
// Create Product
// =====================================
export const createProduct = asyncHandler(async (req, res) => {

  const {
    name,
    description,
    price,
    discount = 0,
    stock = 0,
    category,
    brand,
    features,
    isBest,

  } = req.body;



  const categoryExist =
    await Category.findById(category);



  if (!categoryExist || categoryExist.isDeleted) {

    return res.status(400).json({

      message:"Invalid category"

    });

  }



  if (!req.files || req.files.length === 0) {

    return res.status(400).json({

      message:"Product images are required"

    });

  }



  const images = [];


  for (const file of req.files) {


    const result =
    await uploadToCloudinary(file.buffer);



    images.push({

      url: result.secure_url,

      public_id: result.public_id,

    });

  }




  const finalPrice =
  Number(price) -
  (Number(price) * Number(discount)) / 100;




  const slug =
  slugify(name || "",{

    lower:true,

    strict:true,

  });




  const product = await Product.create({

    name,

    slug,

    description,

    price:Number(price),

    discount:Number(discount),

    finalPrice,

    stock:Number(stock),

    category,

    brand,

    images,


    features:
    features
    ? JSON.parse(features)
    : [],



    isBest:
    isBest === "true" ||
    isBest === true,

  });



  res.status(201).json({

    message:"Product created successfully",

    product,

  });


});




// =====================================
// Get All Products
// =====================================
export const getProducts = asyncHandler(async(req,res)=>{


const {

page=1,

limit=10,

keyword,

category,

minPrice,

maxPrice

}=req.query;



const filter = {

isDeleted:false

};



if(keyword){

filter.name={

$regex:keyword,

$options:"i"

};

}



if(category)

filter.category = category;




if(minPrice || maxPrice){


filter.finalPrice={};



if(minPrice)

filter.finalPrice.$gte =
Number(minPrice);



if(maxPrice)

filter.finalPrice.$lte =
Number(maxPrice);


}





const products =
await Product.find(filter)


.populate(
"category",
"name"
)


.limit(Number(limit))


.skip(
(page-1)*limit
)


.sort({

createdAt:-1

});




const total =
await Product.countDocuments(filter);



res.json({

total,

page:Number(page),

pages:
Math.ceil(total / limit),


products

});


});




// =====================================
// Get Single Product
// =====================================
export const getProductById =
asyncHandler(async(req,res)=>{


const product =
await Product.findOne({

_id:req.params.id,

isDeleted:false

})

.populate(
"category",
"name"
);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



res.json(product);


});




// =====================================
// Update Product
// =====================================
export const updateProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product || product.isDeleted){


return res.status(404).json({

message:"Product not found"

});


}




const {

name,

description,

price,

discount,

stock,

category,

brand,

features,

isBest

}=req.body;




if(price !== undefined || discount !== undefined){


const newPrice =
Number(price ?? product.price);



const newDiscount =
Number(discount ?? product.discount);



product.finalPrice =
newPrice -
(newPrice * newDiscount) / 100;


}




if(name){


product.slug =
slugify(name,{

lower:true,

strict:true

});


}




product.name =
name ?? product.name;


product.description =
description ?? product.description;


product.price =
price ?? product.price;


product.discount =
discount ?? product.discount;


product.stock =
stock ?? product.stock;


product.category =
category ?? product.category;



product.brand =
brand ?? product.brand;





if (features) {
  product.features = features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}




if(isBest !== undefined){

product.isBest =
isBest === "true" ||
isBest === true;

}





if(req.files && req.files.length > 0){



for(const img of product.images){

await cloudinary.uploader.destroy(
img.public_id
);

}



const images=[];



for(const file of req.files){


const result =
await uploadToCloudinary(file.buffer);



images.push({

url:result.secure_url,

public_id:result.public_id

});


}



product.images = images;


}





await product.save();



res.json({

message:"Product updated successfully",

product

});


});




// =====================================
// Soft Delete
// =====================================
export const deleteProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product || product.isDeleted){


return res.status(404).json({

message:"Product not found"

});


}




product.isDeleted=true;



await product.save();



res.json({

message:"Product deleted successfully"

});


});




// =====================================
// Restore
// =====================================
export const restoreProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



product.isDeleted=false;



await product.save();



res.json({

message:"Product restored successfully",

product

});


});




// =====================================
// Hard Delete
// =====================================
export const hardDeleteProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



for(const img of product.images){


await cloudinary.uploader.destroy(
img.public_id
);


}



await Product.deleteOne({

_id:req.params.id

});



res.json({

message:"Product permanently deleted"

});


});