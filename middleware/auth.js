import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";



/* ======================
   Generate JWT Token
====================== */
export const generateToken = (payload) => {

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }


  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );

};





/* ======================
   Protect Middleware
====================== */
export const protect = asyncHandler(async (req, res, next) => {


  const authHeader = req.headers.authorization;



  if (!authHeader || !authHeader.startsWith("Bearer ")) {

    return res.status(401).json({

      message:"No token provided"

    });

  }



  const token = authHeader.split(" ")[1];



  try {


    const decoded =
    jwt.verify(
      token,
      process.env.JWT_SECRET
    );



    req.user = {

      id: decoded.id,

      role: decoded.role,

    };



    next();



  } catch(error){


    return res.status(401).json({

      message:
      error.name === "TokenExpiredError"

      ? "Token expired"

      : "Invalid token"

    });


  }


});





/* ======================
   Role Authorization
====================== */
export const authorize = (...roles) => {


  return asyncHandler(async(req,res,next)=>{


    if(!req.user){


      return res.status(401).json({

        message:"Unauthorized"

      });


    }



    if(!roles.includes(req.user.role)){


      return res.status(403).json({

        message:"Access denied"

      });


    }



    next();


  });


};





/* ======================
   Super Admin Guard
====================== */
export const isSuperAdmin = asyncHandler(async(req,res,next)=>{


  if(
    !req.user ||
    req.user.role !== "super_admin"
  ){


    return res.status(403).json({

      message:"Super admin access required"

    });


  }



  next();


});