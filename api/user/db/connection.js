const mongoose = require('mongoose');
const mysql = require('mysql');
const config = rootRequire('config')
const logger = rootRequire('./utils/logger')
let connection

// DB configuration
if (config.database.use === 'mongodb') {
  
  console.log("🚀 ~ file: connection.js ~ line 10 ~ config.database.mongoURL + 'homeappliances'", config.database.mongoURL + 'homeappliances')
  
  connection = mongoose.createConnection(config.database.mongoURL + 'homeappliances',{useUnifiedTopology: true} ) // database name
  connection.on('error', (err) => logger.error(err))
} else if (config.database.use === 'mysql') {
  var pool = mysql.createPool(config.database.mySQLConfig)
  logger.log('Successfully connected with mysql')

  connection = (sqlQuery, params, callback) => {
    // get a connection from a pool request
    pool.getConnection((err, conn) => {
      if (err) {
        return callback(true)
      }
      // execute a query
      conn.query(sqlQuery, params, (err, results) => {
        conn.release()
        if (err) {
          callback(true)
          return
        }
        callback(false, results)
      })
    })
  }
} else {
  logger.error('Failed to connect with db')
}

module.exports = connection
