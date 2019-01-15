const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';
const client = MongoClient(usersdbUrl, {
  useNewUrlParser: true
});
const session = require('express-session');
const expressValidator = require('express-validator');
const formidableMiddleware = require('express-formidable');
const async = require("async");
let inviteListForLogIn




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

client.connect(function (err, db) {
  if (err)
    console.log(err.stack);

  const mydb = db.db('usersdb');
  const collection = mydb.collection('appData');
  const usersCollection = mydb.collection('usersList');



  /* Session & cookies */

  // Log user session to the cookie

  router.use(session({
    key: 'user_id',
    name: 'activeSession',
    secret: 'en2834yhf19@#$RQ!@RHOH234w',
    resave: false,
    saveUninitialized: false,
  }));

  /*
  router.use((req, res, next)=>{
    console.log(req.session)
    next();
  })

  
  
    //clear cookie if session is over

    router.use( function(req, res, next){
      if ( req.session.cookie && !req.session.succes){
        res.clearCookie('skiersAdmin');
        console.log('skiersAdmin cookie cleard')
      }
        next();
    });

*/

  /* Router requests: */

  //First 
  router.get('/', function (req, res, next) {
    if (req.session.succes){
      console.log(req.session);
      res.render('movies',{userName:req.session.userName})
      //next()
    }else{
      res.render('login');

    }
  })

  
  //While the user in session the system will stay active.

  router.get('/:id', function (req, res, next) {
    if (req.session.succes){
      //console.log(req.session);
      //res.render('movies',{userName:req.session.userName})
      next()
      
    }
    else{
      console.log('not in session');
      res.render('login');
    }
      
  })

  //Handle user login request

  router.post('/user', formidableMiddleware(), function (req, res) {

    let email = req.fields.email;
    console.log(email);

    let errors;

    if (email != undefined) {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let res = re.test(String(email).toLowerCase());
      console.log('email is: ' + res);
      if (!res) {
        errors = 'Hi ' + email + ' You cant use this email, try a real one';
      }
    }

    let password = req.fields.password;
    if (password != undefined) {
      let re =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{5,}$/;
      let res = re.test(String(password));
      console.log('password is: ' + res);
      if (!res) {
        errors += ' the assword is Minmum 5 character long + upper cases + lower cases + digits ';
      }
    }
    console.log(password);

    console.log(errors);
    if (errors) {
      req.session.errors = errors;
      res.json({
        err: errors
      });
    } else {
      loginAttempt(req.fields.email, req.fields.password, req, res);


    }
  });

  //Handle new user singUp

  router.post('/addUser', formidableMiddleware(), function (req, res, next) {
    let invite = req.fields.invite;
    let name = req.fields.name;
    let email = req.fields.email;
    let password = req.fields.password;

    let errors;
    if (errors) {
      req.session.errors = errors;
      res.redirect('/login');
    } else {
      creatNewUser(req.fields.invite, req.fields.name, req.fields.email, req.fields.password, req, res);
    }
  });



  /* Qureys routes for the database */

  router.get('/movies', function (req, res, next) {
    inventoryStatus('Movies In Stock', 'Largest inventory: ', '', res);
  });

  router.post('/submitrent', formidableMiddleware(), function (req, res) {
    updateRentedInventory(req.fields.title, req.fields.inventory, req.fields.email, res);
  });

  router.post('/submitNewCustomer', formidableMiddleware(), function (req, res) {
    submitNewCustomer(req.fields.name, req.fields.email, req.fields.phone, res)
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

  router.get('/logout', function(req,res,next){
    req.session.destroy(function(err) {
      if(err) console.log(err)
    });
    res.render('login');
  });



  function testInviteListForLogin(invite) {
    return new Promise(resolve => {
      usersCollection.findOne({
        inviteHash: 'tempInvite'
      }, {
        projection: {
          _id: 0,
          key: 1,
        }
      }, function (err, r) {
        if (err) console.log(err);

        if (r !== null) {
          bcrypt.compare(invite, r.key, function (err, bcRes) {
            if (err) console.log(err);
            if (bcRes) {
              resolve(true);
            } else {
              resulve(false);
            }
          })
        }
      })
    })
  }

  function inviteListForLogin(invite) {
    return new Promise(resolve => {
      bcrypt.hash(invite, saltRounds, function (err, hash) {

        usersCollection.findOneAndUpdate({
          inviteHash: 'tempInvite'
        }, {
          $set: {
            key: hash
          }
        }, function (err, r) {
          if (err) console.log(err);
          if (r !== null) {
            resolve(true);
          } else {
            resulve(false);
          }
        })
      })
    })
  }


  /* User login and creation: */

  //Creat New User - callback inventoryStatusInLogin

  async function creatNewUser(invite, name, email, password, req, res) {
    try {
      const testInvite = await testInviteListForLogin(invite);
      if (testInvite) {
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
                    if (r.result.n == 1) {;
                      // Callback if success 
                      startUserSession(email, 'Most Avialebel Inventory:', '', '', req, res);
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
      } else {
        res.render('login')
      }
    } catch (err) {
      console.log(err.stack);
    }
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
        req.session.userName = r.userName,
          req.session.cookie = {
            name: 'skiersAdmin',
            userName: r.userName,
            originalMaxAge: 1000 * 60 * 60 * 24 * 7
          };
          
        inventoryStatusInLogin(title, status, r.userName, req, res);
      }
    })
  }


  /* New Database functions: */

  async function submitNewCustomer(name, email, phone, res) {
    try {
      let query = {};

      if (name)
        query.name = name;

      if (phone)
        query.phone = phone;

      if (email)
        email = email.toLowerCase(),
        query.email = email;

      let r = await collection.findOneAndUpdate({
        'email': email
      }, {
        $set: query
      }, {
        upsert: true,
        projection: {
          '_id': 0,
          'email': 1
        },
        returnNewDocument: true
      });

      await res.send({
        moviesList: r.value,
        title: name,
        status: phone
      });
    } catch (err) {
      console.log(err.stack);
    }
  };








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
      console.log('inventoryStatus')
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

  function inventoryStatusInLogin(title, status, userName,req, res) {
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
      console.log('res.render - movies');



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

      let moviesList = [];
      for (let index in result) {
        let temp = 'Item: ' + result[index]._id + ' Current rented inventory: ' + result[index].rentedMovieInventory;
        moviesList.push(temp);
      }
      console.log('topTenMovies');
      res.send({
        moviesList: moviesList,
        title: 'Top 10 rented movies: ',
        status: ''
      });
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