const ProductController = require('../controllers/product');
const express = require('express');
const router = express.Router();

router.get('/product', ProductController.product);
router.post('/addproduct', ProductController.addProduct);
router.post('/productname', ProductController.productName);
router.post('/productCompany', ProductController.productCompany);
router.get('/detailes/:id', ProductController.singleProduct);

module.exports = router