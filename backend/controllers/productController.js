const Product = require('../models/Product');

const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    let sortObj = {};
    if (sort === 'price-asc') sortObj.discountedPrice = 1;
    else if (sort === 'price-desc') sortObj.discountedPrice = -1;
    else if (sort === 'rating') sortObj.rating = -1;
    else sortObj.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.json({ products, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else { res.status(404); throw new Error('Product not found'); }
  } catch (error) { next(error); }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) { next(error); }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10);
    res.json(products);
  } catch (error) { next(error); }
};

module.exports = { getAllProducts, getProductById, getCategories, getFeaturedProducts };
