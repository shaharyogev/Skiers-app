//const index = require('../routes/index');
let collection;

module.exports.getCollection = async (obj) => {
	collection = obj;
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