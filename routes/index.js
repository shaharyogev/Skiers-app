const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';
const client = MongoClient(usersdbUrl, {
	useNewUrlParser: true
});
const session = require('express-session');
const formidableMiddleware = require('express-formidable');
let inviteListForLogIn;

const forms = require('../utilities/forms');
const qdb = require('../utilities/db');




/*MAP*/

/*Start the Database connection: */

/* Session & cookies */
// Log user session to the cookie

/* User login and creation: */
//Creat New User - callback inventoryStatusInLogin
// Login check user email and password - callback getUserName

/* Database functions: */

/* Router requests: */

/* Queries routes */

/* Database queries: */

/* BI Queries: */


/*Start the Database connection: */

client.connect(function(err, db) {
	if (err)
		console.log(err);

	const mydb = db.db('usersdb');
	const collection = mydb.collection('appData');
	//exports.collection = collection;
	const usersCollection = mydb.collection('usersList');
	exports.usersCollection = usersCollection;
	qdb.getCollection(collection);

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

	router.use((req, res, next) => {
		if (req.session.cookie && !req.session.success) {
			res.clearCookie('skiersAdmin');
		}
		next();
	});

	/* Router requests: */

	//First 
	router.get('/', (req, res) => {

		if (req.session.success)
			res.render('app', {
				userName: req.session.userName
			});

		else
			res.render('login');

	});

	router.get('/login', (req, res) => {
		res.render('login');
	});

	router.get('/logout', async (req, res) => {
		try {

			await req.session.destroy();
			await res.clearCookie('skiersAdmin');
			await res.render('login');

		} catch (err) {
			console.trace(err);
			return (res.render('login'));
		}
	});

	//While the user in session the system will stay active.

	router.get('/:id', (req, res, next) => {
		if (req.session.success)
			next();

		else
			res.render('login');
	});

	//Handle user login request

	router.post('/user', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) 
			loginAttempt(req.fields.email, req.fields.password, req, res);

		else
			sendJsonErr(err, res);
	});

	//Handle new user singUp

	router.post('/addUser', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) 
			creatNewUser(req.fields.invite, req.fields.name, req.fields.email, req.fields.password, req, res);

		else
			sendJsonErr(err, res);
	});



	/* Queries routes for the database */

	router.get('/app', async (req, res) => {
		const result = await qdb.inventoryStatusListA();
		return (res.send(result));
	});




	router.post('/submitNewCustomer', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await qdb.submitNewCustomerA(req.fields.name, req.fields.email, req.fields.phone);
			return res.send(result);
		} else
			sendJsonErr(err, res);
	});


	router.post('/submitRent', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await qdb.updateRentedInventoryA(req.fields);
			return res.send(result);
		} else
			sendJsonErr(err, res);
	});



	router.post('/submitReturn', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await qdb.updateReturnedInventoryA(req.fields.title, req.fields.inventory, req.fields.email);
			return res.send(result);
		} else
			sendJsonErr(err, res);
	});


	router.post('/addItemtodb', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await qdb.updateNewInventoryA(req.fields.title, req.fields.inventory);
			return (res.send(result));

		} else
			sendJsonErr(err, res);
	});




	router.post('/userStatus', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await qdb.userStatusA(req.fields.email);
			return (res.send(result));
		} else
			sendJsonErr(err, res);

	});

	router.post('/userEmailReturnListForDropDown', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await qdb.userEmailReturnListForDropDownA(req.fields.email);
			return (res.send(result));
		} else
			sendJsonErr(err, res);

	});



	router.get('/itemTitle', async (req, res) => {
		const result = await qdb.inventoryStatusListForDropDownA(1);
		return (res.send(result));
	});

	router.get('/itemTitleReturn', async (req, res) => {
		const result = await qdb.inventoryStatusListForDropDownA(0);
		return (res.send(result));
	});

	router.get('/userEmailRent', async (req, res) => {
		const result = await qdb.usersReturnListForDropDownA(0);
		return (res.send(result));
	});


	router.get('/userEmailReturn', async (req, res) => {
		const result = await qdb.usersReturnListForDropDownA(1);
		return (res.send(result));
	});


	router.get('/topTenItems', function(req, res) {
		topTenItems(res);
	});

	router.get('/topTenUsers', function(req, res) {
		topTenUsers(res);
	});

	router.get('/mostActiveUser', function(req, res) {
		mostActiveUser(res);
	});

	router.get('/topRentedItem', function(req, res) {
		topRentedItem(res);
	});



	function sendJsonErr(err, res) {
		res.json({
			err: err
		});
	}


	const testInviteListForLoginA = async (invite) => {
		try {
			const r = await usersCollection.findOne({
				inviteHash: 'tempInvite'
			}, {
				projection: {
					_id: 0,
					key: 1,
				}
			});
			await console.log(r);
			if (r !== null) {
				const bcRes = await bcrypt.compare(invite, r.key);

				await console.log(bcRes);
				if (bcRes)
					return (true);

				else
					return (false);
			} else
				return (false);

		} catch (err) {
			console.trace(err);
		}
	};

	const inviteListForLoginA = async (invite) => {
		try {
			const hash = await bcrypt.hash(invite, saltRounds);

			const r = await usersCollection.findOneAndUpdate({
				inviteHash: 'tempInvite'
			}, {
				$set: {
					key: hash
				}
			});

			if (r !== null)
				return (true);
			else
				return (false);

		} catch (err) {
			console.trace(err);
		}
	};



	const creatNewUser = async (invite, name, email, password, req, res) => {

		try {

			const testInvite = await testInviteListForLoginA(invite);

			if (testInvite) {

				if (name)
					name = name.toLowerCase();

				if (email)
					email = email.toLowerCase();

				if (password) {
					const hash = await bcrypt.hash(password, saltRounds);
				}

				const r = await usersCollection.findOne({
					email: email
				});

				if (r == null) {

					const r2 = await usersCollection.insertOne({
						userName: name,
						email: email,
						key: hash
					});

					if (r2 !== null) {
						if (r2.result.n == 1)
							startUserSession(email, req, res);

						else
							res.json({
								err: 'User created, try login as registered User'
							});

					}
				} else
					res.json({
						err: 'The User is already created'
					});


			} else
				res.json({
					err: 'The invite is not valid! for a valid invite go to: https://shahary.com'
				});

		} catch (err) {
			console.trace(err);
		}
	};


	// Login check user email and password - callback getUserName
	const loginAttempt = async (email, password, req, res) => {
		try {

			if (email)
				email = email.toLowerCase();

			if (password) {
				const findRes = await usersCollection.findOne({
					email: email
				}, {
					projection: {
						_id: 0,
						key: 1,
						userName: 1
					}
				});

				if (findRes !== null) {
					const bcRes = await bcrypt.compare(password, findRes.key);

					if (bcRes) {
						const r = await usersCollection.updateOne({
							email: email
						}, {
							$inc: {
								loginSuccessfully: +1
							}
						}, {
							upsert: true
						});

						if (r.result.n == 1)
							startUserSession(email, req, res);

					} else {
						const r = await usersCollection.updateOne({
							email: email
						}, {
							$inc: {
								loginUnsuccessfully: +1
							}
						}, {
							upsert: true
						});
						if (r.result.n == 1)
							res.json({
								err: 'Incorrect password '
							});
					}
				} else
					res.json({
						err: 'The user is not registered'
					});
			}
		} catch (err) {
			console.trace(err);
		}
	};

	//On success login activate the user session

	const startUserSession = async (email, req, res) => {
		try {
			const r = await usersCollection.findOne({
				email: email
			}, {
				projection: {
					_id: 0,
					userName: 1
				}
			});

			if (r !== null) {

				req.session.success = true,
				req.session.userName = r.userName,
				req.session.cookie = {
					name: 'skiersAdmin',
					userName: r.userName,
					originalMaxAge: 1000 * 60 * 60 * 24 * 7
				};

				res.render('app', {
					userName: r.userName
				});
			}
		} catch (err) {
			console.trace(err);
		}
	};









	/* Database queries: */



	



	/* BI Queries: */


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
				$project: {
					_id: 0,
					item: '$_id',
					quantity: '$rentedItemInventory',
				}
			}
			]).toArray(function(err, result) {

				res.json(result);
			});
		} catch (err) {
			console.log(err);
		}
	}




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
				$project: {
					_id: 0,
					user: '$_id',
					quantity: '$userInventorySum',
				}
			}
			]).toArray(function(err, result) {

				res.json(result);
			});
		} catch (err) {
			console.log(err);
		}
		//The top 10 active users
	}


	function mostActiveUser(res) {
		try {
			collection.aggregate([

				{
					$match: {
						'activeUsers.inventory': {
							$gte: 1
						}
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
								inventory: '$activeUsers.inventory',
								days: '$activeUsers.days'
							}
						}
					}
				}, {
					$sort: {
						totalQuantityG: -1
					}
				}, {
					$limit: 1
				}, {
					$unwind: '$rentedItems'
				}, {
					$project: {
						_id: 0,
						user: '$_id',
						item: '$rentedItems.title',
						quantity: '$rentedItems.inventory',
						days: '$rentedItems.days'
					}
				}

			]).toArray(function(err, result) {
				res.json(result);
			});
		} catch (err) {
			console.log(err);
		}
	}








	function topRentedItem(res) {
		try {
			collection.aggregate([{
				$match: {
					'activeUsers.inventory': {
						$gte: 1
					}
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
			}, {
				$sort: {
					quantity: -1
				}
			}, {
				$limit: 1
			},
			{
				$project: {
					_id: 0,
					item: '$_id',
					quantity: '$quantity',
				}
			}
			]).toArray(function(err, result) {
				res.json(result);
			});
		} catch (err) {
			console.log(err);
		}
	}

});

module.exports = router;