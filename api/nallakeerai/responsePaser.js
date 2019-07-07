
var ArrayList = require('arraylist');
var card  = new ArrayList;
var cardvalue  ;//= new ArrayList; ;
var payload = require('./../../responsejosn/BasicCard.json')




module.exports = {
praser : function(_res,_req,textToSpeech, data){

    console.log(JSON.stringify(_req.body));
    _req.body.queryResult.outputContexts[0].lifespanCount = 0;

   
    var output = JSON.parse(JSON.stringify( {
     //   "outputContexts": _req.body.queryResult.outputContexts,
        "fulfillmentText": textToSpeech,
         "fulfillmentMessages":[],
        // "followupEventInput": {
        //     "name": "actions.intent.OPENAPP",
        //     "languageCode": "en-US",
        //     "parameters": {
        //       "param": "open playstore app"
        //     }
        // }
        payload
    }));
    output.fulfillmentMessages.push({'text':{'text':[textToSpeech+ ' '+data[0].count+' farmers are available in Nallakeerai network' ]}}) ;
    output.payload.google.richResponse.items[0].simpleResponse.textToSpeech= textToSpeech+ ' '+data[0].count+' farmers are available in Nallakeerai network' ;

    output.payload.google.richResponse.items[1].basicCard.title ='Farmer Details';
    output.payload.google.richResponse.items[1].basicCard.formattedText =data[0].count+' farmers are available in Nallakeerai network ';
    output.payload.google.richResponse.items[1].basicCard.image.url ='http://nstore.in/nallakeerai_icon.jpg';
    output.payload.google.richResponse.items[1].basicCard.image.accessibilityText ='nallakeerai icon';
    output.payload.google.richResponse.items[1].basicCard.buttons[0].title ='Open App';
    output.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url ='https://play.google.com/store/apps/details?id=com.nstore.b2c.nallakeerai';




if(data){
    
    } 
  

_res.json(output);

}   
}