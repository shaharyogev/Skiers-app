//const index = require('../routes/index');
let collection, usersCollection;

module.exports.getCollection = async (c1, c2) => {
	collection = c1;
	usersCollection = c2;
};


module.exports.userStatusA = async (email) => {
	try {
		const r = await collection.aggregate([{
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
		]).toArray();

		return (r);

	} catch (err) {
		console.trace(err);
		return (err);
	}
};


module.exports.userEmailReturnListForDropDownA = async (email) => {

	try {
		const r = await collection.aggregate([{
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
				label: '$activeUsers.inventory',
				item: '$title'
			}
		},
		]).toArray();
		return (r);

	} catch (err) {
		console.trace(err);
		return (err);
	}
};

module.exports.inventoryStatusListA = async () => {

	try {
		const r = await collection.aggregate([{
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
			$project: {
				_id: 0,
				item: '$title',
				quantity: '$inventory',
			}
		}
		]).toArray();
		return (r);

	} catch (err) {
		console.trace(err);
		return (err);
	}
};

module.exports.inventoryStatusListForDropDownA = async (n) => {

	try {
		const r = await collection.aggregate([{
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
			$project: {
				label: '$inventory',
				item: '$title'
			}
		}
		]).toArray();
		return (r);
	} catch (err) {
		console.trace(err);
		return (err);

	}
};

module.exports.usersReturnListForDropDownA = async (n) => {

	try {
		const r = await collection.aggregate([{
			$match: {
				'activeUsers.inventory': {
					$gte: n
				}
			}
		},
		{
			$unwind: '$activeUsers'
		},
		{
			$match: {
				'activeUsers.inventory': {
					$gte: n
				}
			}
		},
		{
			$project: {
				_id: 0,
				e: '$activeUsers.email',
				q: '$activeUsers.inventory'

			}
		},

		{
			$group: {
				_id: '$e',
				quantity: {
					$sum: '$q'
				}
			}
		},
		{
			$sort: {
				_id: 1
			}
		},
		{
			$project: {
				_id: 0,
				item: '$_id',
				label: '$quantity',
			}
		}
		]).toArray();
		return (r);
	} catch (err) {
		console.trace(err);
		return (err);

	}
};


module.exports.inventoryStatusA = async(email)=> {
	try {
		const r = await collection.aggregate([{
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
		]).toArray();

		return (r);

	} catch (err) {
		console.log(err);
		return (err);
	}
};
	

module.exports.submitNewCustomerA = async (name, email, phone) => {
	try {
		let query = {};

		if (name)
			query.name = name;

		if (phone)
			query.phone = phone;

		if (email)
			email = email.toLowerCase(),
			query.email = email;

		const r = await collection.findOneAndUpdate({
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

		return ({
			'name': name,
			'title': r.value,
			'status': phone
		});
	} catch (err) {
		result({
			err: err
		});
		console.log(err);
	}
};

module.exports.updateNewInventoryA = async (title, inventory)=> {
	let query = {};
	let status = '';
	try {

		if (title)
			query.title = title;

		if (inventory)
			inventory = parseInt(inventory, 10);

		const currentItemI = await currentItemInventoryA(title);


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
};

const currentItemInventoryA = async(title)=> {
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
};


module.exports.updateRentedInventoryA = async (req) => {

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

		return ({
			status: status,
			itemsList: itemsList
		});

	} catch (err) {
		console.log(err);

		const itemsList = await qdb.userStatusA(email);
		status = inventory + ' ' + title + ' cant be rented, check the inventory stock.';

		return ({
			status: status,
			itemsList: itemsList
		});
	}
};



module.exports.updateReturnedInventoryA = async (title, inventory, email) => {

	try {
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

		const r = await collection.findOneAndUpdate(query, {
			$inc: {
				'activeUsers.$.inventory': -inventory,
				inventory: inventory
			}
		}, {
			upsert: false,
			returnNewDocument: true
		});

		if (r.value === null) {
			status = title + ' wasn\'t returned to stock! The user cant return the amount of: ' + inventory;
		}

		if (r.value !== null) {
			status = inventory + ' ' + title + ' returned to stock';
		}

		let itemsList = await qdb.inventoryStatusA(email);

		return ({
			status: status,
			itemsList: itemsList
		});
	} catch (err) {
		console.log(err);
		return ({
			err: err
		});
	}
};