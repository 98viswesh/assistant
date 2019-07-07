var vara=require('./intentfile.js');
var mysql = require('./../dbConfig');
var payload1 = require('./../responsejosn/LinkOut.json');
var payload2 = require('./../responsejosn/SimpleResponse.json');
var payload3 = require('./../responsejosn/TableCard.json');
var payload4 = require('./../responsejosn/TableCard1.json');
var payload5 = require('./../responsejosn/ListResponse1.json');
var payload6 = require('./../responsejosn/TableCard2.json');
var payload7 = require('./../responsejosn/ListResponse.json');
var payload8 = require('./../responsejosn/saveData.json');
var mail=require('./FeedbackMailConfig');
var nodemailer = require('nodemailer');
var transporter=mail.transporter;
var mailOptions=mail.mailOptions;

exports.tes=function(req,res){

    const { WebhookClient } = require('dialogflow-fulfillment'); 
    const agent = new WebhookClient({request: req, response: res}); 
    const conv = agent.conv();

    var queryResult = req.body.queryResult;
    var intent =  queryResult.intent;
    var params=queryResult.parameters;
    var userId;

    if(intent.displayName===vara.shopname){
        getShop();
    }
    else if(intent.displayName===vara.service_details){
        getYesNo1();
    }
    else if(intent.displayName===vara.verification){
       getVerification();
    }
   else if (intent.displayName===vara.newEntries){
       getnewInfo();
   }
   else if(intent.displayName===vara.myOrders){
        getMyOrders();
   }
   else if(intent.displayName===vara.trendy){
        getTrendy();
   }
   else if(intent.displayName===vara.allProducts){
        getAllProds();
   }
   else if(intent.displayName===vara.option_app_img){
         getStoreLoc(); // depends on whhether u call getTrendy1()
   }
   else if(intent.displayName===vara.allCategories){
         getAllCateg(); 
   }
   else if(intent.displayName===vara.productname_status){
         getProdStatus();
  }
  else if(intent.displayName===vara.matching_stores){
        getStoreList();
  }
  else if(intent.displayName===vara.verify_and_issue){
        checkUser();
  }
  else if(intent.displayName===vara.lodgeIssue){
        getYesNo();
  }
  else if(intent.displayName===vara.issue_store_name){
        issueStore();
  } 
  
   function getShop(){

      var sname=params.shops;
      var sqlquery="select * from nstore_unit where unit_name= '"+sname + "'";
      if(mysql){
        mysql.query(sqlquery, function(err,result,field){
            //console.log(result);
             if(result.length > 0){
                var w="What details do you want from "+sname+"?\nYou could ask for \n1.shopping details\n2.Service details\n3.New offers";
                
                var temp=JSON.parse(JSON.stringify(payload2));
                 
                /* if (userId in conv.user.storage) {
                   userId = conv.user.storage.userId;
                   payload8.users.push({ 'uid': userId,'shopname':sname});
                 } else {
                   // Uses the "uuid" package. You can get this with "npm install --save uuid"
                   var uuid = require('uuid/v4');
                   userId = uuid();
                   conv.user.storage.userId = userId;
                   payload8.users.push({ 'uid': userId,'shopname':sname});
                   //console.log(conv.user.storage.userId);
                   //console.log(JSON.stringify(payload8));
                 } */
                
                 /*
                 var f=0;
                 for(var i=0;i<payload8.users.length;i++){
                  console.log(conv.user.raw.userId);
                  if(conv.user.raw.userId === payload8.users[i].uid){
                      f=1;
                      payload8.users[i].properties.shopname=sname;
                      break;
                  }  
                 }
                 if(f===0){
                  payload8.users.push({ 'uid': conv.user.raw.userId,'properties':{'shopname':{},'phoneNo':{},'feedback':{}}});
                  payload8.users[payload8.users.length-1].properties.shopname=sname;                 
                }
                */
                var uid=conv.user.raw.userId;
                var sq="select * from assistant_users where uid='"+uid+"'";
                mysql.query(sq, function(err,result,field){
                   console.log(result);
                     if(result.length >0){
                           var sqlq="update assistant_users set shopname='"+sname+"' where uid='"+uid+"'";
                           mysql.query(sqlq, function(err,result,field){
                                 if(!err)
                                   console.log("user updated");
                                 else
                                   console.log(err);
                           });
                     }
                     else{
                      var sqlq="insert into assistant_users (uid,shopname) values ('"+uid+"','"+sname+"')";
                      mysql.query(sqlq, function(err,result,field){
                        if(!err)
                          console.log("user inserted");
                        else
                          console.log(err);
                  });
                     }
                })

                temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                res.json(temp);
                //res.json(respon);
             }
             else{
                var tem=JSON.parse(JSON.stringify(payload2));
                var w="Sorry, we don't have information about "+sname;
             //respon.fulfillmentMessages.push({ "text":{"text":[w]}});
                tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                //var respon={"fulfillmentMessages" : [{ "text":{"text":[w]}}]};
                tem.payload.google.expectUserResponse=false;  
                res.json(tem);
                  //res.json(respon);
             }
        })
      }
     }
      function getVerification(){
          
         // var paramsn=agent.context.get("shopnam").parameters; 
          //var sname=paramsn.shops;
          var pnum=params['phone-number'];
        /*
          for(var i=0;i<payload8.users.length;i++){
           if(payload8.users[i].uid===conv.user.raw.userId){
             var sname=payload8.users[i].properties.shopname;
             payload8.users[i].properties.phoneNo=pnum;
           }
         }
         */
         var uid=conv.user.raw.userId;
         var sq="select shopname from assistant_users where uid='"+uid+"'";
         var sname;
         if(mysql){
          mysql.query(sq, function(err,result,field){
              sname=result[0].shopname;
          //console.log(sname);
          //console.log("phone number :"+pnum);   
          var uk;
          var sqlq="select unit_key from nstore_unit where unit_name= '"+sname+"'";
          
            mysql.query(sqlq, function(err,result,field){
              //console.log("unit key "+result[0].unit_key);
              uk=result[0].unit_key;
          // }
          //console.log("unit key outside"+uk);
          var sqlquery="select * from nstore_customer_master where cus_phone="+pnum+" and unit_key="+uk;
          ///var sqlquery="select * from nstore_customer_master where cus_phone=7401127559 and unit_key=10174";
          // if(mysql){
            //console.log(sqlquery);
           if(!err){
            var qr = mysql.query(sqlquery, function(err,resu,field){
                //console.log("some row "+ typeof resu);
                 if(resu && resu.length > 0){
                   var sq="select cus_name from nstore_customer_master where cus_phone= '"+pnum+"'";
                   //console.log(sq);
                   mysql.query(sq,function(err,result,field){ 
                     //console.log(err);
                    if(!err){
                      //console.log(result);
                      var nm=result[0].cus_name;
                    var w="Hello "+nm+". Do you want to know your order status? If so please tell me the product name. You can also view your orders";
                    payload2.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                    res.json(payload2);
                    // var respon={"fulfillmentMessages" : [{ "text":{"text":[w]}}]};
                      //res.json(respon);
                   }
                  })
                 }
                 else{
                    var w="Sorry you dont seem to have a registered mobile number with the shop. Try another number.";
                    //var respon={"fulfillmentMessages" : [{ "text":{"text":[w]}}]};
                      //res.json(respon);
                      var tem=JSON.parse(JSON.stringify(payload2));
                      tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                      tem.payload.google.expectUserResponse=false;
                      res.json(tem);
                 }
            })
          }
          })
         })
         var sqw="update assistant_users set phoneNo='"+pnum+"' where uid='"+uid+"'";
         mysql.query(sqw, function(err,result,field){
               if(!err)
                  console.log("user phone number updated");
               else
                  console.log(err);
         });
        }
      }
      
      function getnewInfo(){
          //var paramsn=agent.context.get("shopnam").parameters; 
          //var sname=paramsn.shops;
          var sname;
          /*
          for(var i=0;i<payload8.users.length;i++){
            if(payload8.users[i].uid===conv.user.raw.userId){
              sname=payload8.users[i].properties.shopname;
            }
          }
          */
           //console.log(sname);  
           var uid=conv.user.raw.userId;
           var sq="select shopname from assistant_users where uid='"+uid+"'";
           if(mysql){
            mysql.query(sq, function(err,result,field){
            var uk;
            sname=result[0].shopname;
            var sqlq="select unit_key from nstore_unit where unit_name= '"+sname+"'";
          
            mysql.query(sqlq, function(err,result,field){
              //console.log("unit key "+result[0].unit_key);
              uk=result[0].unit_key;

              var dat=new Date();
              var currdat = dat.toISOString().slice(0,10).replace(/-/g,"");

             var sqlr="select *from nstore_offers where valid_to >= "+currdat+" and unit_key='"+uk+"'";
              //var sqlqr="select * from nstoreb2cuat.tbl_banner_master where store_id= '"+uk+"' and status= 'A'";
              mysql.query(sqlr,function(err,result,field){
                  //console.log(result);
                   if(result.length > 0){
                      
                      //respon.fulfillmentMessages.push({'text':{'text':[w]}});
                      var w="Here are a few offers in this shop. Have a look.\n";
                      for (var i=0; i< result.length; i++)
                      {
                        //console.log(result[i]);
                        var off;
                        var minAmt=result[i].min_purchase_amount; 
                        if(result[i].discount_amount>0){
                           off=result[i].discount_amount;
                           w+=("If you shop for atleast Rs."+minAmt+" ,you get discount of Rs."+off);   
                        }
                        else if(result[i].discount_percent>0){
                           off=result[i].discount_percent;
                           w+=("If you shop for atleast Rs."+minAmt+" ,you get "+off+"% off.");
                        }
                        if(result[i].single_use===1)
                           w+=("You can use this offer only once, till the offer ends.");
                        var t=result[i].valid_to;
                        var tlDat=t.slice(6,8)+"/"+t.slice(4,6)+"/"+t.slice(0,4);
                      
                           w+=("The offer stands valid till "+tlDat+"\n");
                      //  console.log(w);
                       
                      //respon.fulfillmentMessages.push({'text':{'text':[w]}});
                    
                     } 
                     //payload1.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url=result[0].banner_url;
                     
                     var tem=JSON.parse(JSON.stringify(payload2));
                      tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                      tem.payload.google.expectUserResponse=false;
                      res.json(tem);
                      //res.json(respon);
                   }

                   else{
                    var w="Sorry. There are no current offers.\n";
                    var tem=JSON.parse(JSON.stringify(payload2));
                      tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                      tem.payload.google.expectUserResponse=false;
                      res.json(tem);
                    //var respon={"fulfillmentMessages" : [{ "text":{"text":[w]}}]};
                    //res.json(respon);
                   }
              })
            })
          })
         }
   }

    function getMyOrders(){
      //var paramsn=agent.context.get("verified").parameters; 
      //var pnum=paramsn['phone-number'];
      //var paramsn1=agent.context.get("shopnam").parameters; 
      //var sname=paramsn1.shops;
      /*
      var pnum;
      var sname;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
             pnum=payload8.users[i].properties.phoneNo;
             sname=payload8.users[i].properties.shopname;
        }
      }
        */
      var uid=conv.user.raw.userId;
           var sq="select shopname,phoneNo from assistant_users where uid='"+uid+"'";
     if(mysql){
            mysql.query(sq, function(err,result,field){
      //console.log(sname);
           var sname=result[0].shopname;
           var pnum=result[0].phoneNo;
           var sqlquery="select unit_key from nstore_unit where unit_name= '"+sname+"'";
      
           mysql.query(sqlquery, function(err,result,field){
          //console.log("unit key "+result[0].unit_key);
           uk=result[0].unit_key;
           var sqlq="select ord_date,order_status,payment_status,payment_amount,group_concat(product_name) as products_name from nstore_sales_order a,nstore_sales_order_items b where a.so_key=b.so_key_ref and cus_phone='"+pnum+"' and unit_key='"+uk+"' group by so_key order by ord_date desc limit 3";
           mysql.query(sqlq, function(err,result,field){
            var tem=JSON.parse(JSON.stringify(payload3));
            if(result.length>0){
              tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech="Here are your recent orders.";
              tem.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Product ordered',"horizontalAlignment": "CENTER"}); 
              //tem.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Status'});
              tem.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Purchase amount',"horizontalAlignment": "CENTER"});
              tem.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Order placed on',"horizontalAlignment": "CENTER"});
              for(var i=0;i<result.length;i++)
            {
             var pnam=result[i].products_name;
             var pstatus=result[i].payment_status;
             var ostatus=result[i].order_status;
             var amt=result[i].payment_amount;
             var odate=result[i].ord_date;
             var odat = odate.slice(6,8)+"/"+odate.slice(4,6)+"/"+odate.slice(0,4);
             tem.payload.google.richResponse.items[1].tableCard.rows.push({"dividerAfter":"true" ,cells:[]});
             tem.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':pnam});
             //tem.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':ostatus});
             tem.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':amt});
             tem.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':odat});
          } 
        res.json(tem);
        }
        else{
             var w="You have not yet purchased anything here."
             var tem=JSON.parse(JSON.stringify(payload2));
             tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
             tem.payload.google.expectUserResponse=false;
             res.json(tem);
         }  
       })
     })
    })
    }
  }

    function getTrendy(){
      
      //var paramsn=agent.context.get("shopnam").parameters;
      //var sname=paramsn.shops;
      /*
      for(var i=0;i<payload8.users.length;i++){
         
        if(payload8.users[i].uid===conv.user.raw.userId){
          console.log(payload8.users[i].properties);
          var sname=payload8.users[i].properties.shopname;
        }
      }
      console.log(sname);
      */
     var uid=conv.user.raw.userId;
     var sq="select shopname from assistant_users where uid='"+uid+"'";
    if(mysql){
       mysql.query(sq, function(err,result,field){
         console.log(result);
       var sname=result[0].shopname;
       var sqlquery="select unit_key from nstore_unit where unit_name='"+sname+"'";
        mysql.query(sqlquery, function(err,result,field){
              var uk=result[0].unit_key;
              var sqlq="select distinct item_name,price from nstoreb2cbeta.tbl_trendingnow a,nstoreb2cbeta.tbl_item_master b where a.unit_key=b.store_id and unit_key='"+uk+"' and a.item_code=b.item_code";
              mysql.query(sqlq, function(err,result,field){
                var tem=JSON.parse(JSON.stringify(payload4)); 
                if(result.length > 0){
                  tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech="These are the trending products now.";
                  tem.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Product Name'}); 
                  tem.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Price'});
                    for(var i=0;i<result.length;i++)
                    {
                     var item=result[i].item_name;
                     var price=result[i].price;
                     tem.payload.google.richResponse.items[1].tableCard.rows.push({"dividerAfter":"true" ,cells:[]});
                     tem.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':item});
                     tem.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':price});
                    } 
              res.json(tem);
                }
                else{
                   var w="No trending products";
                   var tem=JSON.parse(JSON.stringify(payload2));
                   tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                   tem.payload.google.expectUserResponse=false;
                   res.json(tem);
                }
              })
          })
        })
      }
    }
    
    function getTrendy1(){
      var paramsn=agent.context.get("shopnam").parameters; 
      var sname=paramsn.shops;
     // console.log(sname);
      var sqlquery="select unit_key from nstore_unit where unit_name='"+sname+"'";
      if(mysql){
        mysql.query(sqlquery, function(err,result,field){
              var uk=result[0].unit_key;
              var sqlq="select distinct item_name,price,a.item_code from nstoreb2cbeta.tbl_trendingnow a,nstoreb2cbeta.tbl_item_master b where a.unit_key=b.store_id and unit_key='"+uk+"' and a.item_code=b.item_code";
              mysql.query(sqlq, function(err,result,field){
                // use payload 5 to use a listResponse and set option key as the item_code. Inside the function getAppImg catch that key clicked by user and use it to query the link for that product and display that link in the form of a button
                
                if(result.length > 0){
                  payload4.payload.google.richResponse.items[0].simpleResponse.textToSpeech="These are the trending products now.";
                  payload4.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Product Name'}); 
                  payload4.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Price'});
                    for(var i=0;i<result.length;i++)
                    {
                     var item=result[i].item_name;
                     var price=result[i].price;
                     payload4.payload.google.richResponse.items[1].tableCard.rows.push({"dividerAfter":"true" ,cells:[]});
                     payload4.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':item});
                     payload4.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':price});
                    } 
              res.json(payload4);
                }
                else{
                        var w="No trending products";
                        payload2.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                        res.json(payload2);
                }
              })
        })
      }
    }

    function getAllProds(){
      //var paramsn=agent.context.get("shopnam").parameters; 
      //var sname=paramsn.shops;
      /*
      var sname;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
            sname=payload8.users[i].properties.shopname;
        }
      }
      */
     var uid=conv.user.raw.userId;
     var sq="select shopname from assistant_users where uid='"+uid+"'";
    if(mysql){
        mysql.query(sq, function(err,result,field){
       var sname=result[0].shopname;
       var sqlquery="select unit_key from nstore_unit where unit_name='"+sname+"'";
      //res.json(payload5);
       var tem=JSON.parse(JSON.stringify(payload1));
        mysql.query(sqlquery, function(err,result,field){
          var uk=result[0].unit_key;
          var sqlq="select count(*) as cnt from nstoreb2cbeta.tbl_item_master where store_id='"+uk+"'";  
          mysql.query(sqlq, function(err,result,field){
            var tem=JSON.parse(JSON.stringify(payload1));
            if(result.length > 0){
                tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech="There are "+result[0].cnt+" products available at "+sname; 
                tem.payload.google.richResponse.items[1].basicCard.title=sname;
                tem.payload.google.richResponse.items[1].basicCard.formattedText="Go to app for detailed listing of all products";
                tem.payload.google.richResponse.items[1].basicCard.buttons[0].title="click here to go to the app";
                tem.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url="https://play.google.com/store/apps/details?id=com.nstore.b2c.naturevillage&unitKey="+uk;  //use variable uk for unit key and replace this link with the link of the landing page url.
                res.json(tem);
                
            }
            else{
              var w="No products available";
              var tem=JSON.parse(JSON.stringify(payload2));
              tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
              tem.payload.google.expectUserResponse=false;
              res.json(tem);
            }
          })
        })
       })
      }
    }

    function getStoreLoc(){
      let KEY = req.body.originalDetectIntentRequest.payload.inputs[0].arguments[0].textValue;
      console.log(KEY);
      if(KEY!="yes" && KEY!="no" && KEY!="YES" && KEY!="NO"){
      var tem=JSON.parse(JSON.stringify(payload1));
      var murl="";
      var sqlquery="select concat(address1,address2,address3,city) as address from nstore_unit_address where unit_key='"+KEY+"'"; // instead of this, access latitude and longtitude
       if(mysql){
        mysql.query(sqlquery, function(err,result,field){
           if(result.length > 0){
             //var encurl=result[i].address;
             lat=13.039621;
             lon=80.177671;
             // For now i am taking the lat and lon of nstore
             var encurl=lat+","+lon;
             var pid="ChIJz88VLi9hUjoRsOaSBOW3oC8"; //place id of nstore
            murl="https://www.google.com/maps/search/?api=1&query="+encurl+"&query_place_id="+pid; // encurl contains location encoded value of the store
            var sqlq="select unit_name from nstore_unit where unit_key="+KEY;
            mysql.query(sqlq, function(err,result,field){
              //console.log(result);
              tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech="Want to know where it is?";
              tem.payload.google.richResponse.items[1].basicCard.title=result[0].unit_name;
              tem.payload.google.richResponse.items[1].basicCard.formattedText=" ";
              tem.payload.google.richResponse.items[1].basicCard.buttons[0].title="View on maps";
              tem.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url=murl;
              tem.payload.google.richResponse.items[2].simpleResponse.textToSpeech="Click the view button";
              //console.log(JSON.stringify(tem));
              res.json(tem);  
            })
            //console.log(JSON.stringify(tem)); 
            
          }
        })
      }
    }
    else{
       if(KEY=="yes"){
        var w="Thanks. Please enter the phone number.";
        payload2.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
        res.json(payload2);
       }
       else if(KEY=="YES"){
        var w="Cool. Please enter the phone number.";
        payload2.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
        res.json(payload2);
       }
       else if(KEY=="no"){
        var w="Thanks for your time.";
        var temp=JSON.parse(JSON.stringify(payload2));
        temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
        temp.payload.google.expectUserResponse=false;
        res.json(temp);
        sendIssueEmail();
       }
       else if(KEY=="NO"){
        var w="Thanks for your time.";
        var temp=JSON.parse(JSON.stringify(payload2));
        temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
        temp.payload.google.expectUserResponse=false;
        res.json(temp);
       }
    }
  }

    function getAllCateg(){
      //var paramsn=agent.context.get("shopnam").parameters; 
      //var sname=paramsn.shops;
      /*
      var sname;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
            sname=payload8.users[i].properties.shopname;
        }
      }
      */
     var uid=conv.user.raw.userId;
     var sq="select shopname from assistant_users where uid='"+uid+"'";
    if(mysql){
       mysql.query(sq, function(err,result,field){
       var sname=result[0].shopname;
       var sqlquery="select unit_key from nstore_unit where unit_name='"+sname+"'";
      //res.json(payload5);
        mysql.query(sqlquery, function(err,result,field){
          var uk=result[0].unit_key;
          var sqlq="select count(*) as cnt from nstoreb2cbeta.tbl_category_master where store_id='"+uk+"'";  
          mysql.query(sqlq, function(err,result,field){
            var tem=JSON.parse(JSON.stringify(payload1));
            if(result.length > 0){
                tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech="There are "+result[0].cnt+" product categories available at "+sname; 
                tem.payload.google.richResponse.items[1].basicCard.title=sname;
                tem.payload.google.richResponse.items[1].basicCard.formattedText="Go to app for detailed listing of all product categories";
                tem.payload.google.richResponse.items[1].basicCard.buttons[0].title="click here to go to the app";
                tem.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url="https://play.google.com/store/apps/details?id=com.nstore.b2c.naturevillage&unitKey="+uk;  //landing page
                res.json(tem);
            }
            else{
              var w="No product category available";
              var tem=JSON.parse(JSON.stringify(payload2));
              tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
              tem.payload.google.expectUserResponse=false;
              res.json(tem);
            }
          })
        })
       })
      }
    }

    function getProdStatus(){
      //var paramsn=agent.context.get("shopnam").parameters; 
      //var sname=paramsn.shops;
      //var paramsn1=agent.context.get("verified").parameters; 
      //var pnum=paramsn1['phone-number'];
      /*
      var pnum;
      var sname;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
             pnum=payload8.users[i].properties.phoneNo;
             sname=payload8.users[i].properties.shopname;
        }
      }
      */
     var uid=conv.user.raw.userId;
     var sq="select shopname,phoneNo from assistant_users where uid='"+uid+"'";
     if(mysql){
        mysql.query(sq, function(err,result,field){
        var sname=result[0].shopname;
        var pnum=result[0].phoneNo;
        var prod=params.prod;
        var sqlquery="select unit_key from nstore_unit where unit_name='"+sname+"'";
        var temp6=JSON.parse(JSON.stringify(payload6));
      //res.json(payload5);
        mysql.query(sqlquery, function(err,result,field){
          var uk=result[0].unit_key;
          var ad;
          var sqlq="select ord_date,order_status,payment_amount,group_concat(product_name) as products_name from nstore_sales_order a,nstore_sales_order_items b where a.so_key=b.so_key_ref and cus_phone='"+pnum+"' and unit_key='"+uk+"' and product_name like '%"+prod+"%' group by so_key order by ord_date desc";
          console.log(sqlq);
          mysql.query(sqlq, function(err,result,field){
            if(result.length > 0){
                      
                        temp6.payload.google.richResponse.items[0].simpleResponse.textToSpeech="Products matching your order :";
                        temp6.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Product ordered'}); 
                        temp6.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Status'});
                        temp6.payload.google.richResponse.items[1].tableCard.columnProperties.push({'header':'Order placed on'});
              
                        for(var i=0;i<result.length && i<3;i++)
                        {
                         var pnam=result[i].products_name;
                         var status=result[i].order_status;
                         //if(status='')
                         var odate=result[i].ord_date;
                         var odat = odate.slice(6,8)+"/"+odate.slice(4,6)+"/"+odate.slice(0,4);
                         temp6.payload.google.richResponse.items[1].tableCard.rows.push({"dividerAfter":"true" ,cells:[]});
                         temp6.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':pnam});
                         temp6.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':status});
                         temp6.payload.google.richResponse.items[1].tableCard.rows[i].cells.push({'text':odat});
                         }
                      if(result.length > 3){
                          temp6.payload.google.richResponse.items[0].simpleResponse.textToSpeech="These are products matching your order. You seem to have more matching orders for the same product.Please check the status in the app for clarity.";   
                      }
                       res.json(temp6);
                       //payload6.payload.google.richResponse.items[1].tableCard.columnProperties=[];
                       //payload6.payload.google.richResponse.items[1].tableCard.rows=[];
                }
                else{
                  var w="Sorry. Unable to search a product like : "+prod+"..";
                  var tem=JSON.parse(JSON.stringify(payload2));
                  tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                  tem.payload.google.expectUserResponse=false;
                  res.json(tem);
                }
          })
        })
      })
      }
    }

    function getStoreList(){
        var prod=params.pnam;
        
        var sqlquery="select distinct a.unit_key,unit_name from nstore_master_item a,nstore_unit b where short_desc like '%"+prod+"%' and a.unit_key=b.unit_key";
        if(mysql){
          mysql.query(sqlquery, function(err,result,field){  
               //console.log(result);
                if(result.length > 0){
                    var cnt=result.length;
                    
                    if(result.length===1){
                      var tem=JSON.parse(JSON.stringify(payload1));
                      tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech="There is only 1 store having products related to "+prod+"."; 
                      tem.payload.google.richResponse.items[1].basicCard.title=result[0].unit_name;
                      tem.payload.google.richResponse.items[1].basicCard.formattedText=" ";
                      tem.payload.google.richResponse.items[1].basicCard.buttons[0].title="click here to view on maps";
                      lat=13.039621;
                      lon=80.177671;
                         // For now i am taking the lat and lon of nstore
                      var encurl=lat+","+lon;
                      var pid="ChIJz88VLi9hUjoRsOaSBOW3oC8"; //place id of nstore
                      murl="https://www.google.com/maps/search/?api=1&query="+encurl+"&query_place_id="+pid; // encurl contains location encoded value of the store
                      tem.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url=murl;
                      res.json(tem);
                    }
                    else{
                      var temp=JSON.parse(JSON.stringify(payload5));
                      temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech="There are about "+cnt+" stores having products related to "+prod+". Here are a few: ";
                      for(var i=0;i<result.length && i<3;i++)
                     {
                      var uk=result[i].unit_key;
                      console.log(uk);
                      uk=uk.toString();
                        temp.payload.google.systemIntent.data.listSelect.items.push({'optionInfo' : {'key': uk},'description' : "",'title' : result[i].unit_name});
                        //temp.payload.google.systemIntent.data.listSelect.items[i].optionInfo.key=uk;
                        //temp.payload.google.systemIntent.data.listSelect.items[i].title=result[i].unit_name;
                        //console.log(JSON.stringify(temp));
                        
                       }
                       res.json(temp);
                   }
                    //console.log(JSON.stringify(temp));
                  }
                  else{
                    var w="Sorry. Unable to search a product like : "+prod+"..";
                    var tem=JSON.parse(JSON.stringify(payload2));
                    tem.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                    tem.payload.google.expectUserResponse=false;
                    res.json(tem);      
                  }
          })
        }
    }
    
    function checkUser(){
          var pnum=params.pnum;
          var sqlq="select * from nstore_customer_master where cus_phone='"+pnum+"'";
          if(mysql){
            mysql.query(sqlq, function(err,result,field){
                 if(result.length > 0){
                         var w="Thanks for your time.";
                         var temp=JSON.parse(JSON.stringify(payload2));
                         temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                         temp.payload.google.expectUserResponse=false;
                         res.json(temp); 
                         sendIssueEmailWithNum();     
                 }
                 else{
                  var temp=JSON.parse(JSON.stringify(payload2));
                  var w="Thanks for your time.";
                  temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
                  temp.payload.google.expectUserResponse=false;
                  res.json(temp);
                  sendIssueEmailNewUser();
                 }
            })
          }    
    }
    function sendIssueEmailNewUser(){
      //var paramsn=agent.context.get("feedb").parameters;
      //var iss=paramsn.para;
      //var paramsn1=agent.context.get("isnam").parameters;
      //var snam=paramsn1.snam;
      /*
      var snam;
      var iss;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
             iss=payload8.users[i].properties.feedback;
             snam=payload8.users[i].properties.shopname;
        }
      }
      */
     var uid=conv.user.raw.userId;
     var sq="select shopname,feedback from assistant_users where uid='"+uid+"'";
     if(mysql){
        mysql.query(sq, function(err,result,field){
        var snam=result[0].shopname;
        var iss=result[0].feedback;
      var dat=new Date();
      var currdat = dat.toString();
      var pnum=params.pnum;
      var w="Name :    "+"\n"+"Email :    "+"\n"+"Customer phone number :    "+pnum+"\n"+"Store Name :    "+snam+"\n"+"Feedback :    "+iss+"\n"+"Feedback Time & Date :    "+currdat;
      mailOptions.subject="FEEDBACK";
      mailOptions.text=w;
             transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log("MAIL ERROR:");
                console.log(error);
              }
              else {
                console.log('Email sent: ' + info.response);
              }
          })
        })
      }
    }
    function sendIssueEmail(){
      //var paramsn=agent.context.get("feedb").parameters;
      //var iss=paramsn.para;
      //var paramsn1=agent.context.get("isnam").parameters;
      //var snam=paramsn1.snam;
      /*
      var snam;
      var iss;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
             iss=payload8.users[i].properties.feedback;
             snam=payload8.users[i].properties.shopname;
        }
      }
      */
     var uid=conv.user.raw.userId;
     var sq="select shopname,feedback from assistant_users where uid='"+uid+"'";
     if(mysql){
        mysql.query(sq, function(err,result,field){
        var snam=result[0].shopname;
        var iss=result[0].feedback;

      var dat=new Date();
      var currdat = dat.toString()
      var w="Name :    "+"\n"+"Email :    "+"\n"+"Customer phone number :    "+"\n"+"Store Name :    "+snam+"\n"+"Feedback :    "+iss+"\n"+"Feedback Time & Date :    "+currdat;
      mailOptions.subject="FEEDBACK";
      mailOptions.text=w;
             transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log("MAIL ERROR:");
                console.log(error);
              }
              else {
                console.log('Email sent: ' + info.response);
              }
          })
        })
      }
  }

  function sendIssueEmailWithNum(){
    //var paramsn=agent.context.get("feedb").parameters;
    //var iss=paramsn.para;
    //var paramsn1=agent.context.get("isnam").parameters;
    //var snam=paramsn1.snam;
    /*  
    var snam;
      var iss;
      for(var i=0;i<payload8.users.length;i++){
        if(payload8.users[i].uid===conv.user.raw.userId){
             iss=payload8.users[i].properties.feedback;
             snam=payload8.users[i].properties.shopname;
        }
      }
    */
   var uid=conv.user.raw.userId;
   var sq="select shopname,feedback from assistant_users where uid='"+uid+"'";
   if(mysql){
      mysql.query(sq, function(err,result,field){
      var snam=result[0].shopname;
      var iss=result[0].feedback;
    var pnum=params.pnum;
    var sqlq="select cus_name,email from nstore_customer_master where cus_phone='"+pnum+"'";
    var dat=new Date();
    var currdat = dat.toString()
      mysql.query(sqlq, function(err,result,field){
        if(result.length > 0){
           var name=result[0].cus_name;
           var emailid=result[0].email;
           var w="Name :    "+name+"\n"+"Email :    "+emailid+"\n"+"Customer phone number :    "+pnum+"\n"+"Store Name :    "+snam+"\n"+"Feedback :    "+iss+"\n"+"Feedback Time & Date :    "+currdat;
           mailOptions.subject="FEEDBACK";
           mailOptions.text=w;
           transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log("MAIL ERROR:");
              console.log(error);
            }
            else {
              console.log('Email sent: ' + info.response);
            }
        })
      }
    })
   })
  }
 }
   
  function getYesNo(){
          var feedb=params.para;
          /*
          var f=0;
          for(var i=0;i<payload8.users.length;i++){
             
              if(conv.user.raw.userId === payload8.users[i].uid){
                 f=1;
                  payload8.users[i].properties.feedback=feedb;
                  break;
               }  
           }
           if(f===0){
             payload8.users.push({ 'uid': conv.user.raw.userId,'properties':{'shopname':{},'phoneNo':{},'feedback':{}}});
             payload8.users[payload8.users.length-1].properties.feedback=feedb;                 
           }
           */
          var uid=conv.user.raw.userId;
          var sq="select * from assistant_users where uid='"+uid+"'";
          if(mysql){
          mysql.query(sq, function(err,result,field){
               if(result.length >0){
                     var sqlq="update assistant_users set feedback='"+feedb+"' where uid='"+uid+"'";
                     mysql.query(sqlq, function(err,result,field){
                           if(!err)
                             console.log("user feedback updated");
                           else
                             console.log(err);
                     });
               }
               else{
                var sqlq="insert into assistant_users (uid,feedback) values ('"+uid+"','"+feedb+"')";
                mysql.query(sqlq, function(err,result,field){
                  if(!err)
                    console.log("user feedback inserted");
                  else
                    console.log(err);
               });
             }
       var s="Done. We have received your feedback and we will look into it.We would like to get back to you in case of any updates. Do you wish to provide your mobile number for the same?";
       var temp=JSON.parse(JSON.stringify(payload7));
       temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=s; 
       temp.payload.google.systemIntent.data.listSelect.items[0].optionInfo.key="yes";
       temp.payload.google.systemIntent.data.listSelect.items[0].title="YES";
       temp.payload.google.systemIntent.data.listSelect.items[1].optionInfo.key="no";
       temp.payload.google.systemIntent.data.listSelect.items[1].title="NO";
       res.json(temp);
      })
    }
  }

  function getYesNo1(){
    var s="Please enter your mobile number registered with this store. This is to verify if you are a valid customer of this shop. We will make use of this number to help you with service related queries.Do you wish to proceed?";
    var temp=JSON.parse(JSON.stringify(payload7));
    temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=s;
    temp.payload.google.systemIntent.data.listSelect.items[0].optionInfo.key="YES";
    temp.payload.google.systemIntent.data.listSelect.items[0].title="YES";
    temp.payload.google.systemIntent.data.listSelect.items[1].optionInfo.key="NO";
    temp.payload.google.systemIntent.data.listSelect.items[1].title="NO";
    res.json(temp);
  }
  
   function issueStore(){
      //console.log("inisde issue store");
      var snam=params.snam;
      /*
      var f=0;
          for(var i=0;i<payload8.users.length;i++){
             
              if(conv.user.raw.userId === payload8.users[i].uid){
                 f=1;
                  payload8.users[i].properties.shopname=snam;
                  break;
               }  
           }
           if(f===0){
             payload8.users.push({ 'uid': conv.user.raw.userId,'properties':{'shopname':{},'phoneNo':{},'feedback':{}}});
             payload8.users[payload8.users.length-1].properties.shopname=snam;                 
           }
           */
          var uid=conv.user.raw.userId;
          var sq="select * from assistant_users where uid='"+uid+"'";
          mysql.query(sq, function(err,result,field){
               if(result.length >0){
                     var sqlq="update assistant_users set shopname='"+snam+"' where uid='"+uid+"'";
                     mysql.query(sqlq, function(err,result,field){
                           if(!err)
                             console.log("user updated");
                           else
                             console.log(err);
                     });
               }
               else{
                var sqlq="insert into assistant_users (uid,shopname) values ('"+uid+"','"+snam+"')";
                mysql.query(sqlq, function(err,result,field){
                  if(!err)
                    console.log("user inserted");
                  else
                    console.log(err);
            });
               }
          })
           var temp=JSON.parse(JSON.stringify(payload2));
           var w="Please enter the feedback.";
           temp.payload.google.richResponse.items[0].simpleResponse.textToSpeech=w;
           res.json(temp);
   }
}