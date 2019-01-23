function loginToggle(b) {
	let loginTabA = document.getElementById('loginTabA');
	let loginTabB = document.getElementById('loginTabB');
	if (b === 1) {
		loginTabA.style.display = 'flex';
		loginTabB.style.display = 'none';
	} else {
		loginTabA.style.display = 'none';
		loginTabB.style.display = 'flex';
	}
}


function checkForm(id, nextNum) {
	event.preventDefault();
	let formId = document.getElementById(id);
	let formDataNode = formId.querySelectorAll('input');
	let formAction = formId.action;
	let emailTest = formId.querySelector('input[name="email"]');
	let passwordTest = formId.querySelector('input[name="password"]');
	let nameTest = formId.querySelector('input[name="name"]');
	let test = 0;

	if (emailTest != undefined) {
		let re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let res = re.test(String(emailTest.value).toLowerCase());
		if (!res) {
			document.querySelector('.errorEmail').innerHTML = 'Sorry but you can\'t use this email, try a real one';
			test++;
		}
	}

	if (passwordTest != undefined) {
		let re =
			/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{5,}$/;
		let res = re.test(String(passwordTest.value));
		if (!res) {
			document.querySelector('.errorPassword').innerHTML =
				'The Password is at least 5 character long + upper cases + lower cases + digits ';
			test++;
		}
	}
	if (nameTest != undefined) {
		let re =
			/^[\W \D \S ]{3,100}$/;
		let res = re.test(String(nameTest.value));
		if (!res) {
			formId.querySelector('.error').innerHTML =
				'The customer name must be at least 3 character long ';
			test++;
		}
	}
	if (test > 0) {
		test = 0;
		return false;
	} else {
		postForm(formAction, formDataNode, id, nextNum);
	}
}

function contentToView(json) {
	let error = document.getElementById('error');
	let obj = JSON.parse(json);
	if (obj.err) {
		error.innerText = obj.err;
	} else {
		error.innerText = 'Your login attempt was not successful. Please try again.';
	}
}

function postForm(file, formDataNode, id, nextNum) {

	let i, pagePath, xhttp, formData;
	formData = new FormData();
	pagePath = file;
	for (i in formDataNode) {
		formData.append(formDataNode[i].name, formDataNode[i].value);
	}
	xhttp = new window.XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				if (this.response.startsWith('<!DOCTYPE html>')) {
					document.open();
					document.write(this.responseText);
					pagePath = '?' + id;
					history.pushState(pagePath, pagePath, '');
					document.close();
				} else {
					contentToView(this.responseText, nextNum);
				}
			}
			if (this.status == 404) {
				contentToView({
					'err': 'Help me, Obi-Wan Kenobi. You’re my only hope. The server turned to the dark side',
				}, nextNum);
			}
		}
	};
	xhttp.open('POST', pagePath, true);
	xhttp.send(formData);
}

function clearPath(path, x) {
	if (window.location.pathname === path) {
		window.location.pathname = '/';
		for (let i = 0; i < x; i++) {
			history.pushState('', '', '/');
		}
	}
	if (window.location.search) {
		history.pushState('', '', '/');
	}
}
clearPath('/logout', 30);