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

	router.post('/user', formidableMiddleware(), (req, res) => {
		checkFormData(req.fields, res, function(err, r) {
			if (r)
				loginAttempt(req.fields.email, req.fields.password, req, res);

			else
				sendJsonErr(err, res);
		});
	});

	//Handle new user singUp

	router.post('/addUser', formidableMiddleware(), (req, res) => {
		checkFormData(req.fields, res, function(err, r) {
			if (r)
				creatNewUser(req.fields.invite, req.fields.name, req.fields.email, req.fields.password, req, res);

			else
				sendJsonErr(err, res);
		});
	});



	/* Queries routes for the database */

	router.get('/app', async (req, res) => {
		const result = await qdb.inventoryStatusListA();
		return (res.send(result));
	});




	router.post('/submitNewCustomer', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r)
			await submitNewCustomer(req.fields.name, req.fields.email, req.fields.phone, res);

		else
			sendJsonErr(err, res);
	});


	router.post('/submitRent', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r)
			await updateRentedInventory(req.fields, res);

		else
			sendJsonErr(err, res);
	});



	router.post('/submitReturn', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r)
			await updateReturnedInventory(req.fields.title, req.fields.inventory, req.fields.email, res);

		else
			sendJsonErr(err, res);
	});


	router.post('/addItemtodb', formidableMiddleware(), async (req, res) => {
		const r = await forms.check(req.fields);
		if (r) {
			const result = await updateNewInventory(req.fields.title, req.fields.inventory);
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
		}

		if (passwordTest != undefined) {
			let re =
				/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{5,}$/;
			let res = re.test(String(passwordTest));
			if (!res) {
				error += ' the password is Minimum 5 character long + upper cases + lower cases + digits ';
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
		}

		if (nameTest != undefined) {
			let re =
				/^[\W \D \S ]{3,100}$/;
			let res = re.test(String(nameTest));
			if (!res) {
				error += 'The customer name must be at least 3 character long. ';
				test++;
			}
		}
		if (phoneTest != undefined) {
			let re =
				/^[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{1,6}$/;
			let res = re.test(String(phoneTest));
			if (!res) {
				error += 'Phone number ex: 000-000-000000). ';
				test++;
			}
		}

		if (inventoryTest != undefined) {
			if (inventoryTest == 0) {
				error += 'The inventory cant be 0. ';
				test++;
			}
		}

		if (daysTest != undefined) {
			if (daysTest <= 0) {
				error += 'The days must be more than 0.';
				test++;
			}
		}

		if (test > 0) {
			test = 0;
			cb(error, false);

		} else {
			cb('', true);
		}
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

	const startUserSession =  async (email, req, res)=> {
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
			console.log(err);
		}
	}








	/* Database functions: */

	async function updateNewInventory(title, inventory) {
		let query = {};
		let status = '';
		try {

			if (title)
				query.title = title;

			if (inventory)
				inventory = parseInt(inventory, 10);

			const currentItemI = await currentItemInventory(title);


			if ((currentItemI + inventory) <= 0) {

				title = title + ' inventory was not update - inventory is too low';
				status = 'The maximum inventory to reduce is: ' + currentItemI;

				return ({
					title,
					status
				});


			} else {
				const r = await collection.findOneAndUpdate(query, {
					$inc: {
						inventory: inventory
					}
				}, {
					upsert: true
				});

				if (r == null)
					title = 'The item: ' + title + ' wasn\'t add to the Inventory!',
					status = 'There was a problem';

				else if (r.value !== null)
					title = title + ' inventory was updated successfully',
					status = 'The inventory is: ' + (currentItemI + inventory);

				else if (r.lastErrorObject.upserted !== null)
					title = title + ' is new, inventory updated successfully',
					status = 'The inventory is: ' + (currentItemI + inventory);

				return ({
					title,
					status
				});
			}
		} catch (err) {
			console.trace(err);
			return ({
				title: 'Error',
				status: err
			});
		}
	}




	async function updateRentedInventory(req, res) {

		let query = {};
		let status = '';
		let inventory, title, days, email;

		try {
			if (req.title)
				title = req.title,
				query.title = req.title;

			if (req.inventory)
				inventory = parseInt(req.inventory, 10),
				query.inventory = {
					$gte: inventory
				};


			if (req.email)
				email = req.email.toLowerCase(),
				query['activeUsers.email'] = email;


			if (req.days)
				days = parseInt(req.days, 10);

			const r = await collection.findOneAndUpdate(query, {
				$inc: {
					'activeUsers.$.days': days,
					'activeUsers.$.inventory': inventory,
					inventory: -inventory
				}
			}, {
				upsert: true
			});

			if (r === null) {
				const r2 = await collection.findOneAndUpdate({
					title: title,
					inventory: {
						$gte: inventory
					}
				}, {
					$addToSet: {
						activeUsers: {
							email: email,
							inventory: inventory,
							days: days
						}
					},
					$inc: {
						inventory: -inventory
					}
				});

				if (r2.value !== null)
					status = 'Order updated by: ' + inventory + ' ' + title;

			} else
				status = 'Order updated by:  ' + inventory + ' ' + title;

			const itemsList = await qdb.userStatusA(email);

			return (res.send({
				status: status,
				itemsList: itemsList
			}));

		} catch (err) {
			console.log(err);

			const itemsList = await qdb.userStatusA(email);
			status = inventory + ' ' + title + ' cant be rented, check the inventory stock.';

			return (
				res.send({
					status: status,
					itemsList: itemsList
				})
			);
		}
	}



	async function updateReturnedInventory(title, inventory, email, res) {

		try {
			let queryResult;
			let query = {};
			let status = '';

			if (title)
				query.title = title;

			if (inventory)
				inventory = parseInt(inventory, 10);

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

			queryResult = await collection.findOneAndUpdate(query, {
				$inc: {
					'activeUsers.$.inventory': -inventory,
					inventory: inventory
				}
			}, {
				upsert: false,
				returnNewDocument: true
			},
			function(err, r) {
				if (r.value === null) {
					status = title + ' wasn\'t returned to stock! The user cant return the amount of: ' + inventory;
				}
				if (r.value !== null) {
					status = inventory + ' ' + title + ' returned to stock';
				}

				return (r);
			});

			let itemsList = await inventoryStatusAsync(email);

			await res.send({
				status: status,
				itemsList: itemsList
			});
		} catch (err) {
			console.log(err);
			res.send({
				err: err
			});
		}
	}


	/* Database queries: */

	async function currentItemInventory(title) {
		try {
			const value = await collection.findOne({
				title: title
			}, {
				projection: {
					_id: 0,
					inventory: 1
				}
			});

			return (value.inventory);

		} catch (err) {
			console.trace(err);
			return (0);
		}
	}


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
		function(err, result) {
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
					function(err, r) {
						if (err)
							console.log(err);

						cb(null, value);
					});
				}
				cb(null, value);
			}
		});
	}


	async function inventoryStatusAsync(email) {
		try {
			collection.aggregate([{
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
					quantity: {
						$sum: '$activeUsers.inventory'
					}
				}
			},
			{
				$sort: {
					quantity: -1
				}
			},
			{
				$project: {
					_id: 0,
					item: '$_id',
					quantity: '$quantity',
				}
			}
			]).toArray(function(err, r) {
				console.trace(r);
				return (r);
			});

		} catch (err) {
			console.log(err);
			return (err);
		}
	}


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
		]).toArray(function(err, result) {
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
		});
	}



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