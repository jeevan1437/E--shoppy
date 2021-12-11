var express=require("express");
var bodyParser=require("body-parser");
var mongoose = require('mongoose');
var bcrypt = require("bcryptjs");


mongoose.connect('mongodb://localhost:27017/signupdetails');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
   console.log("connection succeeded");
})
var app=express()

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({
   extended: true
}));

app.post("/login",(req,res)=>{

   var email = req.body.email;
   var password = req.body.password;
   var pass
   
   
   db.collection('detail').findOne(
   {
   "email" : email
   }
   ,(err,collection)=>{
   if(err){
   throw err;
   }
   

   pass=collection.password;


   if(pass==password)
   {
   console.log("Record found Successfully");
   return res.redirect('index1.html');
   }
   
   else
   {
   console.log("Record not found!!");
   return res.redirect('notfound.html');
   }
   });
   
   });


app.post('/sign_up', function(req,res){

   bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
          // Store hash in your password DB.
          var name = req.body.name;
          var mobile = req.body.mobile;
          var email = req.body.email;
          var password = hash
          
          var data = {
             "name": name,
             "mobile":mobile,
             "email":email,
             "password":hash
          }
          
       
          db.collection('detail').insertOne(data,function(err, collection){
          if (err) throw err;
             console.log("Record inserted Successfully");
          });
          return res.redirect('index1.html');
      });
  });


});


app.get('/',function(req,res){
   res.set({
      'Access-control-Allow-Origin': '*'
   });
   return res.redirect('index.html');
}).listen(3000)

console.log("server listening at port 3000");