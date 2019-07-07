const cron = require('node-cron');    
const request = require('request');
var mysql = require('./../dbConfig');
    // cron wont start automatically
var name;
var address;
var user_rating_tot;
var rating;
var website;
var opening_hrs;
var place_id;
var phone_no;
    var task = cron.schedule('* * * * *', () => {

        console.log('Printing this line every minute.');
        var url="https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ_xd6NgnBwjsRBk1ofFNtLNI&fields=international_phone_number,opening_hours,website,price_level,rating,user_ratings_total,formatted_address,name&key=AIzaSyBeVXKyh_QfcB8d0Dc0Or29LyUAsGd96-U";
        var https = require('https');
        var dat;
        var body ='';
        https.get(url, function(response) {
          response.on('data', function(chunk) {
            body += chunk;
            //console.log(body);
          });
       response.on('end', function() {
        dat = JSON.parse(body);
        console.log(dat);
         
        name=dat.result.name;
        address=dat.result.formatted_address;
        user_rating_tot=dat.result.user_ratings_total;
        rating=dat.result.rating;
        rating=parseFloat(rating);
        website=dat.result.website;
        opening_hrs=dat.result.opening_hours.weekday_text;
        place_id="ChIJ_xd6NgnBwjsRBk1ofFNtLNI"; // think of a way to get it
        phone_no=dat.result.international_phone_number;
        phone_no=phone_no.toString();
          if(mysql){
            //var sqlq="insert into unit_google_data values('"+name+"','"+address+"',"+user_rating_tot+","+rating+",'"+website+"','"+opening_hrs+"','"+place_id+"','"+phone_no+"')";
            var sqlquery="select * from unit_google_data where place_id="+place_id;
            mysql.query(sqlquery, function(err,result,field){
              if(result.length >0){
              var sqlq="update unit_google_data set rating="+rating;
              mysql.query(sqlq, function(err,result,field){
                 if(!err){
                     console.log("inserted");
                 }
                 else{
                   console.log(err);
                 }  
             })
            }
            else{
              var sqlq="insert into unit_google_data values('"+name+"','"+address+"',"+user_rating_tot+","+rating+",'"+website+"','"+opening_hrs+"','"+place_id+"','"+phone_no+"')";
              mysql.query(sqlq, function(err,result,field){
                 if(!err){
                     console.log("inserted");
                 }
                 else{
                   console.log(err);
                 }  
             }) 
            }
           })
          }

       });
      });
        
    });
    // start method is called to start the above defined cron job
    task.start();