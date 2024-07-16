const express = require("express")
const router = express.Router();
const catalogController = require('../controllers/catalogController')


router.get('/', catalogController.index);

router.get('/newproduct', catalogController.product_create_get);

router.post('/newproduct', catalogController.product_create_post);

router.get('/product/:id', catalogController.product_detail);

router.get('/product/:id/update', catalogController.product_update_get);

router.post('/product/:id/update', catalogController.product_update_post);


module.exports = router;