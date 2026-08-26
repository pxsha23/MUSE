import 'dotenv/config';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Story from '../models/Story.js';
import Cart from '../models/Cart.js';
import { slugify } from '../utils/slugify.js';
import { productPlaceholder, storyPlaceholder, logoPlaceholder } from '../utils/placeholderImage.js';

const img = (category) => ({ url: productPlaceholder(category), publicId: `seed/${category}` });

const sellers = [
  {
    name: 'Ananya Rao',
    email: 'ananya@muse.demo',
    storeName: 'Ivory Thread',
    bio: 'Hand-finished occasion dresses, made in small batches.',
    products: [
      { title: 'Blush Wrap Midi Dress', category: 'dresses', price: 2899, tags: 'dress,pink,midi' },
      { title: 'Champagne Slip Dress', category: 'dresses', price: 3299, tags: 'dress,slip,evening' },
      { title: 'Rose Organza Gown', category: 'dresses', price: 5499, tags: 'dress,gown,party' },
    ],
  },
  {
    name: 'Meera Kapoor',
    email: 'meera@muse.demo',
    storeName: 'Little Luxe Studio',
    bio: 'Delicate gold-plated jewelry for everyday glam.',
    products: [
      { title: 'Pearl Drop Earrings', category: 'jewelry', price: 899, tags: 'earrings,pearl,gold' },
      { title: 'Layered Chain Necklace', category: 'jewelry', price: 1199, tags: 'necklace,gold,layered' },
      { title: 'Charm Bracelet Set', category: 'jewelry', price: 999, tags: 'bracelet,charm,gold' },
    ],
  },
  {
    name: 'Priya Nair',
    email: 'priya@muse.demo',
    storeName: 'Sole Society',
    bio: 'Comfortable statement heels and flats for every look.',
    products: [
      { title: 'Strappy Block Heels', category: 'shoes', price: 2199, tags: 'shoes,heels,strappy' },
      { title: 'Satin Ballet Flats', category: 'shoes', price: 1599, tags: 'shoes,flats,satin' },
    ],
  },
  {
    name: 'Ritu Malhotra',
    email: 'ritu@muse.demo',
    storeName: 'Muse & Co Bags',
    bio: 'Structured mini bags for every occasion.',
    products: [
      { title: 'Quilted Mini Sling', category: 'bags', price: 1899, tags: 'bag,sling,quilted' },
      { title: 'Pearl Clasp Clutch', category: 'bags', price: 2499, tags: 'bag,clutch,pearl' },
    ],
  },
  {
    name: 'Sana Iyer',
    email: 'sana@muse.demo',
    storeName: 'Glow Ritual',
    bio: 'Clean, glowy beauty essentials.',
    products: [
      { title: 'Rose Tint Lip Oil', category: 'beauty', price: 649, tags: 'beauty,lip,tint' },
      { title: 'Shimmer Body Oil', category: 'beauty', price: 899, tags: 'beauty,shimmer,body' },
    ],
  },
];

const run = async () => {
  await connectDB();
  console.log('Clearing existing demo data (@muse.demo accounts only)...');

  const demoUsers = await User.find({ email: { $regex: '@muse\\.demo$' } });
  const demoUserIds = demoUsers.map((u) => u._id);
  await Promise.all([
    Product.deleteMany({ seller: { $in: demoUserIds } }),
    Story.deleteMany({ seller: { $in: demoUserIds } }),
    Store.deleteMany({ owner: { $in: demoUserIds } }),
    Cart.deleteMany({ user: { $in: demoUserIds } }),
    User.deleteMany({ email: { $regex: '@muse\\.demo$' } }),
  ]);

  for (const s of sellers) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      passwordHash: 'password123',
      role: 'seller',
      emailVerified: true,
    });
    const store = await Store.create({
      owner: user._id,
      storeName: s.storeName,
      slug: slugify(s.storeName),
      bio: s.bio,
      logoUrl: logoPlaceholder(s.storeName[0].toUpperCase()),
    });
    await Cart.create({ user: user._id, items: [] });

    const createdProducts = [];
    for (const p of s.products) {
      const product = await Product.create({
        seller: user._id,
        storeName: store.storeName,
        storeSlug: store.slug,
        title: p.title,
        description: `${p.title} from ${store.storeName}. A MUSE bestseller.`,
        category: p.category,
        price: p.price,
        compareAtPrice: Math.round(p.price * 1.25),
        images: [img(p.category)],
        stock: 25,
        tags: p.tags.split(','),
        isPublished: true,
      });
      createdProducts.push(product);
    }

    await Story.create({
      seller: user._id,
      storeName: store.storeName,
      storeSlug: store.slug,
      storeLogoUrl: store.logoUrl,
      mediaUrl: storyPlaceholder(s.products[0].category, 'New In'),
      mediaPublicId: `seed/${slugify(s.storeName)}-story`,
      mediaType: 'image',
      caption: `New in at ${store.storeName}`,
      linkedProduct: createdProducts[0]?._id,
    });

    console.log(`Seeded seller ${s.storeName} (${s.email} / password123) with ${createdProducts.length} products`);
  }

  const buyer = await User.create({
    name: 'Demo Buyer',
    email: 'buyer@muse.demo',
    passwordHash: 'password123',
    role: 'buyer',
    emailVerified: true,
  });
  await Cart.create({ user: buyer._id, items: [] });
  console.log('Seeded buyer (buyer@muse.demo / password123)');

  console.log('Done.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
