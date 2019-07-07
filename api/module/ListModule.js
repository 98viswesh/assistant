module.exports = function ListModule(key,synonyms){

this.key = ''+key;
this.synonyms =JSON.parse(JSON.stringify([synonyms])) ;
}


    // {
    //     "optionInfo": {
    //         "key": "key1",
    //         "synonyms": [
    //             "Option 1"
    //         ]
    //     },
    //     "title": "Option 1",
    //     "description": "Option 2"
    // }