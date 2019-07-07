var expressPackage = require("express");  
var bodyParserPackage = require("body-parser");  
const {dialogflow} = require('actions-on-google');
const assistant = dialogflow();
//Initilize app with express web framework  
var app = expressPackage();  
const cron = require('node-cron');
//To parse result in json format  
app.use(bodyParserPackage.json());  
  
//var taskmod = require('./api/scrap');

app.use(bodyParserPackage.json({ limit: '10mb' })); // parse application/json and set limit as 10 MB
app.use(bodyParserPackage.json({ 'Content-type': 'application/json' })); // parse application/vnd.api+json as json
app.use(bodyParserPackage.urlencoded({ limit: '10mb', extended: true })); // parse application/x-www-form-urlencoded

var offerRoute = require('./api/testan');
app.use('/', offerRoute.tes);


  
var server = app.listen(process.env.PORT || 8009, function () {  
    var port = server.address().port;  
   console.log("App now running on port", port);  
});   


module.exports  = app;
