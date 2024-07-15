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

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_detail", {
    title: "Product Details",
    product: product,
  });
});

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).populate("category").exec(),
    Category.find().exec(),
  ]);

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  allCategories.forEach((category)=>{
    if(product.category === category.name) category.checked = "true"
  })

  res.render("product_form", {
    title: "Update Product",
    product: product,
    categories: allCategories
  });
});
