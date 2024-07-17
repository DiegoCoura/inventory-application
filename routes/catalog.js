const express = require("express");
const router = express.Router();
const catalogController = require("../controllers/catalogController");

router.get("/", catalogController.index);

router.get("/createcategory", catalogController.category_create_get);

router.post("/createcategory", catalogController.category_create_post);

router.get("/category/:id/delete", catalogController.category_delete_get);

router.post("/category/:id/delete", catalogController.category_delete_post);

router.get("/categories", catalogController.categories_get);

router.get("/category/:id", catalogController.category_get_products);

router.get("/createproduct", catalogController.product_create_get);

router.post("/createproduct", catalogController.product_create_post);

router.get("/product/:id", catalogController.product_detail);

router.get("/product/:id/update", catalogController.product_update_get);

router.post("/product/:id/update", catalogController.product_update_post);

router.get("/product/:id/delete", catalogController.product_delete_get);

router.post("/product/:id/delete", catalogController.product_delete_post);

module.exports = router;
