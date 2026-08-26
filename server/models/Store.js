import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    bio: { type: String, trim: true, default: '' },
    logoUrl: { type: String },
    logoPublicId: { type: String },
    bannerUrl: { type: String },
    bannerPublicId: { type: String },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      pinterest: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);
export default Store;
