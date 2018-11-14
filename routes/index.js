const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const MongoClient = mongodb.MongoClient;
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';

MongoClient.connect( usersdbUrl, function(err, db){
  if(err) 
    console.log(err.stack);

  const mydb = db.db('usersdb');
  const collection = mydb.collection('movieslist');
  
/* GET home page. */
router.get('/', function(req, res, next ) {
  res.render('index', { title: 'Express' });
});


function currentUserInventory(title, email, cb ){
  collection.findOne({ title: title, activeUsers: { $elemMatch: { email: email }}},
  { projection: { _id:0, title:1, 'activeUsers.$.email': 1 }},
  function(err, result ){
    if(err) 
      console.log(err);

    let value  = 0;

    if(result === null)
      value = 0,
      cb(null, value);
    
    else
      value = result.activeUsers[0].inventory 
      console.log('current user inventory is: ', result.activeUsers[0].inventory )
      if( result.activeUsers[0].inventory === 0 )
        collection.updateOne({ title: title },
        { $pull: { activeUsers:{ email: email, inventory: 0 }}},
        function(err ,r ){
          if(err) 
            console.log(err);

          //console.log('pull r: ', r.result.nModified)
          cb(null, value);
        })
    })
}


function currentMovieInventory(title, cb ){
  collection.findOne({ title: title }, { projection: { _id: 0, inventory: 1 }}, function(err, r ){
    if(err)
      console.log(err)
    
    let value = 0;

    if(r === null)
      value = 0;
    
    else
      console.log('current movie inventory is: ',r.inventory ),
      value = r.inventory;

    cb(null, value);
  })
}


function inventoryStatus(title, status, res){
  collection.find( {} ,{ projection: { _id: 0, title: 1, inventory: 1 }}).sort({ inventory: -1 }).limit(10).toArray(function(err, result ){
    if(err) console.log(err)
    let moviesList = result;

  collection.find( { 'activeUsers.inventory': { $gte: 0 }} ,{projection: { _id: 0, activeUsers: 1, title: 1 }}).toArray(function(err, result ){
    if(err) console.log(err)
    let usersList = result
    //console.log('userList: ', usersList)
  
    res.render('movies', { movieslist: moviesList, userslist: usersList, title: title, status: status });
    })
  })
}




function updateReturnedInventory(title, inventory, email, res){
  let query = {};
  let status = '';
  let currentUserI = 0;
  
  if (title)
    query.title = title

  if (inventory)
    inventory = parseInt(inventory, 10)
  
  if (email)
    email = email.toLowerCase(),
    query.activeUsers ={ $elemMatch:{email: email, inventory:{ $gte: inventory }}};
    //currentUserInventory(title, email, currentUserI);

  console.log('query return: ', query );

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
      
      //console.log('r return: ', r);
      //console.log('r return value: ', r.value);

      //inventoryStatus(title, status, res);
    }
  )
}


function updateRentInventory(title, inventory, email, res ){
  let query = {};
  let status = '';
  let currentUserI =0;
  let currentMovieI = 0;
  
  if (title)
    query.title = title;

  if (inventory)
    inventory = parseInt(inventory, 10)
    query.inventory = { $gte: inventory };
  
  if (email)
    email = email.toLowerCase(),
    query['activeUsers.email'] = email ,
    //console.log('query2: ', query );

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
        title = title + ' inventory wasent updated, the corent inventory is: ' + currentMovieI,
        status = email + ' can rent only: ' + currentMovieI + ' new copies',
        inventoryStatus(title, status, res);  
      })  
    })

    else 
      title = title + ' inventory was updated to'+ ( r.value.inventory - inventory ),
      status = email + ' have ' +( r.value.activeUsers[0].inventory + inventory ) + ' include the ' + inventory + ' new copies',
      inventoryStatus(title, status, res);
  })
}




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
      //console.log("query new movie : ", query),
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

db.movieslist.findOne({title:'1'},{activeUsers:{$elemMatch:{email:'1'}}})
db.movieslist.findOne({title:'1'},{activeUsers:{$elemMatch:{email:'3'}},_id:0})

//db.movieslist.findOne({title:'1'},{activeUsers:{$elemMatch:{email:'1'}}})
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
db.movieslist.updateOne({ title: '1', 'activeUsers.$.email':'1'},{ $addToSet:{activeUsers:{email: '1', inventory: 2}},$inc:{'activeUsers.$.inventory': 2} },{upsert:true})
db.movieslist.updateOne({ title: '1', activeUsers:{$elemMatch:{email: '2'}}},{$inc:{'activeUsers.$.inventory': 2} },{upsert:true})
db.movieslist.updateOne({ title: '1', activeUsers:{$elemMatch:{email: '2'}}},{$addToSet:{activeUsers:{email:'2' ,inventory: 2}} },{upsert:true})
db.movieslist.updateOne({ title: '1'},{$addToSet:{activeUsers:{email:'2' ,inventory: 2}} },{upsert:true})

});
});
*/