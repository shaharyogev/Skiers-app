const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const MongoClient = mongodb.MongoClient;
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';
const session = require('express-session');
const expressValidator = require('express-validator');
const formidableMiddleware = require('express-formidable');
const async = require("async");



/*MAP*/

/*Start the Database connection: */

/* Session & cookies */
// Log user session to the cookie

/* User login and creation: */
//Creat New User - callback inventoryStatusInLogin
// Login chack user email and password - callback getUserName

/* Database functions: */

/* Router requests: */

/* Qureys routes */

/* Databas queries: */

/* BI Querys: */



/*Start the Database connection: */

MongoClient.connect(usersdbUrl, function (err, db) {
  if (err)
    console.log(err.stack);

  const mydb = db.db('usersdb');
  const collection = mydb.collection('moviesList');
  const usersCollection = mydb.collection('usersList');



  /* Session & cookies */

  // Log user session to the cookie

  router.use(session({
    key: 'user_id',
    name: 'activeSession',
    secret: '1234',
    resave: false,
    saveUninitialized: false,
  }));

  /*
  router.use((req, res, next)=>{
    console.log(req.session)
    next();
  })

  */
  /*
  //clear cookie if session is over

  router.use((req, res, next) =>{
    if ( req.session.cookie && !req.session.succes){
      res.clearCookie('moviesInventory');
      console.log('moviesInventory cookie cleard')
    }
      next();
  });
  */


  /* Router requests: */

  //First 
  router.get('/', function (req, res, next) {
    res.render('login');
  })

  //While the user in session the system will stay active.

  router.get('/:id', function (req, res, next) {
    if (req.session.succes)
      next();
    else
      res.render('login');
  })

  //Handle user login request

  router.post('/user', expressValidator(), function (req, res) {

    let email = req.body.email;
    let password = req.body.password;

    req.checkBody('email', 'Name is required').notEmpty();
    req.checkBody('email', 'Name is required').isEmail();
    req.checkBody('password', 'Name is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect('/login');
      console.log('loginAttempt fail');
    } else {
      loginAttempt(req.body.email, req.body.password, req, res);
    }
  });

  //Handle new user singUp

  router.post('/addUser', expressValidator(), function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Name is required').notEmpty();
    req.checkBody('email', 'Name is required').isEmail();
    req.checkBody('password', 'Name is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect('/login');
    } else {
      creatNewUser(req.body.name, req.body.email, req.body.password, req, res);
    }
  });


  /* Qureys routes for the database */

  router.get('/movies/', function (req, res, next) {
    inventoryStatus('Movies In Stock', 'Largest inventory: ', '', res);
  });

  router.post('/submitrent', formidableMiddleware(), function (req, res) {
    updateRentedInventory(req.fields.title, req.fields.inventory, req.fields.email, res);
  });
  
  router.post('/submitNewCustomer', formidableMiddleware(), function (req, res) {
    console.log('/sumitNewCustomer')
    submitNewCustomer(req.fields.name, req.fields.email, req.fields.phone, req.fields.days, res)
  });

  router.post('/submitreturn', formidableMiddleware(), function (req, res) {
    updateReturnedInventory(req.fields.title, req.fields.inventory, req.fields.email, res);
  });

  router.post('/addmovietodb', formidableMiddleware(), function (req, res) {
    updateNewInventory(req.fields.title, req.fields.inventory, res);
  });

  router.get('/topTenMovies', function (req, res) {
    topTenMovies(res);
  });

  router.get('/topTenUsers', function (req, res) {
    topTenUsers(res);
  });

  router.get('/mostActiveUser', function (req, res) {
    mostActiveUser(res);
  });

  router.get('/topRentedMovie', function (req, res) {
    topRentedMovie(res);
  });

  router.get('/login', function (req, res) {
    res.render('login');
  });


  /* User login and creation: */

  //Creat New User - callback inventoryStatusInLogin

  function creatNewUser(name, email, password, req, res) {
    if (name)
      name = name.toLowerCase();

    if (email)
      email = email.toLowerCase();

    if (password)
      bcrypt.hash(password, saltRounds, function (err, hash) {

        usersCollection.findOne({
          email: email
        }, function (err, r) {
          if (err) console.log(err);
          if (r == null) {
            usersCollection.insertOne({
              userName: name,
              email: email,
              key: hash
            }, function (err, r) {
              if (err) console.log(err);
              if (r !== null) {
                if (r.result.n == 1) {
                  ;
                  // Callback if success 
                  startUserSession(email, 'Most Avialebel Inventory:', '', '', req, res);
                  //req.session.succes = true
                  //inventoryStatusInLogin('hello new user', '', name, res);
                }
              } else {
                res.render('login')
              }
            })
          } else {
            res.render('login')
          }
        })
      })
  };


  // Login chack user email and password - callback getUserName

  function loginAttempt(email, password, req, res) {
    if (email)
      email = email.toLowerCase();

    if (password)
      usersCollection.findOne({
        email: email
      }, {
        projection: {
          _id: 0,
          key: 1,
          userName: 1
        }
      }, function (err, findRes) {
        if (err) console.log(err);

        if (findRes !== null) {
          bcrypt.compare(password, findRes.key, function (err, bcRes) {
            if (err) console.log(err);
            if (bcRes) {
              usersCollection.updateOne({
                email: email
              }, {
                $inc: {
                  loginSuccessfully: +1
                }
              }, {
                upsert: true
              }, function (err, r) {
                if (err) console.log(err);
                if (r.result.n == 1)
                  startUserSession(email, 'Most Avialebel Inventory:', '', '', req, res);

              });
            } else {
              usersCollection.updateOne({
                email: email
              }, {
                $inc: {
                  loginUnsuccessfully: +1
                }
              }, {
                upsert: true
              }, function (err, r) {
                if (err) console.log(err);
                if (r.result.n == 1)
                  res.render('login');
              });
            }
          });
        } else
          res.render('login');
      })
  };

  //On login sucsess activat the user session

  function startUserSession(email, title, status, userName, req, res) {
    usersCollection.findOne({
      email: email
    }, {
      projection: {
        _id: 0,
        userName: 1
      }
    }, function (err, r) {
      if (err) console.log(err)
      if (r !== null) {
        req.session.succes = true,
        req.session.cookie = {
          name: 'moviesInventory',
          userName: r.userName,
          originalMaxAge: 1000 * 60 * 60 * 24 * 365
        };
        inventoryStatusInLogin(title, status, r.userName, res);
      }
    })
  }





  /* Database functions: */

  function updateNewInventory(title, inventory, res) {
    let query = {};
    let status = '';
    let currentMovieI = 0;

    if (title)
      query.title = title;

    if (inventory)
      inventory = parseInt(inventory, 10);

    currentMovieInventory(title, function (err, value) {
      currentMovieI = value;

      if ((currentMovieI + inventory) <= 0) {
        title = title + ' inventory was not update - inventory is too low',
          status = 'The maximum inventory to raduse is: ' + currentMovieI,
          inventoryStatus(title, status, '', res);
      } else {
        collection.findOneAndUpdate(query, {
          $inc: {
            inventory: inventory
          }
        }, {
          upsert: true
        }, function (err, r) {
          if (err) console.log(err);

          if (r == null)
            title = 'The item: ' + title + ' wasnt add to the Inventory!',
            status = 'There was a problem'

          else if (r.value !== null)
            title = title + ' inventory was updated successfuly',
            status = 'The inventory is: ' + (currentMovieI + inventory);

          else if (r.lastErrorObject.upserted !== null)
            title = title + ' is new, inventory updated successfuly',
            status = 'The inventory is: ' + (currentMovieI + inventory);

          inventoryStatus(title, status, '', res);
        });
      }
    });
  };


  function updateRentedInventory(title, inventory, email, res) {
    let query = {};
    let status = '';
    let currentMovieI = 0;

    if (title)
      query.title = title;

    if (inventory)
      inventory = parseInt(inventory, 10)
    query.inventory = {
      $gte: inventory
    };

    if (email)
      email = email.toLowerCase(),
      query['activeUsers.email'] = email;

    collection.findOneAndUpdate(query, {
        $inc: {
          'activeUsers.$.inventory': inventory,
          inventory: -inventory
        }
      }, {
        upsert: true
      },
      function (err, r) {
        if (err) console.log(err);

        if (r === null)
          collection.findOneAndUpdate({
              title: title,
              inventory: {
                $gte: inventory
              }
            }, {
              $addToSet: {
                activeUsers: {
                  email: email,
                  inventory: inventory
                }
              },
              $inc: {
                inventory: -inventory
              }
            },
            function (err, r) {

              if (err) console.log(err)

              if (r.value !== null)
                title = title + ' inventory was updated to' + inventory,
                status = email + ' have ' + inventory + ' new items',
                inventoryStatus(title, status, '', res);

              else
                currentMovieInventory(title, function (err, value) {
                  currentMovieI = value;
                  title = title + ' inventory wasent updated, the current inventory is: ' + currentMovieI,
                    status = email + ' can rent only: ' + currentMovieI + ' new items',
                    inventoryStatus(title, status, '', res);
                })
            });

        else
          currentUserInventory(title, email, function (err, value) {
          title = title + ' inventory was updated to' + (r.value.inventory - inventory),
          status = 'The user: ' + email + ' have ' + value + ' items include the ' + inventory + ' new items',
          inventoryStatus(title, status, '', res);
          })
      })
  };



  function updateReturnedInventory(title, inventory, email, res) {
    let query = {};
    let status = '';

    if (title)
      query.title = title

    if (inventory)
      inventory = parseInt(inventory, 10)

    if (email)
      email = email.toLowerCase(),
      query.activeUsers = {
        $elemMatch: {
          email: email,
          inventory: {
            $gte: inventory
          }
        }
      };
    collection.findOneAndUpdate(query, {
        $inc: {
          'activeUsers.$.inventory': -inventory,
          inventory: inventory
        }
      }, {
        upsert: false,
        returnNewDocument: true
      },
      function (err, r) {
        if (err) console.log(err);

        if (r.value === null) {
          currentUserInventory(title, email, function (err, value) {
            title = 'The item: ' + title + ' wasnt returnd to stock!',
              status = 'The user: ' + email + ' cant return the amount of: ' + inventory + ' the current inventory for this user: ' + value;
            inventoryStatus(title, status, '', res);
          });
        }
        if (r.value !== null) {
          currentUserInventory(title, email, function (err, value) {
            title = 'The item: ' + title + ' was returnd to stock, the current stock is: ' + (r.value.inventory + inventory),
              status = 'The user: ' + email + ' returnd ' + inventory + 'his total inventory for now is: ' + value;

            inventoryStatus(title, status, '', res);
          });
        }

      }
    )
  };


  async function submitNewCustomer( name, email, phone, days, res){
    try{

    
    let query = {};

    if (name)
      query.name = name;

    if (phone)
      query.phone = phone;

    if (email)
      email = email.toLowerCase(),
      query.email = email;

    if (days)
      days = parseInt(days, 10),
      query.days = days;
    
      let r1 = await collection.find({'email':email})
      await function(){ if(r1){
        console.log('r1');
      }};

     let r = await collection.insertOne(query);
     //await console.log(r);

     await res.send({
      moviesList: "",
      title: 'user',
      status: ''
    });
    } catch(err){
      console.log(err.stack);
    }
  };


  /* Databas queries: */

  function currentMovieInventory(title, cb) {
    collection.findOne({
      title: title
    }, {
      projection: {
        _id: 0,
        inventory: 1
      }
    }, function (err, r) {
      if (err)
        console.log(err)

      let value = 0;

      if (r === null)
        value = 0;

      else
        value = r.inventory;

      cb(null, value);
    })
  }

  function currentUserGeneralStatus(email, cb) {
    collection.findOne({
        activeUsers: {
          $elemMatch: {
            email: email
          }
        }
      }, {
        projection: {
          _id: 0,
          title: 1,
          'activeUsers.$.email': 1,
          'activeUsers.inventory': 1
        }
      },
      function (err, result) {
        if (err)
          console.log(err);

        let value = 0;

        if (result === null) {
          value = 0,
            cb(null, value);

        } else {
          value = result.activeUsers[0].inventory;
          if (result.activeUsers[0].inventory === 0) {
            collection.updateOne({
                title: title
              }, {
                $pull: {
                  activeUsers: {
                    email: email,
                    inventory: 0
                  }
                }
              },
              function (err, r) {
                if (err)
                  console.log(err);

                cb(null, value);
              });
          }
          cb(null, value);
        }
      })
  };

  function currentUserInventory(title, email, cb) {
    collection.findOne({
        title: title,
        activeUsers: {
          $elemMatch: {
            email: email
          }
        }
      }, {
        projection: {
          _id: 0,
          title: 1,
          'activeUsers.$.email': 1,
          'activeUsers.inventory': 1
        }
      },
      function (err, result) {
        if (err)
          console.log(err);

        let value = 0;

        if (result === null) {
          value = 0,
            cb(null, value);

        } else {
          value = result.activeUsers[0].inventory;
          if (result.activeUsers[0].inventory === 0) {
            collection.updateOne({
                title: title
              }, {
                $pull: {
                  activeUsers: {
                    email: email,
                    inventory: 0
                  }
                }
              },
              function (err, r) {
                if (err)
                  console.log(err);

                cb(null, value);
              });
          }
          cb(null, value);
        }
      })
  };


  function inventoryStatus(title, status, userName, res) {
    collection.aggregate([{
        $project: {
          _id: 0,
          title: 1,
          inventory: 1
        }
      },
      {
        $sort: {
          inventory: -1
        }
      },
      {
        $limit: 10
      },
    ]).toArray(function (err, result) {
      if (err)
        res.send({
          moviesList: [],
          title: 'No inventory in stock',
          status: err
        });
      /*
      res.render('movies', {
        moviesList: [],
        title: 'No inventory in stock',
        status: err
      });*/

      let moviesList = [];
      for (let index in result) {
        let temp = 'Item: ' + result[index].title + ' Avialebel inventory: ' + result[index].inventory;
        moviesList.push(temp);
      };
      res.send({
        moviesList: moviesList,
        title: title,
        status: status,
        userName: userName
      });
      /*
      res.render('movies', {
        moviesList: moviesList,
        title: title,
        status: status,
        userName: userName
      });
      */
    })
  };

  function inventoryStatusInLogin(title, status, userName, res) {
    collection.aggregate([{
        $project: {
          _id: 0,
          title: 1,
          inventory: 1
        }
      },
      {
        $sort: {
          inventory: -1
        }
      },
      {
        $limit: 10
      },
    ]).toArray(function (err, result) {
      if (err)
        res.render('movies', {
          moviesList: [],
          title: 'No inventory in stock',
          status: err
        });

      let moviesList = [];
      for (let index in result) {
        let temp = 'Item: ' + result[index].title + ' Avialebel inventory: ' + result[index].inventory;
        moviesList.push(temp);
      }
      res.render('movies', {
        moviesList: moviesList,
        title: title,
        status: status,
        userName: userName
      });
    })
  };



  /* BI Querys: */


  function topTenMovies(res) {

    collection.aggregate([{
        $match: {
          'activeUsers.inventory': {
            $gte: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          'activeUsers': 1
        }
      },
      {
        $unwind: '$activeUsers'
      },
      {
        $group: {
          _id: '$title',
          rentedMovieInventory: {
            $sum: '$activeUsers.inventory'
          }
        }
      },
      {
        $sort: {
          rentedMovieInventory: -1
        }
      },
      {
        $limit: 10
      },
    ]).toArray(function (err, result) {
      if (err)
        res.send({
          moviesList: [],
          title: 'Top 10 rented movies: ',
          status: err
        });
      /*
      res.render('movies', {
        moviesList: [],
        title: 'Top 10 rented movies: ',
        status: err
      });
      */

      let moviesList = [];
      for (let index in result) {
        let temp = 'Item: ' + result[index]._id + ' Current rented inventory: ' + result[index].rentedMovieInventory;
        moviesList.push(temp);
      }
      res.send({
        moviesList: moviesList,
        title: 'Top 10 rented movies: ',
        status: ''
      });
      /*
      res.render('movies', {
        moviesList: moviesList,
        title: 'Top 10 rented movies: ',
        status: ''
      });
      */
    })
  };




  function topTenUsers(res) {
    collection.aggregate([{
        $match: {
          'activeUsers.inventory': {
            $gte: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          'activeUsers.email': 1,
          'activeUsers.inventory': 1
        }
      },
      {
        $unwind: '$activeUsers'
      },
      {
        $group: {
          _id: '$activeUsers.email',
          userInventorySum: {
            $sum: '$activeUsers.inventory'
          }
        }
      },
      {
        $sort: {
          userInventorySum: -1
        }
      },
      {
        $limit: 10
      }
    ]).toArray(function (err, result) {

      if (err)
        res.send({
          moviesList: [],
          userslist: [],
          title: 'The top 10 active users:',
          status: err
        });
      /*
      res.render('movies', {
        moviesList: [],
        userslist: [],
        title: 'The top 10 active users:',
        status: err
      });*/

      let usersList = [];

      for (let index in result) {
        let temp = 'Email: ' + result[index]._id + ' Currnt inventory: ' + result[index].userInventorySum
        usersList.push(temp);
      }
      res.send({
        moviesList: usersList,
        title: 'The top 10 active users:',
        status: ''
      });
      /*
      res.render('movies', {
        moviesList: usersList,
        title: 'The top 10 active users:',
        status: ''
      });
      */
    })
  };


  function mostActiveUser(res) {
    collection.aggregate([{
        $unwind: '$activeUsers'
      },
      {
        $project: {
          _id: 0,
          title: 1,
          activeUsers: 1
        }
      },
      {
        $group: {
          _id: '$activeUsers.email',
          moviesCount: {
            $sum: 1
          },
          inventoryCount: {
            '$sum': '$activeUsers.inventory'
          },
          rentedMovies: {
            $push: {
              email: '$activeUsers.email',
              title: '$title',
              inventory: '$activeUsers.inventory'
            }
          }
        }
      },
      {
        $sort: {
          'inventoryCount': -1
        }
      },
      {
        $limit: 1
      },
      {
        $unwind: '$rentedMovies'
      }
    ]).toArray(function (err, result) {

      if (err)
        res.send({
          title: 'The most active user Is: error',
          status: err,
          moviesList: []
        });
      /*
      res.render('movies', {
        title: 'The most active user Is: error',
        status: err,
        moviesList: []
      });*/

      let usersList = []
      for (let index in result) {
        let temp = 'Email: ' + result[index].rentedMovies.email + ' Title: ' + result[index].rentedMovies.title + ' Inventory: ' + result[index].rentedMovies.inventory;
        usersList.push(temp)
      }
      /*
      res.render('movies', {
        title: 'The most active user Is: ',
        status: result[0].rentedMovies.email,
        moviesList: usersList
      });
      */

      res.send({
        title: 'The most active user Is: ',
        status: result[0].rentedMovies.email,
        moviesList: usersList
      });
    })
  };


  function topRentedMovie(res) {
    collection.aggregate([{
        $unwind: '$activeUsers'
      },
      {
        $project: {
          _id: 0,
          title: 1,
          activeUsers: 1
        }
      },
      {
        $group: {
          _id: '$title',
          usersCount: {
            $sum: 1
          },
          inventoryCount: {
            '$sum': '$activeUsers.inventory'
          },
          users: {
            $push: {
              email: '$activeUsers.email',
              inventory: '$activeUsers.inventory'
            }
          }
        }
      },
      {
        $sort: {
          'inventoryCount': -1
        }
      },
      {
        $limit: 1
      },
      {
        $unwind: '$users'
      },
      {
        $sort: {
          'users.inventory': -1
        }
      }
    ]).toArray(function (err, result) {
      if (err)
        res.send({
          title: 'The top rented Item Is: error',
          status: err,
          moviesList: []
        });
      /*
      res.render('movies', {
        title: 'The top rented Item Is: error',
        status: err,
        moviesList: []
      });*/

      let usersList = []
      for (let index in result) {
        let temp = 'Email: ' + result[index].users.email + ' Inventory: ' + result[index].users.inventory;
        usersList.push(temp)
      }
      /*
      res.render('movies', {
        title: 'The top rented Item Is: ',
        status: result[0]._id,
        moviesList: usersList
      });*/
      res.send({
        title: 'The top rented Item Is: ',
        status: result[0]._id,
        moviesList: usersList
      });
    })
  };
});


module.exports = router;