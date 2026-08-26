import { asyncHandler } from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { CATEGORY_VALUES } from '../utils/constants.js';
import {
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
} from '../utils/cloudinaryUpload.js';
import { isVideoMimetype } from '../middleware/uploadMiddleware.js';

const parsePagination = (req) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || 12));
  return { page, limit, skip: (page - 1) * limit };
};

// @route GET /api/products (public)
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, seller, sort } = req.query;
  const { page, limit, skip } = parsePagination(req);

  const filter = { isPublished: true, isActive: true };
  if (category && CATEGORY_VALUES.includes(category)) filter.category = category;
  if (seller) filter.storeSlug = seller;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

// @route GET /api/products/mine (seller)
export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, isActive: true }).sort({
    createdAt: -1,
  });
  res.json({ items: products });
});

// @route GET /api/products/:id (public, published only)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (!product.isPublished) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ product });
});

// @route POST /api/products (seller)
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, category, price, compareAtPrice, stock, tags, isPublished } =
    req.body;

  if (!title || !category || price === undefined) {
    res.status(400);
    throw new Error('title, category and price are required');
  }
  if (!CATEGORY_VALUES.includes(category)) {
    res.status(400);
    throw new Error('Invalid category');
  }

  const imageFiles = req.files?.images || [];
  if (imageFiles.length === 0) {
    res.status(400);
    throw new Error('At least one product image is required');
  }

  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('Store not found for this account');
  }

  const wantsPublish = isPublished === 'true' || isPublished === true;
  if (wantsPublish && !req.user.emailVerified) {
    res.status(403);
    const err = new Error('Verify your email before publishing a product live.');
    err.code2 = 'EMAIL_NOT_VERIFIED';
    throw err;
  }

  const images = await Promise.all(
    imageFiles.map((f) =>
      uploadBufferToCloudinary(f.buffer, {
        folder: `muse/products/${req.user._id}`,
        resourceType: 'image',
      })
    )
  );

  let video;
  const videoFile = req.files?.video?.[0];
  if (videoFile) {
    const result = await uploadBufferToCloudinary(videoFile.buffer, {
      folder: `muse/products/${req.user._id}`,
      resourceType: 'video',
    });
    video = result;
  }

  const product = await Product.create({
    seller: req.user._id,
    storeName: store.storeName,
    storeSlug: store.slug,
    title,
    description,
    category,
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
    images,
    video,
    stock: stock ? Number(stock) : 0,
    tags: tags ? String(tags).split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
    isPublished: wantsPublish,
  });

  res.status(201).json({ product });
});

const findOwnedProduct = async (req) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  if (String(product.seller) !== String(req.user._id)) {
    const err = new Error('You do not own this product');
    err.statusCode = 403;
    throw err;
  }
  return product;
};

// @route PUT /api/products/:id (seller, owner only)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await findOwnedProduct(req);

  const { title, description, category, price, compareAtPrice, stock, tags, isPublished } =
    req.body;

  if (category && !CATEGORY_VALUES.includes(category)) {
    res.status(400);
    throw new Error('Invalid category');
  }

  const wantsPublish = isPublished === 'true' || isPublished === true;
  if (isPublished !== undefined && wantsPublish && !req.user.emailVerified) {
    res.status(403);
    const err = new Error('Verify your email before publishing a product live.');
    err.code2 = 'EMAIL_NOT_VERIFIED';
    throw err;
  }

  if (title !== undefined) product.title = title;
  if (description !== undefined) product.description = description;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (compareAtPrice !== undefined) product.compareAtPrice = Number(compareAtPrice) || undefined;
  if (stock !== undefined) product.stock = Number(stock);
  if (tags !== undefined) {
    product.tags = String(tags).split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  if (isPublished !== undefined) product.isPublished = wantsPublish;

  if (req.files?.images?.length) {
    const newImages = await Promise.all(
      req.files.images.map((f) =>
        uploadBufferToCloudinary(f.buffer, {
          folder: `muse/products/${req.user._id}`,
          resourceType: 'image',
        })
      )
    );
    product.images.push(...newImages);
  }

  if (req.files?.video?.[0]) {
    if (product.video?.publicId) await destroyCloudinaryAsset(product.video.publicId, 'video');
    const result = await uploadBufferToCloudinary(req.files.video[0].buffer, {
      folder: `muse/products/${req.user._id}`,
      resourceType: 'video',
    });
    product.video = result;
  }

  await product.save();
  res.json({ product });
});

// @route DELETE /api/products/:id/images/:publicId (seller, owner only)
export const removeProductImage = asyncHandler(async (req, res) => {
  const product = await findOwnedProduct(req);
  const { publicId } = req.params;

  if (product.images.length <= 1) {
    res.status(400);
    throw new Error('A product needs at least one image');
  }

  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();
  await destroyCloudinaryAsset(publicId, 'image');

  res.json({ product });
});

// @route DELETE /api/products/:id (seller, owner only — soft delete)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await findOwnedProduct(req);
  product.isActive = false;
  product.isPublished = false;
  await product.save();
  res.json({ message: 'Product removed' });
});
