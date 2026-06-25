import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";

import Admin from "./models/admin.js";

import adminRoute from "./Route/adminRoute.js";
import productRoute from "./Route/productRoute.js";
import categoryRoute from "./Route/categoryRoute.js";
import reviewRoute from "./Route/reviewRoute.js";

const app = express();


// ======================
// MIDDLEWARES
// ======================

app.use(express.json());
app.use(helmet());
app.use(cors());


// ======================
// ROUTES
// ======================

app.use("/reviews", reviewRoute);

app.use("/admin", adminRoute);
app.use("/products", productRoute);
app.use("/categories", categoryRoute);


// ======================
// GLOBAL ERROR HANDLER
// ======================

app.use((err, req, res, next) => {

  console.error("🔥 ERROR:", err);

  res.status(500).json({
    message: err.message,
  });

});


// ======================
// DATABASE + SERVER START
// ======================

const PORT = process.env.PORT || 4000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("Mongo Connected");


    // Create Super Admin if not exists

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });


    if (!existingAdmin) {

      await Admin.create({

        name: "Super Admin",

        email: process.env.ADMIN_EMAIL,

        password: process.env.ADMIN_PASSWORD,

        role: "super_admin",

        isActive: true,

      });


      console.log("Super Admin created");

    }



    // Start server after DB connection

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);

    });


  })
  .catch((err) => {

    console.error("DB Connection Error:", err);

  });