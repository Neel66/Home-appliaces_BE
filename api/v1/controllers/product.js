const async = require('async');
const Product = require('../models/Product.models');
const productName = require('../models/Productname.models');
const productCompany = require('../models/Productcompany');
const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "./image");
  },
  filename: (req,file, cb) => {
      cb(null, file.originalname );
  },
})

const upload = multer({ storage : fileStorageEngine})
module.exports = {
    //Get All Product User Side'
    product : (req,res) => {
    async.waterfall([
        (nextCall) => {
        Product.find({})
        .then( result => {
            nextCall(null, result)
            return true;
        })
        .catch ( err => {
            nextCall({msg : err})
            return false;
        })
        }
    ], (err, response) => {
        if (err) {
          return res.sendToEncode({
            status: 0,
            message: err
          })
        }
  
        res.sendToEncode({
          status: 1,
          message :  "All Products",
          data: response
        })
      })
    },
     // Get Singel Product Detailes
     singleProduct : (req,res) => {
      async.waterfall([
        (nextCall) => {
          Product.findById({_id : req.params.id})
          .then( result => {
            nextCall(result)
            return true;
          })
          .catch ( err => {
            nextCall(err)
            return false;
          })

        }
      ], (err, response) => {
        if (err) {
          return res.sendToEncode({
            status: 0,
            message: err
          })
        }
  
        res.sendToEncode({
          status: 1,
          data: response
        })
      })
     },
    // AddProduct 
    addProduct :   (req,res) => {    
        async.waterfall([
          (nextCall) => {
            // req.checkBody('price', 'price is required').notEmpty();
            // req.checkBody('discount', 'discount is required').notEmpty();
            // req.checkBody('discountprice', 'discountprice is required').notEmpty();
            // req.checkBody('detailes', 'detailes is required').notEmpty();
            // req.checkBody('cid', 'cid is required').notEmpty();
            // req.checkBody('name', 'name is required').notEmpty();
            // req.checkBody('image', 'image is required').notEmpty();
            // var error = req.validationErrors();
            // if (error && error.length) {
            //   return nextCall({
            //     message: error[0].msg
            //   })
            // }
            // console.log("body", req.body)
            // nextCall(null, req.body)
                const body = {
                    price : req.body.price,
                    discount : req.body.discount,
                    discountprice : req.body.discountprice,
                    detailes : req.body.detailes,
                    cid : req.body.cid,
                    name : req.body.name,
                    image : req.file.filename
                }
                nextCall(null, body)
            },
            (body,nextCall) => {
              console.log("a",body);
                const product = new Product(body)
                product.save()
                .then( result => {
                    nextCall(null,result)
                })
                .catch( err => {
                    nextCall(err)
                })
            }
        ] , (err, response) => {
            if (err) {
              return res.sendToEncode({
                status: 0,
                message: err
              })
            }
      
            res.sendToEncode({
              status: 1,
              message: "Product Add Successfully",
              data: response
            })
          })
    },

    productName : (req,res) => {
        async.waterfall([
            (nextCall) => {
              const body = {
                name : req.body.name
              }
            nextCall(null,body);
            },
         (body,nextCall) =>{
          const name = new productName(body);
          name.save()
          .then( result => {
            nextCall(result)
          })
          .catch( err => {
            nextCall(err)
          })
         }

        ],
        (err, response) => {
          if (err) {
            return res.sendToEncode({
              status: 0,
              message: err
            })
          }
    
          res.sendToEncode({
            data: response
          })
        })
    },
    productCompany : (req,res) => {
      async.waterfall([
        (nextCall) => {
          const body = {
            name : req.body.name
          }
        nextCall(null,body);
        },
     (body,nextCall) =>{
      const name = new productCompany(body);
      name.save()
      .then( result => {
        nextCall(result)
      })
      .catch( err => {
        nextCall(err)
      })
     }
      ],
      (err, response) => {
        if (err) {
          return res.sendToEncode({
            status: 0,
            message: err
          })
        }
  
        res.sendToEncode({
          data: response
        })
      })
    }
}


