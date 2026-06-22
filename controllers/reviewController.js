import Review from "../models/review.js";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
/* =========================
   Helper: Upload to Cloudinary
========================= */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "reviews" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/* =========================
   Upload Review Image (ADMIN ONLY)
========================= */
export const uploadReview = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  const result = await uploadToCloudinary(req.file.buffer);

  const review = await Review.create({
    title: title || "Review Image",
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  });

  res.status(201).json({
    message: "Review uploaded successfully",
    review,
  });
});

/* =========================
   Get All Reviews (PUBLIC)
========================= */
export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.json({
    count: reviews.length,
    reviews,
  });
});

/* =========================
   Delete Review (ADMIN ONLY)
========================= */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      message: "Review not found",
    });
  }

  // delete from cloudinary
  await cloudinary.uploader.destroy(review.image.public_id);

  await Review.deleteOne({ _id: req.params.id });

  res.json({
    message: "Review deleted successfully",
  });
});