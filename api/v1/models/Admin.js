const mongoose = require('mongoose');
const moment = require('../../../utils/moment');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema
const connection = require('../db/connection')
const ED = rootRequire('utils/encry_decry')

var schema = new Schema({
  username : { type : String , required : true},
  email : { type : String, required : true},
  mobile : { type : Number, required : true},
  password : { type : String, required : true}
}, {
  collection: 'User'
})

schema.statics.hashpassword =  (password) => {
  return bcrypt.hashSync(password, 10);
  }
schema.pre('save', (next) => {
  // console.log("🚀 ~ file: User.js ~ line 43 ~ schema.pre ~ user", user)
  var user = this;
  // console.log("user schema", user)
  // if (user) {
  //   user.password = ED.encrypt(user.password);
  // }
  // user.created_at = user.updated_at = new Date()
  next()
})

schema.pre('update', (next) => {
  this.update({}, {
    $set: {
      updated_at: new Date()
    }
  })
  next()
})

schema.methods.comparePassword = (candidatePassword, cb) => {
  var match = false
  candidatePassword = ED.encrypt(candidatePassword);

  if (candidatePassword === this.password) {
    match = true
  }
  cb(match)
}

module.exports = connection.model(schema.options.collection, schema)
