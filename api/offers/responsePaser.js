var cardModule = require('./CardModule')
var listMoudle = require('./../module/ListModule')

var ArrayList = require('arraylist');
var payload = require('./listPraser.json');
var card  = new ArrayList;
var cardvalue  ;//= new ArrayList; ;




module.exports = {
praser : function(_res,_req,textToSpeech, data){

    console.log(JSON.stringify(_req.body));


    var output = JSON.parse(JSON.stringify( {
        "outputContexts": _req.body.queryResult.outputContexts,
        "fulfillmentText": textToSpeech,
        "fulfillmentMessages":[],
        payload
    }));

    
    output.fulfillmentMessages.push({'text':{'text':[textToSpeech]}}) ;
    output.payload.google.richResponse.items[0].simpleResponse.textToSpeech= textToSpeech;

   




if(data){
    
            for (let i = 0; i < data.length; i++) {
                var discountDetail ;
        
            var element = data[i]
            if(element.discount_amount != 0){
                discountDetail = 'Offer code - '+element.offer_code+'\n Rs-'+element.discount_amount+' off on minimum purchase of '+element.min_purchase_amount;

            }
            if(element.discount_percent != 0){
                discountDetail = 'Offer code - '+element.offer_code+'\n'+element.discount_amount+'% off on minimum purchase of '+element.min_purchase_amount;

            }
            //'''

            var optionInfo =   new listMoudle(element.offer_key,element.offer_name,)    
            var obj = JSON.parse(JSON.stringify({optionInfo,
                "title" : element.offer_name,
                "description" : discountDetail,
                "image": {
                    "url": "http://www.pngall.com/wp-content/uploads/2016/07/Special-offer-Free-Download-PNG.png",
                    "accessibilityText": "Image description for screen readers"
                  }
                }));
            output.payload.google.systemIntent.data.listSelect.items.push(obj) ;
            }
    }


    // if(data){
    
    //         for (let i = 0; i < data.length; i++) {
    //             var discountDetail ;
            
    //         var element = data[i]
    //         if(element.discount_amount != 0){
    //             discountDetail = 'Offer code - '+element.offer_code+'\n Rs-'+element.discount_amount+' off on minimum purchase of '+element.min_purchase_amount;

    //         }
    //         if(element.discount_percent != 0){
    //             discountDetail = 'Offer code - '+element.offer_code+'\n'+element.discount_amount+'% off on minimum purchase of '+element.min_purchase_amount;

    //         }
    //         var basicCard =   new cardModule(element.offer_name,discountDetail,'http://www.pngall.com/wp-content/uploads/2016/07/Special-offer-Free-Download-PNG.png')    
    //         var obj = JSON.parse(JSON.stringify({basicCard}))
    //         output.payload.google.richResponse.items.push(obj) ;
    //         }
    // }

    
  

_res.json(output);

}   
}