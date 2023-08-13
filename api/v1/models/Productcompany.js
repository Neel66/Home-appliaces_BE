const mongoose = require('mongoose');
const connection = require('../db/connection');

const productCompany = mongoose.Schema({
    name : { type : String, required : true}
},
{
    collection: 'productcompany'
  })

  module.exports = connection.model(productCompany.options.collection, productCompany);