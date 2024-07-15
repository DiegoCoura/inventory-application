const express = require("express")
const router = express.Router();
const catalogController = require('../controllers/catalogController')


router.get('/', catalogController.index);

router.get('/product/:id', catalogController.product_detail);

router.get('/product/:id/update', catalogController.product_update_get);

module.exports = router;