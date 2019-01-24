module.exports.check = async (data) => {
	const passwordTest = data.password;
	const nameTest = data.name;
	const titleTest = data.title;
	const emailTest = data.email;
	const inventoryTest = data.inventory;
	const phoneTest = data.phone;
	const daysTest = data.days;
	let test = 0;
	let error = '';

	try {
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
			return (false);

		} else {
			return (true);
		}

	} catch (err) {
		console.trace(err);
		return (false);
	}
};