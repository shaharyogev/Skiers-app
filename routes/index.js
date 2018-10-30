var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/users',function(req,res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/usersdb';

  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the server', err);
    
    }else{ 
      console.log('Connection Established', url);

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
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/usersdb';

  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the server', err);
    
    }else{ 
      console.log('Connection Established', url);

      var mydb = db.db('usersdb');
      var collection = mydb.collection('userslist');
      //console.log('collection ', collection);

      var newuser ={name: req.body.name, email: req.body.email, password: req.body.password};
      console.log('newuser ', newuser);

      collection.insert([newuser], function(err, result){
        if(err){
          console.log('The new user did not update', err);
        
        }else{
          res.redirect('users');
        }
        db.close();
      });
    }
  });
});
module.exports = router;
