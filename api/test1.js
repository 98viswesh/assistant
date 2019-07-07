 payload = require('./../responsejosn/BasicCard.json')

exports.tes=function(req,res){
    var output = JSON.parse(JSON.stringify( {
        //   "outputContexts": _req.body.queryResult.outputContexts
            "fulfillmentMessages":[],
           payload
       }));
       output.fulfillmentMessages.push({'text':{'text': ['this is how a card looks'] }}) ;
       output.payload.google.richResponse.items[1].basicCard.title ='Card Outlook';
    res.setHeader('Content-Type', 'application/json');
    w="acknowledged";
    obj={"fulfillmentMessages" : [{ "text":{"text":[w]}}]};
    res.json(output);
    console.log("yes");
 }
 

