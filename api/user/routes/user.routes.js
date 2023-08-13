const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const complainController = require('../controllers/complain');
const addressController = require('../controllers/address')
const productController = require('../controllers/product');
const cartController = require('../controllers/cart');
const orderController = require('../controllers/order');
const forgotPasswordController = require('../controllers/forgotPassword')
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users/:page', userController.getAllUsers);
router.post('/delete', userController.deleteUser);
router.post('/profile', userController.getUserDetailes);
router.put('/update', userController.updateUser);

//complain 
router.post('/complain', complainController.Complain);
router.get('/complain', complainController.getComplain);
router.put('/replyComplain', complainController.replyComplain);
router.post('/delComplain', complainController.deleteComplain);
router.post('/getComplain', complainController.getreplyComplain);
//Address
router.post('/address', addressController.addAddress);
router.post('/get', addressController.address);
router.post('/delAddress', addressController.deleteAddress);
//product
router.get('/product', productController.getProducts);
router.get('/productdetailes/:id', productController.productDetailes);

//cart
router.post('/addtoCart', cartController.addtoCart);
router.post('/getCart', cartController.getCart);
router.post('/deleteCart', cartController.deleteCart);

//order
router.post('/order', orderController.order);
router.put('/orderAddress', orderController.orderAddress);
router.post('/orderHistory', orderController.orderHistory);

//forgotPassword
router.post('/forgotPassword', forgotPasswordController.forgotPassword);
router.post('/sendMail', forgotPasswordController.sendmail);
module.exports = router;