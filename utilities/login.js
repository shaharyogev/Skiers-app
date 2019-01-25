const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
let usersCollection;

module.exports.getUsersCollection = async (c2) => {
	usersCollection = c2;
};

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
		if (r !== null) {
			const bcRes = await bcrypt.compare(invite, r.key);

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


module.exports.creatNewUser = async (invite, name, email, password, req, res) => {
	try {
		const testInvite = await testInviteListForLoginA(invite);
		if (testInvite) {

			if (name)
				name = name.toLowerCase();

			if (email)
				email = email.toLowerCase();

			if (password){
				const hash = await bcrypt.hash(password, saltRounds);
		
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
			}
		} else
			res.json({
				err: 'The invite is not valid! for a valid invite go to: https://shahary.com'
			});

	} catch (err) {
		console.trace(err);
	}
};


// Login check user email and password - callback getUserName
module.exports.loginAttempt = async (email, password, req, res) => {
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


