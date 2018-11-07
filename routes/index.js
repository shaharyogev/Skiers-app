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
const collection = mydb.collection('userslist');
collection.find(loginUser,{projection: {_id:0, key:1}
}).toArray(function(err, result){
  if(err) console.log(err.stack);
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
    if(err) console.log(err.stack);
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


router.post('/addmovietodb', function(req, res){
  let newMovieTitle = {title: req.body.title};
  let movieTitle = req.body.title;
  let newInventory =  parseInt(req.body.inventory, 10);
  let newMovie = {title: movieTitle, inventory: newInventory};
  let status = '';
  let title = '';
  const collection = mydb.collection('movieslist');

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
    title = movieTitle +' inventory was updeted successfuly';
    status = ' Add another moive to the inventory';

    }
   }
 });

 (async function(){
  try{
  let moviesList = await collection.find({},{projection: {_id:0,title:1, inventory:1}}).sort({inventory:1}).limit(5).toArray();
  let usersList = await collection.find({},{projection: {_id:0, activeusers:1, title:1}}).filter({'activeusers.inventory':{$gte:1}}).limit(5).toArray();
  res.render('movies',{movieslist: moviesList ,userslist:usersList, title: title, status: status});
  }catch(err){
  console.log(err.stack);
}
})();
});


router.get('/movies', function(req, res){
  const collection = mydb.collection('movieslist');
  (async function(){
    try{
    let moviesList = await collection.find({},{projection: {_id:0,title:1, inventory:1}}).sort({inventory:1}).limit(5).toArray();
    let usersList = await collection.find({},{projection: {_id:0, activeusers:1, title:1}}).filter({'activeusers.inventory':{$gte:1}}).limit(5).toArray();
    res.render('movies',{movieslist: moviesList ,userslist:usersList, title: "This is the movies list", status: "We got in stock: "});
    }catch(err){
    console.log(err.stack);
  }
  })();
});


/*
router.post('/movies', function(req, res){
  const collection = mydb.collection('movieslist');
  collection.find({},{projection: {_id:0,title:1, inventory:1}
  }).toArray(function(err, result){
    if(err) console.log(err.stack);
    let title = req.body.title;
    let status = req.body.status;
    console.log('Movies post was activated')
  res.render('movies',{'movieslist': result, title:title, status:status});
});
});*/




router.post('/submitrent', function(req, res){
  const collection = mydb.collection('movieslist');
  let newMovieTitle = {title: req.body.title};
  let movieTitle = req.body.title;
  let newInventory =  parseInt(req.body.inventory, 10);
  let userRenting =  {email: req.body.email, inventory: newInventory};
  let status = '';
  let title = '';
  
  collection.find(newMovieTitle,{projection: {_id:0, inventory:1, activeusers:1}
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
    
  }else if( result[0].activeusers === undefined){  
    collection.updateOne(newMovieTitle, { $addToSet: {activeusers: userRenting}, $inc: {inventory: -newInventory}},function(err, success){
      if(err) console.log(err.stack)
      if(success)
      console.log( movieTitle, ' inventory was updated');
      });
      title = movieTitle +' inventory was updated to'+ result[0].inventory-newInventory ;
      status = req.body.email + ' got '+ newInventory+ ' copies';
    
      
  }else if( result[0].activeusers[0].email === req.body.email){
    collection.findOneAndUpdate(
      {title: movieTitle}, 
      { $inc: {inventory: -newInventory, 'activeusers.$[elem].inventory': newInventory}},
      {arrayFilters:[{'elem.email':req.body.email}]},
      function(err, success){
        if(err) console.log(err.stack)
        console.log("success: ", success )
        console.log( movieTitle, ' inventory was updated by: ' +req.body.email);
        });

      title = movieTitle +' inventory was updated to'+ (result[0].inventory-newInventory) ;
      status = req.body.email +' have' +(result[0].activeusers[0].inventory+newInventory) + ' include the new '+ newInventory+ ' copies';
  }
  

(async function(){
  try{
    let moviesList = await collection.find({},{projection: {_id:0,title:1, inventory:1}}).sort({inventory:1}).limit(5).toArray();
    let usersList = await collection.find({},{projection: {_id:0, activeusers:1, title:1}}).filter({'activeusers.inventory':{$gte:1}}).limit(5).toArray();
    res.render('movies',{movieslist: moviesList ,userslist:usersList, title: title, status: status});
  }catch(err){
    console.log(err.stack);
  }
})();

/*
activeusers:{ inventory:{$gte: 1}}
  collection.find({},{projection: {_id:0,title:1, inventory:1}}).sort({inventory:1}).limit(50).toArray(function(err, result){
  if(err) throw (err);
   collection.find({activeusers:{ inventory:{$gte: 1}}},{projection: {_id:0,title:1, activeusers:1}}).limit(50).toArray(function(err, usersres){
   if(err) throw (err);
   
   res.render('movies',{movieslist: moviesList ,userslist:usersList, title: title, status: status});
   });
  });*/

});
});



router.post('/submitreturn', function(req, res){
  updateInventory(req.body.title, req.body.inventory, req.body.email,res);
});


function updateInventory(title, inventory, email, res){
  const collection = mydb.collection('movieslist');
  let query = {};
  let status = '';
  
  if(title)
    query.title = title;

  if(inventory)
    inventory = parseInt(inventory, 10);
    query['activeusers.inventory'] = {$gte:inventory} 
  

  if(email)
    query['activeusers.email'] =  email;

  console.log(query);
  collection.findOneAndUpdate(query,{
    $min:{'activeusers.$.inventory': -inventory, inventory: inventory}},{
    upsert: false,
    returnNewDocument: true},
    function(err,r){
      if(err) console.log(err);
      console.log('r: ',r);
      console.log('r: ',r.value);
    }
  )
}






});
module.exports = router;

  /*

  collection.find({ title: movieTitle,  activeusers: {$elemMatch:{email: userEmail, inventory:{ $gte:1} }}
  },{projection: {_id:0, activeusers: 1}}
  ).toArray(function(err, result){
  
  if(err) console.log(err.stack);
  console.log('Was find :', result);
  
  if(result === undefined){
    console.log('The movie is  out of stock');
    title = 'The movie is  out of stock';
    status = 'inventory was requsted by: '+newInventory;

  }else if(result[0].activeusers[0].inventory === newInventory){
  collection.update({title: movieTitle}, { $pull: {activeusers: userRenting}, $inc: {inventory: newInventory}},function(err, success){
    if(err) console.log(err.stack)
    if(success)
    console.log(movieTitle, ' inventory was updated');
  });
    title = "The user: "+req.body.email+' rented successfuly the movie: '+req.body.title;
    status = 'inventory was updated by: '+newInventory;
 
  }else if(result[0].activeusers[0].inventory > newInventory){
    collection.update({title: movieTitle, activeusers:{email:userEmail}}, { $inc: {'activeusers.inventory': -newInventory}, $inc: {inventory: newInventory}},function(err, success){
      if(err) console.log(err.stack)
      if(success)
      console.log(movieTitle, ' inventory was updated');
    });
      title = "The user: "+req.body.email+' rented successfuly the movie: '+req.body.title;
      status = 'inventory was updated by: '+newInventory+ 'the user have : '+ (result[0].activeusers[0].inventory-newInventory)+' left to return.';
    

  }else if(result[0].activeusers[0].inventory < newInventory){
    let available = result[0].activeusers[0].inventory;
    console.log('The available inventory is: ', available);
    title = 'The available inventory is: '+ available;
    status = 'inventory was updated by: '+newInventory;
  }
  });

(async function(){
  try{
  let moviesList = await movieCollection.find({},{projection: {_id:0,title:1, inventory:1}}).sort({inventory:1}).limit(5).toArray();
  let usersList = await movieCollection.find({},{projection: {_id:0, activeusers:1, title:1}}).filter({'activeusers.inventory':{$gte:1}}).limit(5).toArray();
  res.render('movies',{movieslist: moviesList ,userslist:usersList, title: title, status: status});
  }catch(err){
  console.log(err.stack);
}
})();

});
});*/
