#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  try {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createProducts();
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

async function createProducts() {
  const allProducts = await fetch("https://fakestoreapi.com/products");
  const allProductsJson = await allProducts.json();

  const promises = [];

  if (allProducts === null) {
    throw new Error("couldn't fetch data from fake store api");
  } else {
    try {
      allProductsJson.forEach((product) => {
        promises.push(createProduct(product));
      });
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
    }
  }
}

async function createProduct(product) {
  try {
    const productCategoryId = await Category.find(
      {
        name: product.category,
      },
      "_id"
    ).exec();
    if (productCategoryId === null) {
      throw new Error("category not found");
    } else {
      console.log(productCategoryId[0]);
    }
    const productProps = {
      title: product.title,
      description: product.description,
      price: product.price,
      category: productCategoryId[0],
      image: product.image,
      quantity: product.rating.count,
    };
    const newProduct = new Product(productProps);
    await newProduct.save();
  } catch (err) {
    console.log(err);
  }
}

async function createCategory(categoryName) {
  const categoryProps = {
    name: categoryName,
  };
  try {
    const category = new Category(categoryProps);
    await category.save();
    console.log(`category created: ${categoryProps}`);
  } catch (err) {
    console.log(err);
  }
}
