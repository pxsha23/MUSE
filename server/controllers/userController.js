import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { uploadBufferToCloudinary, destroyCloudinaryAsset } from '../utils/cloudinaryUpload.js';

// @route PUT /api/users/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      emailVerified: user.emailVerified,
      avatarUrl: user.avatarUrl,
    },
  });
});

// @route POST /api/users/me/avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const user = await User.findById(req.user._id);

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `muse/avatars/${req.user._id}`,
    resourceType: 'image',
  });

  await destroyCloudinaryAsset(user.avatarPublicId);
  user.avatarUrl = result.url;
  user.avatarPublicId = result.publicId;
  await user.save();

  res.json({ avatarUrl: user.avatarUrl });
});
