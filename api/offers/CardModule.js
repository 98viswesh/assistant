module.exports = function CardModule(title,
    subtitle,
    imageUri){
        var buttonVaue;
        buttonVaue = JSON.parse(JSON.stringify([
            {
              "text": "Get",
              "postback": "http://nstore.in/"
            }
          ]));
    
this.title = title;
this.formattedText= subtitle;

this.image =JSON.parse(JSON.stringify( {
  "url": imageUri,
  "accessibilityText": "Image alternate text"
}));

this.buttons = JSON.parse(JSON.stringify([ {
  "title": "GET",
  "openUrlAction": {
      "url": "http://nstore.in"
  }
}]));

this.imageDisplayOptions = 'CROPPED';
}