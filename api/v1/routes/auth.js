const logger = require('../../../utils/logger');
const express = require('express');

const isLoggedInPolicie = require('../policies/isLoggedIn.js')
const isUserAuthenticatedPolicy = require('../policies/isUserAuthenticated.js')
const UserController = require('../controllers/admin.js');
const ProductController = require('../controllers/product')
const router = express.Router()
const decodeReqPolicy = require('../policies/decodeRequest.js')
const encodeResPolicy = require('../policies/encodeResponse.js')
const AESCrypt = rootRequire('utils/aes')
const multer = require('multer');
const orderController = require('../controllers/order');
const order = require('../controllers/order');
const upload = require('../middleware/upload')


router.get('/encode', (req, res) => {
  res.render('encode')
})

router.post('/encode', (req, res) => {
  var body = req.body

  logger.info('ENCODE BREQ BODY :->', body);

  try {
    var json = eval('(' + body.data + ')')
    var enc = AESCrypt.encrypt(JSON.stringify(json))
  } catch (e) {
    var enc = 'Invalid parameters'
  }
  res.send({
    'encoded': enc
  })
})

router.get('/decode', (req, res) => {
  res.render('decode')
})

router.post('/decode', (req, res) => {
  var body = req.body

  logger.info('DECODE REQ BODY :->', body)

  try {
    var dec = AESCrypt.decrypt(JSON.stringify(body.data))
  } catch (e) {
    var dec = 'Invalid parameters'
  }
  res.send(dec)
})

// decode request data
router.all('/*', (req, res, next) => {
  res.sendToEncode = (data) => {
    req.resbody = data
    next()
  }
  next()
}, decodeReqPolicy)

/**
 * Users Account & Authentication APIs
 */
router.post('/auth/signup',
  UserController.signup
);
router.post('/auth/login', UserController.login);
router.put('/auth/update', UserController.updateUser);
router.post('/auth/get', UserController.user);

//router.delete('/delete/:id', UserController.deleteUser);
router.post('/delete', UserController.deleteUser);

// Product Routes
router.get('/product', ProductController.product);
router.post('/addproduct',upload.single('image'), ProductController.addProduct);
router.post('/productname', ProductController.productName);
router.post('/productCompany', ProductController.productCompany);
router.get('/detailes/:id', ProductController.singleProduct);

//Order
router.get('/order', orderController.getOrder)
router.put('/updateOrderPlace', orderController.updateOrderplace);
//Complain Routes
/**
 * Authentication Middleware (BEFORE)
 * Serve all apis before MIDDLE if they serve like /api/*
 */
// router.all('/api/*', isUserAuthenticatedPolicy, isLoggedInPolicie)
// router.post('/api/getAllUsers', () => {UserController.signup})
/**
 * Other APIs Routes (MIDDLE)
 */
router.get('/auth/test', UserController.test
)

/**
 * Responses Middleware (AFTER)
 * Serve all apis after MIDDLE if they serve like /api/*
 */
router.all('/*', encodeResPolicy)

// exports router
module.exports = router
