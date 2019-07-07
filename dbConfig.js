
var mysql = require('mysql');


var dbConnection = mysql.createConnection({
    host     : 'nstoreliverds.cbvnnxscotfe.ap-southeast-1.rds.amazonaws.com',
    user     : 'nStoreLiveUser',
    password : 'nStoreLiveUser',
    database : 'betanstore'
  });  

module.exports = dbConnection;