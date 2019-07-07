
var mysql = require('../../dbConfig');
//var app = require('../../VoiceAssistant');
//var app = require('../../app');

var  constantvar = require('./intentConstant');
var  resPraser = require('./responsePaser');
var dateFormat = require('dateformat');
var currentDate = dateFormat(new Date(),"yyyymmdd");
var sqlquery ;

var textToSpeech;


exports.farmerDetails = function(_req,_res){

    console.log(JSON.stringify(_req.body));

    var queryResult = _req.body.queryResult;
    var intent =  queryResult.intent;
    var parameters =  queryResult.parameters;
    var contextParameters = queryResult.outputContexts[0].parameters;


    switch(intent.displayName ){

        case constantvar.INTENT_FARMER_DETAILS:
                if(parameters.category === constantvar.CATEGORY_PRODUCT){
                    getFarmerByProduct();
                }else if(parameters.category === constantvar.CATEGORY_IRRIGATION){
                    getFarmerByIrrigation();
                }else if(parameters.category === constantvar.CATEGORY_AREA){
                    getFarmerByArea();
                }
        break
        default:
        break
    }


    function getFarmerByProduct(){
        var categort_value = 'category.original';
        textToSpeech = constantvar.CATEGORY_AVAILABLE_LIST;
        sqlquery = "select count(*) as count  from nstore_sup_registration where products like '%"+queryResult.queryText+"%'";
        getDataFromDatabase();

    }

    function getFarmerByArea(){
    
        var categort_value = 'category.original';
        textToSpeech = constantvar.CATEGORY_AVAILABLE_LIST;
        sqlquery = "select count(*) as count  from nstore_sup_registration where irrigation like '%"+queryResult.queryText+"%'";
        getDataFromDatabase();
    }
    function getFarmerByIrrigation(){
        var categort_value = 'category.original';

        textToSpeech = constantvar.CATEGORY_AVAILABLE_LIST;
        sqlquery = "select count(*) as count  from nstore_sup_registration where split like '%"+queryResult.queryText+"%'"; 
        getDataFromDatabase();
    }


    function getDataFromDatabase(){

        if(mysql){
            mysql.query(sqlquery, function(err, rows,field){
                if(!err){
                    console.log('sqlquery  :'+sqlquery);
                    console.log('textToSpeech  :'+textToSpeech);
                if(rows){
                    _res.json(resPraser.praser(_res,_req,textToSpeech,rows));
                }else{
                    _res.json(resPraser.praser(_res,_req,constantvar.CATEGORY_NOT_AVAILABLE,rows));

                }
    
                }else{
                    console.log('error'+err);
                _res.json(resPraser.praser(_res,_req,constantvar.Error,rows));
                }
            })
        
        }
    }

}