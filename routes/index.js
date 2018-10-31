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
var pasUrl ='mongodb://127.0.0.1:27017/padb';

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
  var newuser ={name: req.body.name, email: req.body.email};
  console.log('newuser ', newuser);

  collection.insert([newuser], function(err, result){
    if(err){
      console.log('The new user did not update', err);
      db.close();
    }else{
      
    
    db.close();

    MongoClient.connect(pasUrl, function(err, pasdb){
      if(err){
        console.log('Unable to connect to the server', err);
      
      }else{
        try{ 
        var pascollection = pasdb.db('padb').collection('uh');
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          pascollection.insert([{email: req.body.email, key: hash}]);
          pasdb.close();
        });
      }catch(error){
        console.log("pas error", error);
      };
      };
    });
    res.redirect('users');
    }
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

}else{ 
  var mydb = db.db('usersdb');
  var collection = mydb.collection('userslist');
  var checkUser ={password: req.body.password, email: req.body.email};
  var loginUser ={email: req.body.email};

MongoClient.connect(pasUrl, function(err, pasdb){
  if(err){
    console.log('Unable to connect to the server', err);
  
  }else{
    try{ 
    var pascollection = pasdb.db('padb').collection('uh');
    var testKey= pascollection.findOne({email: req.body.email});
    console.log('The test key ',testKey.key);

    bcrypt.compare(req.body.password, testKey, function(err, response) {
      if(response){     
      res.redirect('users');
      pasdb.close();
      
      collection.update({email:loginUser},{$inc:{loginSuccessfully: +1}})
      db.close();
      }else{
        console.log('The password is not corect');
        pasdb.close();
        collection.update({email:loginUser},{$inc:{loginUnsuccessfully: +1}})
        db.close();
      }
      
    });
  }catch(error){
    console.log("pas error", error);
  };
  };
});
} 
});
});
module.exports = router;
