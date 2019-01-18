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


  //clear cookie if session is over

  router.use(function (req, res, next) {
    if (req.session.cookie && !req.session.succes) {
      res.clearCookie('skiersAdmin');
    }
    next();
  });

  /* Router requests: */

  //First 
  router.get('/', function (req, res, next) {
    if (req.session.succes) {
      res.render('app', {
        userName: req.session.userName
      })
    } else {
      res.render('login');

    }
  })


  //While the user in session the system will stay active.

  router.get('/:id', function (req, res, next) {
    if (req.session.succes)
      next();

    else
      res.render('login');
  });

  //Handle user login request

  router.post('/user', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        loginAttempt(req.fields.email, req.fields.password, req, res);

      else
        sendJsonErr(err, res);
    });
  });

  //Handle new user singUp

  router.post('/addUser', formidableMiddleware(), function (req, res, next) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        creatNewUser(req.fields.invite, req.fields.name, req.fields.email, req.fields.password, req, res);

      else
        sendJsonErr(err, res);
    });
  });



  /* Qureys routes for the database */

  router.get('/app', function (req, res, next) {
    inventoryStatus('Items In Stock', 'Sort by highest inventory: ', '', res);
  });

  router.post('/submitrent', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        updateRentedInventory(req.fields, res);

      else
        sendJsonErr(err, res);
    })
  });

  router.post('/submitNewCustomer', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        submitNewCustomer(req.fields.name, req.fields.email, req.fields.phone, res);

      else
        sendJsonErr(err, res);
    })

  });

  router.post('/submitreturn', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        updateReturnedInventory(req.fields.title, req.fields.inventory, req.fields.email, res);

      else
        sendJsonErr(err, res);
    })
  });

  router.post('/addItemtodb', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        updateNewInventory(req.fields.title, req.fields.inventory, res);

      else
        sendJsonErr(err, res);
    })
  });


  router.post('/inventoryStatus', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        itemStatus(req.fields.title, res, function (err, r) {
          res.json(r);
        });
      else
        sendJsonErr(err, res);
    })
  });


  router.post('/userStatus', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
        userStatus(req.fields.email, res, function (err, r) {
          res.json(r);
        });

      else
        sendJsonErr(err, res);
    });
  });

  router.post('/userEmailReturnListForDropDown', formidableMiddleware(), function (req, res) {
    checkFormData(req.fields, res, function (err, r) {
      if (r)
      userEmailReturnListForDropDown( req.fields.email, res, function (err, r) {
          res.json(r);
        });

      else
        sendJsonErr(err, res);
    });
  });

  router.get('/topTenItems', function (req, res) {
    topTenItems(res);
  });

  router.get('/topTenUsers', function (req, res) {
    topTenUsers(res);
  });

  router.get('/mostActiveUser', function (req, res) {
    mostActiveUser(res);
  });

  router.get('/topRentedItem', function (req, res) {
    topRentedItem(res);
  });

  router.get('/itemTitle', function (req, res) {
    inventoryStatusListForDropDown(res, 1,  function (err, r) {
      res.json(r);
    });
  });
  router.get('/userEmailRent', function (req, res) {
    usersReturnListForDropDown(res, 0, function (err, r) {
      res.json(r);
    });
  });
  router.get('/itemTitleReturn', function (req, res) {
    inventoryStatusListForDropDown(res, 0,  function (err, r) {
      res.json(r);
    });
  });
  router.get('/userEmailReturn', function (req, res) {
    usersReturnListForDropDown(res, 1, function (err, r) {
      res.json(r);
    });
  });

  router.get('/login', function (req, res) {
    res.render('login');
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
      if (err) console.log(err)
    });
    res.clearCookie('skiersAdmin');
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
              resolve(false);
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
            resolve(false);
          }
        })
      })
    })
  }

  function sendJsonErr(err, res) {
    res.json({
      err: err
    });
  }

  function checkFormData(data, res, cb) {
    let passwordTest = data.password;
    let nameTest = data.name;
    let titleTest = data.title;
    let emailTest = data.email;
    let inventoryTest = data.inventory;
    let phoneTest = data.phone;
    let daysTest = data.days;
    let test = 0;
    let error = '';

    if (emailTest != undefined) {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let res = re.test(String(emailTest).toLowerCase());
      if (!res) {
        error += 'Sorry but you can\'t use this email, try a real one. ';
        test++;
      }
    };

    if (passwordTest != undefined) {
      let re =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{5,}$/;
      let res = re.test(String(passwordTest));
      if (!res) {
        errors += ' the assword is Minmum 5 character long + upper cases + lower cases + digits ';
      }
    }

    if (titleTest != undefined) {
      let re =
        /^[\W \D \S ]{3,100}$/;
      let res = re.test(String(titleTest));
      if (!res) {
        error += 'The title is at least 3 character long. ';
        test++;
      }
    };

    if (nameTest != undefined) {
      let re =
        /^[\W \D \S ]{3,100}$/;
      let res = re.test(String(nameTest));
      if (!res) {
        error += 'The customer name must be at least 3 character long. ';
        test++;
      }
    };
    if (phoneTest != undefined) {
      let re =
        /^[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{1,6}$/;
      let res = re.test(String(phoneTest));
      if (!res) {
        error += 'Phone number ex: 000-000-000000). ';
        test++;
      }
    };

    if (inventoryTest != undefined) {
      if (inventoryTest == 0) {
        error += 'The inventory cant be 0. ';
        test++;
      }
    };

    if (daysTest != undefined) {
      if (daysTest <= 0) {
        error += 'The days must be more than 0.';
        test++;
      }
    };

    if (test > 0) {
      test = 0;
      cb(error, false);

    } else {
      cb('', true)
    }
  };


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
                      startUserSession(email, ' Highest inventory in stock: ', '', '', req, res);
                    }
                  } else {
                    res.json({
                      err: 'User created, try login as registerd User'
                    });
                  }
                })
              } else {
                res.json({
                  err: 'The User is already created'
                });
              }
            })
          })
      } else {
        res.json({
          err: 'The invite is not valid! for a valid invite go to: https://shahary.com'
        });
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
                  startUserSession(email, ' Highest inventory in stock: ', '', '', req, res);

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
                  res.json({
                    err: 'Incorrect password '
                  });

              });
            }
          });
        } else
          res.json({
            err: 'The user is not registerd'
          });

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
        'name': name,
        'title': r.value,
        'status': phone
      });
    } catch (err) {
      console.log(err.stack);
    }
  };








  /* Database functions: */

  function updateNewInventory(title, inventory, res) {
    let query = {};
    let status = '';
    let currentItemI = 0;

    if (title)
      query.title = title;

    if (inventory)
      inventory = parseInt(inventory, 10);

    currentItemInventory(title, function (err, value) {
      currentItemI = value;

      if ((currentItemI + inventory) <= 0) {
        title = title + ' inventory was not update - inventory is too low',
          status = 'The maximum inventory to raduse is: ' + currentItemI,
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
            status = 'The inventory is: ' + (currentItemI + inventory);

          else if (r.lastErrorObject.upserted !== null)
            title = title + ' is new, inventory updated successfuly',
            status = 'The inventory is: ' + (currentItemI + inventory);

          inventoryStatus(title, status, '', res);
        });
      }
    });
  };


  function updateRentedInventory(req, res) {
    let query = {};
    let status = '';
    let currentItemI = 0;
    let inventory, title, days, email;
    //console.log(req)

    if (req.title)
      title = req.title,
      query.title = req.title;

    if (req.inventory)
      inventory = parseInt(req.inventory, 10),
    query.inventory = {
      $gte: inventory
    };
  

    if (req.email)
      email = req.email,
      query['activeUsers.email'] = req.email.toLowerCase();
    

    if(req.days)
      days = parseInt(req.days, 10);
    
    console.log(query)
    collection.findOneAndUpdate(query, {
        $inc: {
          'activeUsers.$.days': days,

          'activeUsers.$.inventory': inventory,
          inventory: -inventory
        }
      }, {
        upsert: true
      },
      function (err, r) {
        if (err) console.error(err);

        console.log(r);

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
              console.log(r)

              if (r.value !== null)
                title = title + ' inventory was updated to ' + inventory,
                status = email + ' have ' + inventory + ' new items',
                inventoryStatus(title, status, email, res);

              else
                currentItemInventory(title, function (err, value) {
                  currentItemI = value;
                  title = title + ' inventory wasent updated, the current inventory is: ' + currentItemI,
                    status = email + ' can rent only: ' + currentItemI + ' new items',
                    inventoryStatus(title, status, email, res);
                })
            });

        else
          currentUserInventory(title, email, function (err, value) {
            title = title + ' inventory was updated to' + (r.value.inventory - inventory),
              status = 'The user: ' + email + ' have ' + value + ' items include the ' + inventory + ' new items',
              inventoryStatus(title, status, email, res);
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
            inventoryStatus(title, status, email, res);
          });
        }
        if (r.value !== null) {
          currentUserInventory(title, email, function (err, value) {
            title = 'The item: ' + title + ' was returnd to stock, the current stock is: ' + (r.value.inventory + inventory),
              status = 'The user: ' + email + ' returnd ' + inventory + ' his total inventory for now is: ' + value;

            inventoryStatus(title, status, email, res);
          });
        }
      }
    )
  };





  /* Databas queries: */

  function currentItemInventory(title, cb) {
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
/*
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
*/
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


  function inventoryStatus(title, status, email, res) {
    try {
    if(email ===''){
      inventoryStatusList(res, function(err, r){
        res.send(r);
      });
    }else{
      collection.aggregate([
        {
          $match: {
            'activeUsers.email': email
          }
        },
        {
          $unwind: '$activeUsers'
        },
        {
          $match: {
            'activeUsers.email': email
          }
        },
        {
          $project: {
            _id: 0,
            title: 1,
            'activeUsers.inventory': 1
          }
        },
        
        {
          $group: {
            _id: '$title', 
            quantity: {$sum: '$activeUsers.inventory'}
          }
        },
        {
          $sort: {
            quantity: -1
          }
        },
        {
          $project:{
            _id:0,
            item:'$_id',
            quantity:'$quantity',
          }
        }
      ]).toArray(function (err, r) {
        console.log(r)
        res.send(r);
      });
    }
      } catch (err) {
      console.log(err)
    }
    
  };
  

  function inventoryStatusInLogin(title, status, userName, req, res) {
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
        res.render('app', {
          itemsList: [],
          title: 'No inventory in stock',
          status: err
        });

      let itemsList = [];
      for (let index in result) {
        let temp = result[index].title + ' - ' + result[index].inventory;
        itemsList.push(temp);
      }

      res.render('app', {
        itemsList: itemsList,
        title: title,
        status: status,
        userName: userName
      });
    })
  };



  /* BI Querys: */


  function topTenItems(res) {
    try {
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
          rentedItemInventory: {
            $sum: '$activeUsers.inventory'
          }
        }
      },
      {
        $sort: {
          rentedItemInventory: -1
        }
      },
      {
        $limit: 10
      },
      {
        $project:{
          _id:0,
          item:'$_id',
          quantity:'$rentedItemInventory',
        }
      }
    ]).toArray(function (err, result) {
      
        res.json(result);
      })
      } catch (err) {
        console.log(err)
      }
  };




  function topTenUsers(res) {
    try {
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
      },
      {
        $project:{
          _id:0,
          user:'$_id',
          quantity:'$userInventorySum',
        }
      }
    ]).toArray(function (err, result) {

        res.json(result);
      })
      } catch (err) {
        console.log(err)
      }
      //The top 10 active users
  };


  function mostActiveUser(res) {
    try {
    collection.aggregate([
      
      {$match:{
        'activeUsers.inventory':{ $gte:1}
      }
    },
    {
      $unwind: '$activeUsers'
    },
    {
      $group: {
        _id: '$activeUsers.email',
        totalQuantityG: {
          $sum: '$activeUsers.inventory'
        },
        rentedItems: {
          $push: {
            title: '$title',
            inventory: '$activeUsers.inventory'
          }
        }
      }
    },{
      $sort:{totalQuantityG: -1}
    },{$limit:1},{
      $unwind:'$rentedItems'
    },{
      $project:{
        _id:0,
        user:'$_id',
        item:'$rentedItems.title',
        quantity:'$rentedItems.inventory',
        totalQuantity:'$totalQuantityG'
      }
    }
    
    ]).toArray(function (err, result) {
      res.json(result);
    })
      } catch (err) {
        console.log(err)
      }
      //title: 'The highest inventory for singel user Is: ',
  };

  function inventoryStatusList(res, cb) {
    try {
    collection.aggregate([{
        $match: {
          inventory: {
            $gte: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          inventory: 1
        }
      }, {
        $sort: {
          title: 1
        }
      },
      {
        $project:{
          _id:0,
          item:'$title',
          quantity:'$inventory',
        }
      }
    ]).toArray(function (err, r) {
      cb(err, r);
    })
      } catch (err) {
        console.log(err)
      }
    
  };

  function inventoryStatusListForDropDown(res, n, cb) {
    try {
    collection.aggregate([{
        $match: {
          inventory: {
            $gte: n
          }
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          inventory: 1
        }
      }, {
        $sort: {
          title: 1
        }
      },
      {
        $project:{
          label:'$inventory',
          item: '$title'
         
        }
      }
    ]).toArray(function (err, r) {
      console.log(r)
      cb(err, r);
    })
      } catch (err) {
        console.log(err)
      }
  };

  function usersReturnListForDropDown(res,n, cb) {
    try {
    collection.aggregate([
      {
        $match: {
          'activeUsers.inventory':{ $gte: n}
        }
      },
      {
        $unwind: '$activeUsers'
      },
      {
        $match: {
          'activeUsers.inventory':{ $gte: n}
        }
      },
      {
        $project: {
          _id: 0,
          e: '$activeUsers.email',
          q:'$activeUsers.inventory'

        }
      },
      
      {
        $group: {
          _id: '$e', 
          quantity:{$sum:'$q'}
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $project:{
          _id:0,
          item:'$_id',
          label:'$quantity',
        }
      }
    ]).toArray(function (err, r) {
      cb(err, r);
    })
      } catch (err) {
        console.log(err)
      }
  };

  function userEmailReturnListForDropDown(email, res,  cb) {
    try {
    collection.aggregate([
      {
        $match: {
          'activeUsers.email':email
        }
      },
      {
        $unwind: '$activeUsers'
      },
      {
        $match: {
          'activeUsers.email':email
        }
      },
      {
        $project: {
          _id: 0,
          label:'$activeUsers.inventory',
          item: '$title'
        }
      },
    ]).toArray(function (err, r) {
      cb(err, r);
    })
      } catch (err) {
        console.log(err)
      }
  };


  function itemStatus(title, res, cb) {
    try {
    collection.aggregate([{
        $match: {
          title: title
        }
      },
      {
        $project: {
          _id: 0,
          item:'$title',
          quantity:'$inventory'
        }
      }
    
    ]).toArray(function (err, r) {
        cb(err, r);
      })
      } catch (err) {
        console.log(err)
      }
    
  };


  function userStatus(email, res, cb) {
    try {
    collection.aggregate([
      {
        $match: {
          'activeUsers.email': email
        }
      },
      {
        $unwind: '$activeUsers'
      },
      {
        $match: {
          'activeUsers.email': email
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          'activeUsers.inventory': 1
        }
      },
      
      {
        $group: {
          _id: '$title', 
          quantity: {$sum: '$activeUsers.inventory'}
        }
      },
      {
        $sort: {
          quantity: -1
        }
      },
      {
        $project:{
          _id:0,
          item:'$_id',
          quantity:'$quantity',
        }
      }
    ]).toArray(function (err, r) {
      cb(err, r);
    });
    } catch (err) {
    console.log(err)
  }
  };

  function topRentedItem(res) {
    try {
    collection.aggregate([
      {
        $match:{'activeUsers.inventory': {$gte: 1}
        }
      },
      {
        $unwind: '$activeUsers'
      },
      {
        $group: {
          _id: '$title',
          quantity: {
            $sum: '$activeUsers.inventory'
          }
        }
      },{
        $sort:{
          quantity:-1
        }
      },{
        $limit:1
      },
      {
        $project:{
          _id:0,
          item:'$_id',
          quantity:'$quantity',
        }
      }
    ]).toArray(function (err, result) {
        res.json(result);
    })
  } catch (err) {
    console.log(err)
  }
  };

});


module.exports = router;