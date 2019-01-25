const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const usersdbUrl = 'mongodb://127.0.0.1:27017/usersdb';
const client = MongoClient(usersdbUrl, {
	useNewUrlParser: true
});
const session = require('express-session');
const formidableMiddleware = require('express-formidable');

const forms = require('../utilities/forms');
const qdb = require('../utilities/db');
const login = require('../utilities/login');




/*MAP*/

/*Start the Database connection: */

/* Session & cookies */

/* Router requests: */

/* User login and creation: login module*/

/* Queries routes */

/* Database queries: qdb module */

/* BI Queries: qdb module */


/*Start the Database connection: */

client.connect((err, db) => {
	try {


		const mydb = db.db('usersdb');
		const collection = mydb.collection('appData');
		const usersCollection = mydb.collection('usersList');
		qdb.getCollection(collection);
		login.getUsersCollection(usersCollection);

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

		router.get('/logout', (req, res) => {
			req.session.destroy();
			res.clearCookie('skiersAdmin');
			res.render('login');
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
				login.loginAttempt(req.fields.email, req.fields.password, req, res);

			else
				sendJsonErr(err, res);
		});

		//Handle new user singUp

		router.post('/addUser', formidableMiddleware(), async (req, res) => {
			const r = await forms.check(req.fields);
			if (r)
				login.creatNewUser(req.fields.invite, req.fields.name, req.fields.email, req.fields.password, req, res);

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

		router.post('/addItemToDb', formidableMiddleware(), async (req, res) => {
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

		router.get('/topTenItems', async (req, res) => {
			const result = await qdb.topTenItemsA();
			return (res.send(result));

		});

		router.get('/topTenUsers', async (req, res) => {
			const result = await qdb.topTenUsersA();
			return (res.send(result));

		});

		router.get('/mostActiveUser', async (req, res) => {
			const result = await qdb.mostActiveUserA();
			return (res.send(result));

		});

		router.get('/topRentedItem', async (req, res) => {
			const result = await qdb.topRentedItemA();
			return (res.send(result));

		});


		const sendJsonErr = (err, res) => {
			res.json({
				err: err
			});
		};

	} catch (err) {
		console.trace(err);
	}
});

module.exports = router;