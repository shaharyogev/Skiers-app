
//Function triggers
const singIn = document.getElementById('singIn');
const addUser = document.getElementById('addUser');
const tabToggle1 = document.getElementById('tabToggle1');
const tabToggle2 = document.getElementById('tabToggle2');
const loginTabA = document.getElementById('loginTabA');
const loginTabB = document.getElementById('loginTabB');

singIn.onsubmit = function() {
	event.preventDefault;	
	checkForm(singIn, 0);
};
addUser.onsubmit = function() {
	event.preventDefault;
	checkForm(addUser, 1);
};

tabToggle1.onclick = function(){
	loginToggle();
};
tabToggle2.onclick = function() {
	loginToggle(1);
};


//Handle tab toggle
function loginToggle(b) {
	if (b === 1) {
		loginTabA.style.display = 'flex';
		loginTabB.style.display = 'none';
	} else {
		loginTabA.style.display = 'none';
		loginTabB.style.display = 'flex';
	}
}


//Form validation
function checkForm(id, nextNum) {
	event.preventDefault();
	let formId = id;
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

//Render all the server response if err
const errorT = document.getElementById('error');

function contentToView(json) {
	let obj = JSON.parse(json);
	if (obj.err) {
		errorT.innerText = obj.err;
	} else {
		errorT.innerText = 'Your login attempt was not successful. Please try again.';
	}
}

//Send the form data as a formData object
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

//After logout the path get clan for security purposes
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