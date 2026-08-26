import multer from "multer";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE =
  10 * 1024 * 1024; // 10 MB


const storage = multer.memoryStorage();


const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    !ALLOWED_MIME_TYPES.includes(
      file.mimetype
    )
  ) {
    return cb(
      new Error(
        "Formato de imagen no permitido"
      )
    );
  }

  cb(null, true);
};


export const uploadImage = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter,
});