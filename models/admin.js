import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const adminSchema = new mongoose.Schema(

{
  name: {

    type: String,

    required: true,

    trim: true,

  },


  email: {

    type: String,

    required: true,

    unique: true,

    lowercase: true,

    trim: true,

  },


  password: {

    type: String,

    required: true,

    select: false,

  },


  role: {

    type: String,

    enum: [
      "super_admin",
      "admin"
    ],

    default: "admin",

  },


  isActive: {

    type: Boolean,

    default: true,

  },


  // ==========================
  // RESET PASSWORD
  // ==========================

  resetPasswordToken: {

    type: String,

    default: null,

  },


  resetPasswordExpire: {

    type: Date,

    default: null,

  },


  // ==========================
  // LOGIN SECURITY
  // ==========================

  loginAttempts: {

    type: Number,

    default: 0,

  },


  lockUntil: {

    type: Date,

    default: null,

  },


},


{

timestamps:true

}

);





// ==========================
// HASH PASSWORD
// ==========================
adminSchema.pre("save", async function(){


if(!this.isModified("password"))

return;



this.password =
await bcrypt.hash(
this.password,
12
);


});






// ==========================
// COMPARE PASSWORD
// ==========================
adminSchema.methods.comparePassword =
async function(password){


return await bcrypt.compare(

password,

this.password

);


};






// ==========================
// LOGIN SECURITY
// ==========================
adminSchema.methods.incLoginAttempts =
function(){


this.loginAttempts += 1;



if(this.loginAttempts >= 5){


this.lockUntil =
new Date(
Date.now() + 15 * 60 * 1000
);


}


};





adminSchema.methods.resetLoginAttempts =
function(){


this.loginAttempts = 0;

this.lockUntil = null;


};





export default mongoose.model(
"Admin",
adminSchema
);