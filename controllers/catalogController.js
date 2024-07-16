const { body, validationResult } = require("express-validator");
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

  allCategories.forEach((category) => {
    if (product.category === category.name) category.checked = "true";
  });

  res.render("product_form", {
    title: "Update Product",
    product: product,
    categories: allCategories,
  });
});

exports.product_update_post = [
  //validate and sanitize fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 10, max: 500 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 10, max: 500 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .notEmpty()
    .isNumeric()
    .escape(),
  body("category", "Invalid category ").escape(),
  body("image", "Image url must not be empty.")
    .trim()
    .isLength({ min: 1, max: 500 })
    .isURL(),
  body("quantity", "Quantity must not be empty.").trim().isNumeric().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      quantity: req.body.quantity,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      for (const category of allCategories) {
        if (category.name === product.category) {
          category.checked = "true";
        }
      }
      res.render("product_form", {
        title: "Update product",
        product: product,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        product,
        {}
      );
      res.redirect(updatedProduct.url);
    }
  }),
];
