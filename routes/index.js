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
  if(err) console.log(err.stack);
  const mydb = db.db('usersdb');
  const collection = mydb.collection('movieslist');
  
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
router.get('/users',function(req,res){
  console.log('users was calld ')
  
  const collectionu = mydb.collection('userslist');
  collectionu.find().toArray(function(err, result){
    if(err)
      res.send(err);

    else if(result.length)
      res.render('users',{"userslist" : result}),
      console.log('result ', result);
    
    else 
      res.send('No documents found');
    
  });
});


router.get('/newuser', function(req, res){
  res.render('newuser', {title:'Add User'});
});

router.post('/adduser', function(req, res){
  const collectionu = mydb.collection('userslist');
  
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    var newuser ={name: req.body.name, email: req.body.email, key: hash};
  
    u.insert([newuser], function(err, result){
      if(err) console.log(err.stack)
      res.redirect('users');
  });
 });
});


router.get('/login', function(req, res){
  res.render('login', {title:'Hi User'});
});


router.post('/loginattempt', function(req,res){
  let loginUser ={email: req.body.email};
  const collectionu = mydb.collection('userslist');
  
  collectionu.find( loginUser,{ projection: { _id:0, key:1 }}).toArray(function(err, result){
    if(err) console.log(err.stack);
    
    console.log(result[0].key);
    bcrypt.compare(req.body.password, result[0].key, function(err, response) {
    console.log('bcrypt response: ', response)
    
    if(response){
      collectionu.updateOne( loginUser, { $inc: { loginSuccessfully: + 1 },function(err, res){
        if(err)throw err;
        console.log('The password is corect');
      }});
      res.render('userprofile', loginUser);
    
    }else{
    collectionu.updateOne( loginUser,{ $inc: { loginUnsuccessfully: + 1 },function(err, res){
      if(err) console.log(err.stack);
      console.log('The password is not corect');
      }});
    } 
  });
 });
});

*/


function currentUserInventory(title, email, cb ){
  collection.findOne({title, email }, {
     projection: { _id: 0, 'activeUsers.inventory': 1 }},
     function(err, r ){
    if(err) 
      console.log(err);

    if(r === null)
      cb = 0
    
    else
      cb = r[0].activeUsers[0].inventory;
  });
}





function currentMovieInventory(title, cb ){
  collection.find({ title: title }, { projection: { _id: 0, inventory: 1 }}).toArray(function(err, r){
    if(err) console.log(err);

    if(r === null)
      cb = 0;
    
    else
      console.log(r),
      cb = r.inventory;
  });
}




function inventoryStatus(title, status, res){

  collection.find( {} ,{projection: {_id:0, title:1, inventory:1 }}).sort({ inventory: -1 }).limit(10).toArray(function(err, cb ){
    if(err) console.log(err);
    let moviesList = cb;

  collection.find( {} ,{projection: {_id:0, activeUsers:1, title:1 }}).filter({ 'activeUsers.inventory': { $gte: 1 } }).limit(10).toArray(function(err,cb ){
    if(err) console.log(err);
    let usersList = cb;
  
    res.render('movies',{movieslist: moviesList ,userslist: usersList, title: title, status: status});
    });
  });
}




function updateReturnedInventory(title, inventory, email, res){
  let query = {};
  let status = '';
  
  if (title)
    query.title = title;

  if (inventory)
    inventory = parseInt(inventory, 10)
    query['activeUsers.inventory'] = {$elemMatch: { $gte: inventory }};
  
  if (email)
    query['activeUsers.email'] = email.toLowerCase();

  console.log('query: ', query );

  collection.findOneAndUpdate(query ,{
    $inc:{'activeUsers.$.inventory': -inventory, inventory: inventory }},{
    upsert: false },
    function(err ,r){
      if(err) console.log(err);

      if(r.value == null)
        title = 'The movie: ' + title + ' wasnt returnd to stock!',
        status = 'The user: ' + email + ' cant return the amount of: ' + inventory + ' the current inventory for this user: ' + currentUserInventory(title, query['activeUsers.email'].email,0);

      if(r.value !== null )
        title = 'The movie: ' + title + ' was returnd to stock, the current stock is:' + (r.value.inventory + inventory),
        status = 'The user: ' + email + ' returnd ' + inventory;
      
      
      console.log('r: ', r);
      console.log('r: ', r.value);

      inventoryStatus(title, status, res);
    }
  )
}


function updateRentInventory(title, inventory, email, res ){
  let query = {};
  let status = '';
  
  if (title)
    query.title = title;

  if (inventory)
    inventory = parseInt(inventory, 10)
    query.inventory = { $elemMatch:{$gte:inventory}};
  
  if (email)
    email = email.toLowerCase(),
    //query.activeUsers = { $elemMatch:{ email: email }};

  console.log('query2: ', query );

  /*collection.find(query).toArray(function(err, r){
    console.log("r find: ", r);
  })*/

  collection.findOneAndUpdate( {query} ,{ $set:{'activeUsers.$.email': email},
    $inc: { 'activeUsers.$.inventory': inventory, inventory: -inventory }},{
    upsert: true },
    function(err ,r){
      if(err) console.log(err);

      console.log("r : ", r);
      
      if(r === null)
        title = 'The available inventory is:' + inventory + ' for ' + title,
        status = 'Please ask from : ' + email + ' to rduce the quantity or choose a difrent movie';

      else 
        title = title + ' inventory was updated to'+ ( r.value.inventory - inventory ),
        status = email + ' have ' +( r.value.activeUsers[0].inventory + inventory ) + ' include the ' + inventory + ' new copies';

      inventoryStatus(title, status, res);
    }
  )
}




function updateNewInventory(title, inventory, res ){
  let query = {};
  let status = '';
  let currentMovieI = 0;
  
  if (title)
    query.title = title;

  if (inventory)
    inventory = parseInt(inventory, 10),
    currentMovieInventory(title, currentMovieI);

  if( (currentMovieI + inventory) <= 0 )
    title = title + ' inventory was not update - inventory is too low',
    status = 'The maximum inventory to raduse is: '+ currentMovieI;


  else
    console.log("query new movie : ", query),
    collection.findOneAndUpdate(query ,{ $inc: { inventory: inventory }}, { upsert: true }, function(err ,r){
      if(err) console.log(err);
      
      console.log("r : ", r);

      if(r == null)
        title = 'The movie: ' + title + ' wasnt add to the Inventory!',
        status = 'There was a problem'
      
      else if(r.value !== null )
        title = title + ' inventory was updated successfuly',
        status = 'The inventory is: ' + ( currentMovieI + inventory );  
      
      else if(r.lastErrorObject.upserted !== null )
        title = title + ' is new, inventory updated successfuly',
        status = 'The inventory is: ' + ( currentMovieI + inventory );  

      inventoryStatus(title, status, res);
    });
}


router.get('/movies', function(req, res){
  inventoryStatus('This is the movies list','We got in stock: ', res);
});

router.post('/submitreturn', function(req, res){
  updateReturnedInventory(req.body.title, req.body.inventory, req.body.email,res);
});

router.post('/submitrent', function(req, res){
  updateRentInventory(req.body.title, req.body.inventory, req.body.email,res);
});

router.post('/addmovietodb', function(req, res){
  updateNewInventory(req.body.title, req.body.inventory, res);
});

});
module.exports = router;




/*
router.post('/addmovietodb', function(req, res){
  let newMovieTitle = {title: req.body.title};
  let movieTitle = req.body.title;
  let newInventory =  parseInt(req.body.inventory, 10);
  let newMovie = {title: movieTitle, inventory: newInventory};
  let status = '';
  let title = '';

  collection.find(newMovieTitle,{projection: {_id:0, inventory:1}
  }).toArray(function(err, result){
  if(err) console.log(err.stack);
  console.log('We find:', result)
  
  if(result[0] === undefined){
  collection.insertOne(newMovie, function(err, success){
  if(err) console.log(err.stack);
  if(success)
    console.log('The new movie was add to the database');
  });

  }else{
    if(result[0].inventory+newInventory <0){
      console.log('The minimum inventory to raduse is: '+ result[0].inventory)
      title = movieTitle +' inventory was not update - inventory is too low';
      status = 'The maximum inventory to raduse is: '+ result[0].inventory;

    }else{
    collection.updateOne(newMovieTitle, { $inc: {inventory: newInventory}},function(err, success){
    if(err) console.log(err.stack)
    if(success)
      console.log( newMovieTitle, ' inventory was updated');
    });
    title = movieTitle +' inventory was updated successfuly';
    status = ' Add another moive to the inventory';

    }
   }
 });

 (async function(){
  try{
  let moviesList = await collection.find({},{projection: {_id:0,title:1, inventory:1}}).sort({inventory:1}).limit(5).toArray();
  let usersList = await collection.find({},{projection: {_id:0, activeUsers:1, title:1}}).filter({'activeUsers.inventory':{$gte:1}}).limit(5).toArray();
  res.render('movies',{movieslist: moviesList ,userslist:usersList, title: title, status: status});
  }catch(err){
  console.log(err.stack);
}
})();
});






/*

router.post('/submitrent', function(req, res){

  let newMovieTitle = {title: req.body.title};
  let movieTitle = req.body.title;
  let newInventory =  parseInt(req.body.inventory, 10);
  let userRenting =  {email: req.body.email, inventory: newInventory};
  let status = '';
  let title = '';
  
  collection.find(newMovieTitle,{projection: {_id:0, inventory:1, activeUsers:1}
  }).toArray(function(err, result){
  if(err) console.log(err.stack);
    console.log('find :', result);

  if(result[0] === undefined){
    console.log('The movie is  out of stock');
    title = 'This movie is not available to rent '+req.body.title;
    status = 'Ask from '+req.body.email + ' to choose a difrent movie';

  }else if(result[0].inventory < newInventory){
    let available = result[0].inventory;
    console.log('The available inventory is: ', available);
    title = 'The available inventory is: '+ available +' for '+req.body.title;
    status = 'Ask from '+req.body.email + ' to rduce the quantity or choose a difrent movie';
    
  }else if( result[0].activeUsers === undefined){  
    collection.updateOne(newMovieTitle, { $addToSet: {activeUsers: userRenting}, $inc: {inventory: -newInventory}},function(err, success){
      if(err) console.log(err.stack)
      if(success)
      console.log( movieTitle, ' inventory was updated');
      });
      title = movieTitle +' inventory was updated to'+ result[0].inventory-newInventory ;
      status = req.body.email + ' got '+ newInventory+ ' copies';
    
      
  }else if( result[0].activeUsers[0].email === req.body.email){
    collection.findOneAndUpdate(
      {title: movieTitle}, 
      { $inc: {inventory: -newInventory, 'activeUsers.$[elem].inventory': newInventory}},
      {arrayFilters:[{'elem.email':req.body.email}]},
      function(err, success){
        if(err) console.log(err.stack)
        console.log("success: ", success )
        console.log( movieTitle, ' inventory was updated by: ' +req.body.email);
        });

      title = movieTitle +' inventory was updated to'+ (result[0].inventory-newInventory) ;
      status = req.body.email +' have' +(result[0].activeUsers[0].inventory+newInventory) + ' include the new '+ newInventory+ ' copies';
  }


});
});
*/