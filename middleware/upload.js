import multer from "multer";

// نخزن الصورة في الذاكرة (RAM) مش على الهارد
// عشان نبعتهـا مباشرة لـ Cloudinary
const storage = multer.memoryStorage();

// نسمح بالصور فقط
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("يرجى رفع صورة فقط"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
