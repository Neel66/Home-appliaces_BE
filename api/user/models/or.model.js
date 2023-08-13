const mongoose = require('mongoose');
const Schema = mongoose.Schema
const connection = require('../db/connection')

var schema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    items : [
    {
        productid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product', required: true
        },
        quantity: { type: Number, required: true },
        totalprice: { type: Number, required: true },
         _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', required: true
    },
    }
    ],
    addressid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userAddress', default : null
    },
    orderdate: { type:String, default: new Date(), required: true },
    ordertraking: { type: String, default : null},
    confirmorderdate: { type: String, default : null },
    subtotal: { type: Number, required: true}
}, {
    collection: 'Orders'
});

module.exports = connection.model(schema.options.collection, schema)