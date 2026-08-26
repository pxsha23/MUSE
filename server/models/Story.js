import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    storeName: { type: String, required: true },
    storeSlug: { type: String, required: true },
    storeLogoUrl: { type: String },

    mediaUrl: { type: String, required: true },
    mediaPublicId: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },

    caption: { type: String, default: '' },
    linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

storySchema.index({ isActive: 1, createdAt: -1 });

const Story = mongoose.model('Story', storySchema);
export default Story;
