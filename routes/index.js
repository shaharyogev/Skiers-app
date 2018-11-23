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
  const usersCollection = mydb.collection('userslist');
  
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
    

  collection.find( { 'activeUsers.inventory': { $gte: 0 }} ,{projection: { _id: 0, 'activeUsers.email': 1, title: 1 }}).toArray(function(err, result ){
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
        title = title + ' inventory wasent updated, the current inventory is: ' + currentMovieI,
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


//Querys: 


function topTenMovies(title, status, res){
  collection.find( {'activeUsers.inventory':{$gte:1}} ,{ projection: { _id: 0, title: 1, 'activeUsers.inventory':1 }}).sort({ 'activeUsers.$.inventory': -1 }).toArray(function(err, result ){
    if(err) console.log(err);
    let moviesList = [];

    for(var index in result){
      moviesList[result[index].title]
      let currentMovieRented =0;

      for(var indexb in result[index].activeUsers){
        currentMovieRented += result[index].activeUsers[indexb].inventory 
      }
      moviesList[index] = {title: result[index].title , inventory:currentMovieRented }
    }
    moviesList.sort(function(a,b){return b.inventory - a.inventory })
    
    title = 'The top 10 most rented movies are:';
    status = '';
    
    if(res)
      res.render('movies', { movieslist: moviesList, userslist: [], title: title, status: status });
    
    else
      return  moviesList
  })
}



function topTenUsers(title, status, res){
  collection.find( {'activeUsers.inventory':{$gte:1}} ,{ projection: { _id: 0, 'activeUsers.email':1, 'activeUsers.inventory':1 }}).toArray(function(err, result ){
    if(err) console.log(err);
    
    let usersListObj = [];
    let usersList = [];

    console.log('Users list data: ', result)

    for(var index in result)
      for(var indexb in result[index].activeUsers)
        usersListObj.push( result[index].activeUsers[indexb]);
      
    console.log('userListObj: ', usersListObj)

    let temp =[];
    let obj = null;
    for(var i=0; usersListObj.length > i; i++){
      obj = usersListObj[i]
      console.log('obj', obj)

      if(!temp[obj.email])
        temp[obj.email] = obj;

      else
        temp[obj.email].inventory += obj.inventory;
      
        console.log('temp[obj.email]', temp)

    }
    
    for(var prop in temp)
      usersList.push(temp[prop]);
    
    usersList.sort(function(a,b){return b.inventory - a.inventory });
    usersList.slice(0,10);
    console.log('userList: ', usersList)

    title = 'The top 10 active users:';
    status = '';

    
    res.render('movies', { movieslist: [], userslist: usersList, title: status, status:  title });
  })
}


function mostActiveUser(title, status, res){
  collection.aggregate([{
    $unwind: '$activeUsers' },
    {$project:{_id:0, title:1, activeUsers:1}},
    {$group:{_id: '$activeUsers.email',moviesCount:{'$sum':1}, 
    inventoryCount:{'$sum': '$activeUsers.inventory'}, 
    rentedMovies: { $push:{email:'$activeUsers.email', title:'$title', inventory:'$activeUsers.inventory'}}}},
    {$sort:{'inventoryCount':-1}},{$limit:1},
    {$unwind:'$rentedMovies' }]).toArray(function(err, result){
    if(err) console.log(err)
    let usersList = [];
    console.log(result);

    
    
    if(!result)
      res.render('movies',{title:'The most active user Is: error',status:'errore',userslist:[],movieslist:[]});
    
    else{
      for(let index in result){
        let temp = 'Email: ' + result[index].rentedMovies.email + ' Title: ' + result[index].rentedMovies.title + ' Inventory: ' + result[index].rentedMovies.inventory;
        usersList.push(temp)
      }
      
      console.log('usersList:', usersList)
      res.render('movies',{title:'The most active user Is: ',status:'',
       userslist: usersList, movieslist: [] });
    }
  }) 
}

router.get('/topTenMovies', function(req, res){
  topTenMovies('','',res);
});

router.get('/topTenUsers', function(req, res){
  topTenUsers('','',res);
});

router.get('/mostActiveUser', function(req, res){
  mostActiveUser('','',res);
});

router.get('/login', function(req, res){
  loginAttempt(email, password, userLogIn(err, email, res));
});



router.get('/movies', function(req, res){
  inventoryStatus('This is the movies list','We got in stock: ', res);
});

router.post('/submitreturn', function(req, res){
  updateReturnedInventory(req.body.title, req.body.inventory, req.body.email,res);
});

router.post('/submitrent', function(req, res){
  updateRentInventory(req.body.title, req.body.inventory, req.body.email,res);
});-

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
        console.log('The password is correct');
      }});
      res.render('userprofile', loginUser);
    
    }else{
    collectionu.updateOne( loginUser,{ $inc: { loginUnsuccessfully: + 1 },function(err, res){
      if(err) console.log(err.stack);
      console.log('The password is not correct');
      }});
    } 
  });
 });
});

*/