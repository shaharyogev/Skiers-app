const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


const MongoClient = mongodb.MongoClient;
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';

MongoClient.connect(usersdbUrl, function(err, db){
  if(err) throw err;
  const mydb = db.db('usersdb');
  


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/users',function(req,res){
  console.log('users was calld ')
  const collection = mydb.collection('userslist');
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
  });
});



router.get('/newuser', function(req, res){
  res.render('newuser', {title:'Add User'});
});


router.post('/adduser', function(req, res){
  const collection = mydb.collection('userslist');
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  var newuser ={name: req.body.name, email: req.body.email, key: hash};
  collection.insert([newuser], function(err, result){
    if(err) throw err
    res.redirect('users');
  });
 });
});


router.get('/login', function(req, res){
  res.render('login', {title:'Hi User'});
});


router.post('/loginattempt', function(req,res){
let loginUser ={email: req.body.email};
const collection = mydb.collection('userslist');
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
      }});
      res.render('userprofile', loginUser);
    }else{
    collection.updateOne(loginUser,{$inc:{loginUnsuccessfully: +1},function(err, res){
      if(err) throw err;
      console.log('The password is not corect');
    }});
   } 
  });
 });
});

/*
router.post('/userprofile', function(req, res){
  let userEmail = req.body.email;
  const collection = mydb.collection('movieslist');
  collection.find({activeusers: userEmail} ,{projection: {_id:0, inventory:1}

  res.render('userprofile', {title:'Hi User'});
});
*/

router.get('/addmovie', function(req, res){
  res.render('addmovie',{title: 'Hi, add a new moive to the inventory', status: 'Waiting for submission'});
});

router.post('/addmovietodb', function(req, res){
  let newMovieTitle = {title: req.body.title};
  let movieTitle = req.body.title;
  let newInventory =  parseInt(req.body.inventory, 10);
  let newMovie = {title: movieTitle, inventory: newInventory};
  const collection = mydb.collection('movieslist');

  collection.find(newMovieTitle,{projection: {_id:0, inventory:1}
  }).toArray(function(err, result){
  if(err) throw err;
    console.log(result , ' is the result for new')
  
    if(result[0] === undefined){
    collection.insertOne(newMovie, function(err, success){
    if(err) throw err;
    if(success)
      console.log('The new movie was add to the database');
  });
  res.render('addmovie',{title: movieTitle + ' was add to the inventory as a new movie', status: 'Add another new moive to the inventory'});

  }else{
    console.log('find was successfule', result[0].inventory)
    console.log( newMovieTitle, ' newMovieTitle')
    collection.updateOne(newMovieTitle, { $inc: {inventory: newInventory}},function(err, success){
    if(err) throw err
    if(success)
      console.log( newMovieTitle, ' inventory was updated');
    });
    res.render('addmovie',{title: movieTitle +' inventory was updeted successfuly', status: ' Add another moive to the inventory'});
   };
  });
 });


router.get('/movies', function(req, res){
  const collection = mydb.collection('movieslist');
  collection.find({},{projection: {_id:0,title:1, inventory:1}
  }).toArray(function(err, result){
    if(err) throw err;

  res.render('movies',{'movieslist': result});
});
});

router.get('/rentamovie', function(req, res){
  res.render('rentamovie', {title:'Hi User'});
});

router.post('/submitrent', function(req, res){
  const collection = mydb.collection('movieslist');
  let newMovieTitle = {title: req.body.title};
  let movieTitle = req.body.title;
  let newInventory =  parseInt(req.body.inventory, 10);
  let userRenting =  {email: req.body.email, inventory: newInventory};
  let userEmail = {email: req.body.email};
  
  collection.find(newMovieTitle,{projection: {_id:0, inventory:1}
  }).toArray(function(err, result){
  if(err) throw err;
    console.log(result , ' is the result for new')
  if(result[0] === undefined){
    console.log('The movie is  out of stock');
  }else if(result[0].inventory < newInventory){
    let available = result[0].inventory;
    console.log('The available inventory is: ', available);
  }else{
    collection.updateOne(newMovieTitle, { $addToSet: {activeusers: userRenting}, $inc: {inventory: -newInventory}},function(err, success){
      if(err) throw err
      if(success)
        console.log( movieTitle, ' inventory was updated');
        
      });
    
  }
  res.render('movies',{'movieslist': result});
});
});


});

module.exports = router;
