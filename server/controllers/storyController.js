import { asyncHandler } from '../utils/asyncHandler.js';
import Story from '../models/Story.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { uploadBufferToCloudinary, destroyCloudinaryAsset } from '../utils/cloudinaryUpload.js';
import { isVideoMimetype } from '../middleware/uploadMiddleware.js';

// @route GET /api/stories/feed (public)
// Latest-per-seller grouping, most recently active sellers first.
export const getStoryFeed = asyncHandler(async (req, res) => {
  const grouped = await Story.aggregate([
    { $match: { isActive: true } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$seller',
        storeName: { $first: '$storeName' },
        storeSlug: { $first: '$storeSlug' },
        storeLogoUrl: { $first: '$storeLogoUrl' },
        lastPostedAt: { $first: '$createdAt' },
        stories: {
          $push: {
            _id: '$_id',
            mediaUrl: '$mediaUrl',
            mediaType: '$mediaType',
            caption: '$caption',
            linkedProduct: '$linkedProduct',
            createdAt: '$createdAt',
          },
        },
      },
    },
    { $sort: { lastPostedAt: -1 } },
    { $limit: 20 },
  ]);

  const feed = grouped.map((g) => ({
    seller: {
      id: g._id,
      storeName: g.storeName,
      storeSlug: g.storeSlug,
      storeLogoUrl: g.storeLogoUrl,
    },
    stories: g.stories.reverse(),
  }));

  res.json({ feed });
});

// @route GET /api/stories/mine (seller)
export const getMyStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({ seller: req.user._id, isActive: true }).sort({
    createdAt: -1,
  });
  res.json({ items: stories });
});

// @route POST /api/stories (seller, verified)
export const createStory = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('A media file (image or video) is required');
  }

  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found for this account');
  }

  const { caption, linkedProduct } = req.body;
  if (linkedProduct) {
    const product = await Product.findOne({ _id: linkedProduct, seller: req.user._id });
    if (!product) {
      res.status(400);
      throw new Error('linkedProduct must be one of your own products');
    }
  }

  const mediaType = isVideoMimetype(req.file.mimetype) ? 'video' : 'image';
  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `muse/stories/${req.user._id}`,
    resourceType: mediaType,
  });

  const story = await Story.create({
    seller: req.user._id,
    storeName: store.storeName,
    storeSlug: store.slug,
    storeLogoUrl: store.logoUrl,
    mediaUrl: result.url,
    mediaPublicId: result.publicId,
    mediaType,
    caption,
    linkedProduct: linkedProduct || undefined,
  });

  res.status(201).json({ story });
});

// @route DELETE /api/stories/:id (seller, owner only)
export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story || !story.isActive) {
    res.status(404);
    throw new Error('Story not found');
  }
  if (String(story.seller) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You do not own this story');
  }

  story.isActive = false;
  await story.save();
  await destroyCloudinaryAsset(story.mediaPublicId, story.mediaType);

  res.json({ message: 'Story removed' });
});
