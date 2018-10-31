var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


var MongoClient = mongodb.MongoClient;
var userdbUrl = 'mongodb://127.0.0.1:27017/usersdb';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/users',function(req,res){
  console.log('users was calld ')

  MongoClient.connect(userdbUrl, function(err, db){
    if(err){
      console.log('Unable to connect to the server', err);
    }else{ 
      console.log('Connection Established', userdbUrl);

      var mydb = db.db('usersdb');
      var collection = mydb.collection('userslist');
      //console.log('collection ', collection);

      collection.find().toArray(function(err, result){
        if(err){
          res.send(err);
        }else if(result.length){
          res.render('users',{
            "userslist" : result
          });
          console.log('result ', result);
        }else{
          res.send('No documents found');
        }
        db.close();
      });
    }
  });
});


router.get('/newuser', function(req, res){
  res.render('newuser', {title:'Add User'});
});


router.post('/adduser', function(req, res){

MongoClient.connect(userdbUrl, function(err, db){
if(err){
  console.log('Unable to connect to the server', err);

}else{ 
  var mydb = db.db('usersdb');
  var collection = mydb.collection('userslist');
  var userPassword = "";

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    
  

  console.log('newuser ', hash);
  var newuser ={name: req.body.name, email: req.body.email, key: hash};
  console.log('newuser ', newuser);

  collection.insert([newuser], function(err, result){
    if(err){
      console.log('The new user did not update', err);
      
    }else{
      res.redirect('users');
    };
  });
  db.close();
    });
    }
  });
});


router.get('/login', function(req, res){
  res.render('login', {title:'Hi User'});
});



router.post('/loginattempt', function(req,res){
MongoClient.connect(userdbUrl, function(err, db){
if(err){
  console.log('Unable to connect to the server', err);
}

  var mydb = db.db('usersdb');
  var collection = mydb.collection('userslist');
  var loginUser ={email: req.body.email};

  collection.find(loginUser,{projection: {_id:0, key:1}
    }).toArray(function(err, result){
      if(err) throw err;
      console.log(result[0].key);
      bcrypt.compare(req.body.password, result[0].key, function(err, response) {
        console.log('bcrypt response: ', response)
        if(response){

          collection.updateOne(loginUser,{$inc:{loginSuccessfully: +1},function(err, res){
            if(err)throw err;
            console.log('The password is corect');
            res.redirect('users');

            db.close();
          }});
          

        }else{
        collection.updateOne(loginUser,{$inc:{loginUnsuccessfully: +1},function(err, res){
          if(err)throw err;
          console.log('The password is not corect');
          db.close();
        }});
        }
        
      });
      
    });

  });
});


module.exports = router;
