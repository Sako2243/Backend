import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);


// generate slug automatically
categorySchema.pre("save", function () {

  if (this.isModified("name")) {

    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });

  }

});


// unique name
categorySchema.index(
  { name: 1 },
  { 
    unique: true,
    collation: {
      locale: "en",
      strength: 2
    }
  }
);


// search
categorySchema.index({
  name:"text"
});


export default mongoose.model(
  "Category",
  categorySchema
);