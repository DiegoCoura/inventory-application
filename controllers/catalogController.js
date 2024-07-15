const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const Product = require("../models/product");

exports.index = asyncHandler(async (req, res, next) => {
  const [allProducts, allCategories] = await Promise.all([
    Product.find().sort({ title: 1 }).populate("category").exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("index", {
    title: "Dida's Store",
    all_products: allProducts,
    all_categories: allCategories,
  });
});
