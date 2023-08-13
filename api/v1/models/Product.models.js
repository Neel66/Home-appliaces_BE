const mongoose = require('mongoose');
const connection = require('../db/connection');

const productSchema = mongoose.Schema({
    price : { type : String, required : true},
    discount : { type : String, required : true },
    discountprice : { type : String, required: true},
    detailes : { type : String, required: true},
    cid : { type: String,
        ref: 'ProductCompany', required: true},
    name: { type: String,
        ref: 'ProductName', required: true},
    image : { type : String, required : true}
},
{
    collection: 'product'
  })

module.exports = connection.model(productSchema.options.collection, productSchema);