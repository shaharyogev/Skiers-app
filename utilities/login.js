/*Login module handle registered user login and new user creation */ 

const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
let usersCollection;

//
// Get active usersCollection object after successful database connection
module.exports.getUsersCollection = async (c2) => {
	usersCollection = c2;
};



//
// Test invite validation 
const testInviteListForLoginA = async (invite) => {
	try {
		//
		// Query usersCollection for a specific hash
		const r = await usersCollection.findOne({
			inviteHash: 'tempInvite'
		}, {
			projection: {
				_id: 0,
				key: 1,
			}
		});
		//
		// Compare
		if (typeof r !== 'undefined' && r !== null) {
			const bcRes = await bcrypt.compare(invite, r.key);
			//
			// Test result 
			if (bcRes)
				return (true);

			else
				throw 'Invite is not valid';

		} else
			throw 'Invite test function err';

	} catch (err) {
		console.trace(err);
		return (false);
	}
};


//
// Creat new invite 
const inviteListForLoginA = async (invite) => {
	try {
		//
		// Creat new invite hash
		const hash = await bcrypt.hash(invite, saltRounds);
		//
		// Insert to usersCollection
		const r = await usersCollection.findOneAndUpdate({
			inviteHash: 'tempInvite'
		}, {
			$set: {
				key: hash
			}
		},
		{
			upsert:true	
		});
		//
		// Test for successful operation
		if (typeof r !== 'undefined' && r !== null)
			return (true);

		else
			throw 'Invite is not valid';

	} catch (err) {
		console.trace(err);
		return (false);
	}
};


//
// Creat new user credentials for login
module.exports.creatNewUser = async (invite, name, email, password, req, res) => {
	try {
		//
		// Test invite validation 
		const testInvite = await testInviteListForLoginA(invite);

		if (testInvite) {

			if (name)
				name = name.toLowerCase();

			if (email)
				email = email.toLowerCase();

			//
			// Creat password hash and store for the new user, no password string storing only hash  
			if (password) {
				const hash = await bcrypt.hash(password, saltRounds); // Generate password hash
				//
				// Test if the user is already registered 
				const r = await usersCollection.findOne({
					email: email
				});
				//
				// Test if the user is already registered
				if (typeof r !== 'undefined' && r == null) {
					//
					// Creat new user
					const r2 = await usersCollection.insertOne({
						userName: name,
						email: email,
						key: hash
					});
					//
					// Test for successful operation
					if (typeof r2 !== 'undefined' && r2 !== null) {
						//
						// if success start session and login, callback startUserSession
						if (r2.result.n == 1)
							startUserSession(email, name, req, res);

						else
							throw 'User created, try login as registered User';
					}
				} else
					throw 'The User is already created';
			}
		} else
			throw 'The invite is not valid! for a valid invite go to: https://shahary.com';

	} catch (err) {
		console.trace(err);
		res.json({
			err: err
		});
	}
};

//
// Login test user email and password 
module.exports.loginAttempt = async (email, password, req, res) => {
	try {

		if (email)
			email = email.toLowerCase();
		//
		// Get password hash and user name
		if (password) {
			const r = await usersCollection.findOne({
				email: email
			}, {
				projection: {
					_id: 0,
					key: 1,
					userName: 1
				}
			});
			//
			// Test password hash
			if (typeof r !== 'undefined' && r !== null) {
				//
				// Generate new hash from input and compere with existing 
				const bcRes = await bcrypt.compare(password, r.key);

				//
				// On successful operation log user login event and start new session
				if (bcRes) {
					const r2 = await usersCollection.updateOne({
						email: email
					}, {
						$inc: {
							loginSuccessfully: +1
						}
					}, {
						upsert: true
					});

					if (typeof r2 !== 'undefined' && r2.result.n == 1)
						startUserSession(email, r.userName, req, res);

					//
					// On unsuccessful operation log user unsuccessful login event and throw err
				} else {
					const r2 = await usersCollection.updateOne({
						email: email
					}, {
						$inc: {
							loginUnsuccessfully: +1
						}
					}, {
						upsert: true
					});

					if (typeof r2 !== 'undefined' && r2.result.n == 1)
						throw 'Incorrect password ';

				}
			} else
				throw 'The user is not registered';

		}
	} catch (err) {
		console.trace(err);
		res.json({
			err: err
		});
	}
};


//
//On successful login activate the user session and render the app view
const startUserSession = async (email, userName, req, res) => {
	try {
		req.session.success = true,
		req.session.userName = userName,
		req.session.cookie = {
			name: 'skiersAdmin',
			userName: userName,
			originalMaxAge: 1000 * 60 * 60 * 24 * 7
		};

		res.render('app', {
			userName: userName
		});

	} catch (err) {
		console.trace(err);
		res.render('login');
	}
};
