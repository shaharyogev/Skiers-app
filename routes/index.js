const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const MongoClient = mongodb.MongoClient;
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';


/*Start the Database connection: */

MongoClient.connect( usersdbUrl, function(err, db){
  if(err) 
    console.log(err.stack);

  const mydb = db.db('usersdb');
  const collection = mydb.collection('movieslist');
  const usersCollection = mydb.collection('userslist');

  
/* Database creation functions: */


function updateNewInventory(title, inventory, res ){
let query = {};
  let status = '';
  let currentMovieI = 0;
  
  if (title)
    query.title = title;

  if (inventory)
    inventory = parseInt(inventory, 10);

  currentMovieInventory(title, function(err, value){
    currentMovieI = value;

    if((currentMovieI + inventory) <= 0 )
      title = title + ' inventory was not update - inventory is too low',
      status = 'The maximum inventory to raduse is: '+ currentMovieI,
      inventoryStatus(title, status, res);


    else
      collection.findOneAndUpdate(query ,{ $inc: { inventory: inventory }}, { upsert: true }, function(err ,r){
        if(err) console.log(err);
        
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
  });
}




function updateRentedInventory(title, inventory, email, res ){
  let query = {};
  let status = '';
  let currentMovieI = 0;
  
  if (title)
    query.title = title;

  if (inventory)
    inventory = parseInt(inventory, 10)
    query.inventory = { $gte: inventory };
  
  if (email)
    email = email.toLowerCase(),
    query['activeUsers.email'] = email ,

  collection.findOneAndUpdate( query ,{ 
  $inc: { 'activeUsers.$.inventory': inventory, inventory: -inventory }},{
  upsert: true },
  function(err ,r){
    if(err) console.log(err);
    
    if(r === null)
      collection.findOneAndUpdate({ title: title, inventory:{$gte: inventory}},{ 
      $addToSet: { activeUsers: { email: email, inventory: inventory }},
      $inc: { inventory: -inventory }},
      function(err, r){
      
      if(err) console.log(err)
    
      if(r.value !== null)
        title = title + ' inventory was updated to'+  inventory,
        status = email + ' have ' + inventory + ' new copies',
        inventoryStatus(title, status, res);  
        
      else
        currentMovieInventory(title, function(err, value){
        currentMovieI = value;
        title = title + ' inventory wasent updated, the current inventory is: ' + currentMovieI,
        status = email + ' can rent only: ' + currentMovieI + ' new copies',
        inventoryStatus(title, status, res);  
      })  
    })

    else 
      title = title + ' inventory was updated to'+ ( r.value.inventory - inventory ),
      status = email + ' have ' +( r.value.activeUsers[0].inventory + inventory ) + ' copies include the ' + inventory + ' new copies',
      inventoryStatus(title, status, res);
  })
}



function updateReturnedInventory(title, inventory, email, res){
  let query = {};
  let status = '';
  
  if (title)
    query.title = title

  if (inventory)
    inventory = parseInt(inventory, 10)
  
  if (email)
    email = email.toLowerCase(),
    query.activeUsers ={ $elemMatch:{email: email, inventory:{ $gte: inventory }}};

  //console.log('query return: ', query );

  collection.findOneAndUpdate(query ,{
    $inc:{'activeUsers.$.inventory': -inventory, inventory: inventory }},{
    upsert: false, returnNewDocument: true },
    function(err ,r){
      if(err) console.log(err);

      if(r.value == null)
        currentUserInventory( title, email ,function(err, value){
          title = 'The movie: ' + title + ' wasnt returnd to stock!',
          status = 'The user: ' + email + ' cant return the amount of: ' + inventory + ' the current inventory for this user: ' + value;
          inventoryStatus(title, status, res);
      });
        
      if(r.value !== null )
        currentUserInventory(title, email ,function(err,value){
        title = 'The movie: ' + title + ' was returnd to stock, the current stock is: ' + (r.value.inventory + inventory),
        status = 'The user: ' + email + ' returnd ' + inventory + 'his total inventory for now is: ' + value;

        inventoryStatus(title, status, res);
        });
    }
  )
}


/* Databas basic queries: */

function currentMovieInventory(title, cb ){
  collection.findOne({ title: title }, { projection: { _id: 0, inventory: 1 }}, function(err, r ){
    if(err)
      console.log(err)
    
    let value = 0;

    if(r === null)
      value = 0;
    
    else
      //console.log('current movie inventory is: ',r.inventory ),
      value = r.inventory;

    cb(null, value);
  })
}

function currentUserInventory(title, email, cb ){
  collection.findOne({ title: title, activeUsers: { $elemMatch: { email: email }}},
  { projection: { _id:0, title:1, 'activeUsers.$.email': 1, 'activeUsers.inventory':1 }},
  function(err, result ){
    if(err) 
      console.log(err);

    let value  = 0;

    if(result === null)
      value = 0,
      cb(null, value);
    
    else{
      value = result.activeUsers[0].inventory 
      //console.log('current user inventory is: ', result.activeUsers[0].inventory )
      if( result.activeUsers[0].inventory === 0 )
        collection.updateOne({ title: title },
        { $pull: { activeUsers:{ email: email, inventory: 0 }}},
        function(err ,r ){
          if(err) 
            console.log(err);

          //console.log('pull r: ', r.result.nModified)
          cb(null, value);
        })
      }
    })
}




function inventoryStatus(title, status, res){
  collection.aggregate([
    {$project: { _id:0, title:1, inventory:1}},
    {$sort: { inventory: -1}},
    {$limit: 10},
  ]).toArray(function(err, result){
    if(err)
      res.render('movies', {moviesList:[], title:'No inventory in stock', status: err});
    
    //console.log('inventoryStatus result:', result)
    let moviesList = [];
    for(let index in result){
      let temp = 'Movie titel: ' + result[index].title + ' Avialebel inventory: ' + result[index].inventory;
      moviesList.push(temp);
    }
    res.render('movies', {moviesList:moviesList, title:title, status: status});

  })
}




/* User login and creation: */


function creatNewUser(name, email, password, cb){
 if(name)
  name = name.toLowerCase;
  
  if(email)
    email = email.toLowerCase;

  if(password)
    bcrypt.hash(password, saltRounds, function(err, hash) {
    let nweUser ={name: name, email: email, key: hash};
  
    usersCollection.updateOne(newUser,newUser, function(err, result){
      if(err) console.log(err.stack)
      cb(err, result, email, name);
    })
  })
}

//function newUserLogIn(err, result, email, name){}


function loginAttempt(email, password, cb){
  if (email)
    email = email.toLowerCase;
    
  if(password)
    usersCollection.findOne({ email: email },{ projection: { _id:0, key:1 }}, function(err, r ){
    if(err) console.log(err.stack);
    
    if(r !== null)
      console.log(r.key),
      bcrypt.compare(password, r.key, function(err, cb) {
        if(err) console.log(err);
      //console.log('bcrypt response: ', response)

        usersCollection.updateOne({ email: email }, { $inc: { loginSuccessfully: + 1 }}, function(err, r){
          if(err) console.log(err);
          
          console.log('The password is correct');
          cb(err, email, password)
        })
      });
      
    
    else //login fail for regesterd user
      usersCollection.updateOne( {email:email},{ $inc: { loginUnsuccessfully: + 1 }}, function(err, r){
        if(err) console.log(err.stack);

        if(r === null)
          console.log('The user is not regestered'),
          cb(err, email, password);// the user is not regestered !
          
        else
          console.log('The password is not correct'),
          cb(err, email, password)// the password is not correct!
      //console.log('The password is not correct');
  })
 })
}


function userLogIn(err, email, res ){
  console.log('The user: ' + email + ' is logdin successfuly')

  collection.find({email:email}, {projection:{_id:0, 'activeUsers.$.email': 1, 'activeUsers.$.inventory':1, title:1 },function(err, r){
    if(err) console.log(err)

    if(r === null)
      status = 'the user dont have any inventory in the movies lists',
      res.render('users',{response: r, status:status});

    else
      status = 'Movis list for: ' + email,
      res.render('users',{response: r, status:status});
  }
 })  
}


/* BI Querys: */


function topTenMovies(res){

  collection.aggregate([
    {$match:{'activeUsers.inventory': {$gte: 1 }}},
    {$project: { _id: 0, title: 1, 'activeUsers': 1 }},
    {$unwind: '$activeUsers' },
    {$group: { _id: '$title', rentedMovieInventory: { $sum: '$activeUsers.inventory'}}},
    {$sort: {rentedMovieInventory: -1}},
    {$limit: 10},
  ]).toArray(function(err, result){
    if(err)
      res.render('movies', { moviesList:[], title: 'Top 10 rented movies: ', status: err });
    
    //console.log('topTenMovies result: ', result)
    let moviesList = [];
    for(let index in result){
      let temp = 'Movie title: ' + result[index]._id + ' Current rented inventory: ' + result[index].rentedMovieInventory;
      moviesList.push(temp);
    }
    
    res.render('movies', { moviesList: moviesList, title: 'Top 10 rented movies: ', status:'' });
  })
}




function topTenUsers(res){
  collection.aggregate([
    {$match: { 'activeUsers.inventory': { $gte: 1 }}},
    {$project: { _id: 0, 'activeUsers.email': 1, 'activeUsers.inventory': 1 }},
    {$unwind: '$activeUsers' },
    {$group: { _id: '$activeUsers.email', userInventorySum: { $sum: '$activeUsers.inventory' }}},
    {$sort: { userInventorySum: -1 }},
    {$limit: 10 }
  ]).toArray(function(err, result){
    
    if(err)
      res.render('movies', { moviesList: [], userslist: [], title:'The top 10 active users:', status: err });
    
    //console.log('topTenUsers result: ', result)
    let usersList =[];
    
    for(let index in result){
      let temp = 'Email: ' + result[index]._id + ' Currnt inventory: ' + result[index].userInventorySum
      usersList.push(temp);
    }
    
    res.render('movies', { moviesList: usersList, title:'The top 10 active users:', status: '' });
  })
}


function mostActiveUser( res){
  collection.aggregate([
    {$unwind: '$activeUsers' },
    {$project: { _id:0, title:1, activeUsers:1}},
    {$group: { _id: '$activeUsers.email', moviesCount: { $sum: 1 }, 
      inventoryCount: { '$sum': '$activeUsers.inventory' }, 
      rentedMovies: { $push:{email:'$activeUsers.email', title:'$title', inventory:'$activeUsers.inventory' }}}},
    {$sort: { 'inventoryCount': -1 }},
    {$limit: 1 },
    {$unwind: '$rentedMovies' }
  ]).toArray(function(err, result){
    
    if(err) 
      res.render('movies',{title:'The most active user Is: error',status: err ,moviesList:[]});

    let usersList = []
    for(let index in result){
      let temp = 'Email: ' + result[index].rentedMovies.email + ' Title: ' + result[index].rentedMovies.title + ' Inventory: ' + result[index].rentedMovies.inventory;
      usersList.push(temp)
    }
    //console.log(usersList)
      
    res.render('movies',{title:'The most active user Is: ',status: result[0].rentedMovies.email , moviesList: usersList });
  }) 
}


function topRentedMovie( res){
  collection.aggregate([
    {$unwind: '$activeUsers' },
    {$project: { _id:0, title:1, activeUsers:1}},
    {$group: { _id: '$title', usersCount: { $sum: 1 }, 
      inventoryCount: { '$sum': '$activeUsers.inventory' }, 
      users: { $push:{email:'$activeUsers.email', inventory:'$activeUsers.inventory' }}}},
    {$sort: { 'inventoryCount': -1 }},
    {$limit: 1 },
    {$unwind: '$users' },
    {$sort: {'users.inventory': -1}}
  ]).toArray(function(err, result){
    //console.log('topRentedMovie: ', result)
    if(err) 
      res.render('movies',{title:'The top rented movie Is: error',status: err ,moviesList:[]});

    let usersList = []
    for(let index in result){
      let temp = 'Email: ' + result[index].users.email +  ' Inventory: ' + result[index].users.inventory;
      usersList.push(temp)
    }
    //console.log(usersList)
      
    res.render('movies',{title:'The top rented movie Is: ',status: result[0]._id , moviesList: usersList });
  }) 
}







/* Router requests: */


router.get('/', function(req, res, next ) {
  res.render('index', { title: 'Express' });
});


router.get('/topTenMovies', function(req, res){
  topTenMovies(res);
});

router.get('/topTenUsers', function(req, res){
  topTenUsers(res);
});

router.get('/mostActiveUser', function(req, res){
  mostActiveUser(res);
});

router.get('/topRentedMovie', function(req, res){
  topRentedMovie(res);
});


router.get('/login', function(req, res){
  loginAttempt(email, password, userLogIn(err, email, res));
});



router.get('/movies', function(req, res){
  inventoryStatus('Movies In Stock','Largest inventory: ', res);
});

router.post('/submitreturn', function(req, res){
  updateReturnedInventory(req.body.title, req.body.inventory, req.body.email,res);
});

router.post('/submitrent', function(req, res){
  updateRentedInventory(req.body.title, req.body.inventory, req.body.email,res);
});-

router.post('/addmovietodb', function(req, res){
  updateNewInventory(req.body.title, req.body.inventory, res);
});

});
module.exports = router;