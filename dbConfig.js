
var mysql = require('mysql');


var dbConnection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : 'betanstore'
  });  

module.exports = dbConnection;
