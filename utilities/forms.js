/*Form module with check function test all form input fields*/
//
//The throw with catch will send back to the user the message with the err  

module.exports.check = async (data, res) => {
	const passwordTest = data.password;
	const nameTest = data.name;
	const titleTest = data.title;
	const emailTest = data.email;
	const inventoryTest = data.inventory;
	const phoneTest = data.phone;
	const daysTest = data.days;

	try {
		if (!data)
			throw 'form data is undefined';

		if (emailTest !== undefined) {
			const re =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			let res = re.test(String(emailTest).toLowerCase());
			if (!res)
				throw 'Sorry but you can\'t use this email, try a real one. ';
		}

		if (passwordTest !== undefined) {
			const re =
				/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{5,}$/;
			let res = re.test(String(passwordTest));
			if (!res)
				throw ' the password is Minimum 5 character long + upper cases + lower cases + digits ';
		}

		if (titleTest !== undefined) {
			const re =
				/^[\W \D \S ]{3,100}$/;
			let res = re.test(String(titleTest));
			if (!res)
				throw 'The title is at least 3 character long. ';
		}

		if (nameTest !== undefined) {
			const re =
				/^[\W \D \S ]{3,100}$/;
			let res = re.test(String(nameTest));
			if (!res)
				throw 'The customer name must be at least 3 character long. ';
		}

		if (phoneTest !== undefined) {
			const re =
				/^[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{1,6}$/;
			let res = re.test(String(phoneTest));
			if (!res)
				throw 'Phone number ex: 000-000-000000). ';
		}

		if (inventoryTest !== undefined) {
			if (inventoryTest === 0)
				throw 'The inventory cant be 0. ';
		}

		if (daysTest !== undefined) {
			if (daysTest <= 0)
				throw 'The days must be more than 0.';
		}

		return (true);

	} catch (err) {
		console.trace(err);
		res.json({
			err: err
		});
		return (false);
	}
};