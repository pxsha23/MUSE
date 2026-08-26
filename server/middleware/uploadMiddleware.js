import multer from 'multer';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    ALLOWED_IMAGE_TYPES.includes(file.mimetype) ||
    ALLOWED_VIDEO_TYPES.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Use JPG/PNG/WEBP images or MP4/MOV video.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const isVideoMimetype = (mimetype) => ALLOWED_VIDEO_TYPES.includes(mimetype);
