
var mysql = require('../../dbConfig');
//var app = require('../../VoiceAssistant');
//var app = require('../../app');
simpleVoiceResponse = require('./../../responsejosn/SimpleResponse.json')
var  constantvar = require('./intentConstant');
var  resPraser = require('./responsePaser');
var dateFormat = require('dateformat');
var currentDate = dateFormat(new Date(),"yyyymmdd");
//var currentDate = 20180712;
var sqlquery ;

var textToSpeech;


 
exports.getOffers=function(_req,_res){
var queryResult = _req.body.queryResult;
var intent =  queryResult.intent;
var parameters =  queryResult.parameters;


console.log('request  ========== \n>',JSON.stringify(_req.body))



    

switch(intent.displayName){

    case constantvar.INTENT_GET_OFFER:

    if(_req.body.queryResult.queryText == constantvar.INTENT_ACTION_GET_OFFER){
        sentOffers(_res);
    }else{
        toGetOffers();
    }
    break;

    default :
        sentErrorReq();
    break;

}


//sent offers to customer.

function sentOffers(_res){
  var inputs = _req.body.originalDetectIntentRequest.payload.inputs;

  var rawInputs = inputs[0].rawInputs;
  var arg = inputs[0].arguments;  
  sqlquery = 'select * from nstore_offers where offer_key ='+(arg[0].textValue)+';';


  console.log(sqlquery);

  if(mysql){
      mysql.query(sqlquery,function(err, rows,field){

        if(mysql){
            mysql.query(sqlquery,function(err, rows,field){
      
              if(!err){
      
                  if(rows.length > 0){
      
                      simpleVoiceResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = 'offer sent'
                      _res.json(simpleVoiceResponse)
                  }else{
      
                  }
              }
      
            });
        }

      });
  }

}


//get current offers

function toGetOffers(){
    if(parameters.date.length > 0 && parameters.category.length > 0){   
            
        textToSpeech =  constantvar.OFFERS_NOT_AVAILABLE_CATEGORY;
        sqlquery = "select * from nstore_offers where status in('created','approved') and (valid_from <= "+currentDate+" and valid_to >= "+currentDate+" ) limit 30;";  
        console.log('switch','1');

    }else if(parameters.date.length > 0){
                textToSpeech =  constantvar.OFFERS_AVAILABLE_LIST;

        sqlquery = "select * from nstore_offers where status in('created','approved') and (valid_from <= "+currentDate+" and valid_to >= "+currentDate+" ) limit 30 ;";  
        console.log('switch','2');
    }else if(parameters.category.length > 0){

        textToSpeech =  constantvar.OFFERS_NOT_AVAILABLE_CATEGORY;
        sqlquery = "select * from nstore_offers where status in('created','approved') and (valid_from <= "+currentDate+" and valid_to >= "+currentDate+" ) limit 30;";  
        console.log('switch','3');

    }else{
        
        textToSpeech =  constantvar.OFFERS_AVAILABLE_LIST;
        sqlquery = "select * from nstore_offers where status in('created','approved') and (valid_from <= "+currentDate+" and valid_to >= "+currentDate+" ) limit 30;";  
        console.log('switch','4');

    }

    if(mysql){
        mysql.query(sqlquery, function(err, rows,field){
            if(!err){
                console.log('sqlquery  :'+sqlquery);
                console.log('textToSpeech  :'+textToSpeech);

             if(rows){
                 _res.json(resPraser.praser(_res,_req,textToSpeech,rows));
             }else{
                _res.json(resPraser.praser(_res,_req,constantvar.OFFERS_NOT_AVAILABLE,rows));

             }
 
            }else{
                console.log('error'+err);
             _res.json(resPraser.praser(_res,_req,constantvar.Error,rows));
            }
        })
    
}
}


//error resquest

function sentErrorReq(){

}

}