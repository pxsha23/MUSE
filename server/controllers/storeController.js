import { asyncHandler } from '../utils/asyncHandler.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { uploadBufferToCloudinary, destroyCloudinaryAsset } from '../utils/cloudinaryUpload.js';

// @route GET /api/stores/:slug  (public)
export const getStoreBySlug = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }
  const productCount = await Product.countDocuments({
    seller: store.owner,
    isPublished: true,
    isActive: true,
  });
  res.json({ store, productCount });
});

// @route GET /api/stores/me  (seller)
export const getMyStore = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found for this account');
  }
  res.json({ store });
});

// @route PUT /api/stores/me  (seller)
export const updateMyStore = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found for this account');
  }

  const { storeName, bio, socialLinks } = req.body;
  if (storeName) store.storeName = storeName;
  if (bio !== undefined) store.bio = bio;
  if (socialLinks) {
    store.socialLinks = { ...store.socialLinks.toObject(), ...socialLinks };
  }

  await store.save();
  res.json({ store });
});

// @route POST /api/stores/me/logo  (seller)
export const uploadStoreLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found for this account');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `muse/stores/${req.user._id}/logo`,
    resourceType: 'image',
  });

  await destroyCloudinaryAsset(store.logoPublicId);
  store.logoUrl = result.url;
  store.logoPublicId = result.publicId;
  await store.save();

  res.json({ store });
});

// @route POST /api/stores/me/banner  (seller)
export const uploadStoreBanner = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found for this account');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `muse/stores/${req.user._id}/banner`,
    resourceType: 'image',
  });

  await destroyCloudinaryAsset(store.bannerPublicId);
  store.bannerUrl = result.url;
  store.bannerPublicId = result.publicId;
  await store.save();

  res.json({ store });
});
