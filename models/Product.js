import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
     features: {
    type: [String],
    default: [],
  },

  isBest: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

// ================= INDEXES =================
productSchema.index({ name: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

export default mongoose.model("Product", productSchema);