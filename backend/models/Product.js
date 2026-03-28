const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  description: { type: String, required: true },
  specifications: [{
    key: String,
    value: String
  }],
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Pre-save to auto-calculate discount percent
productSchema.pre('save', function(next) {
  if (this.price > 0 && this.discountedPrice < this.price) {
    this.discountPercent = Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
