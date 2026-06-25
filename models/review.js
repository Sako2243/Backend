import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Image",
      trim: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    type: {
      type: String,
      enum: ["review", "featured", "banner"],
      default: "review",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

gallerySchema.index({ type: 1 });

export default mongoose.model("Review", gallerySchema);