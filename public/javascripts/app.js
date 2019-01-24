//Send user name to the server

const chatUsersUl = document.getElementById('chatUsersUl');
const chatUl = document.getElementById('chatUl');
const chatSend = document.getElementById('chatSend');
const message = document.getElementById('chatInput');


let socket = io();
const userName = document.getElementById('userName');

if (userName) {
	let userNameText = userName.innerText;
	includeThisHTML('/app', false, 'Current Inventory:');
	socket.emit('namedUserConnected', {
		userName: userNameText.toLowerCase()
	});

}

let newUserChatCount = 0;
let newUserChatColorList = new Array;

function newUserOnline(d) {
	newUserChatCount++;
	let newUserChatLi = document.createElement('li');
	let newChatH3 = document.createElement('h3');
	newChatH3.appendChild(document.createTextNode(d));
	newUserChatLi.appendChild(newChatH3);
	let colorPickerVar = newUserChatCount % 8;
	newChatH3.style.color = 'var(--c' + colorPickerVar + ')';
	newUserChatLi.setAttribute('class', 'newUserLi');
	newUserChatColorList[d] = 'var(--c' + colorPickerVar + ')';
	chatUsersUl.insertBefore(newUserChatLi, chatUsersUl.firstElementChild);
}


//Update users list
socket.on('updateOnlineUsersList', function(d) {
	let chatOnlineUsersUl = document.getElementById('chatUsersUl');
	chatOnlineUsersUl.innerHTML = '<li></li>';
	newUserChatCount = 0;
	for (let i in d) {
		newUserOnline(d[i]);
	}
});

//Emit message + acknowledgement

function sendMessage(newMessage) {
	socket.emit('new message', {
		message: newMessage
	}, function(d) {});

	//clear message input
	message.value = '';
}

//send message 
chatSend.addEventListener('click', function() {
	if (message.value)
		sendMessage(message.value);
});

message.addEventListener('keydown', function(e) {
	if (e.keyCode === 13) {
		if (message.value)
			sendMessage(message.value);
	}
});

function printMessage(d) {
	let newChatLi = document.createElement('li');
	let newChatH3 = document.createElement('h3');
	let newChatP = document.createElement('p');
	let newChatH3Color = newUserChatColorList[d.userName];

	newChatH3.appendChild(document.createTextNode(d.userName));
	newChatH3.style.color = newChatH3Color;
	newChatP.appendChild(document.createTextNode(d.message));
	newChatLi.appendChild(newChatH3);
	newChatLi.appendChild(newChatP);
	newChatLi.setAttribute('class', 'newMessageLi');
	chatUl.appendChild(newChatLi);

	let messages = chatUl.querySelectorAll('li');
	let lastMessage = messages[messages.length - 1];
	lastMessage.scrollIntoView();
}

//Receive message and print to screen
socket.on('new message', function(d) {
	printMessage(d);
});

socket.on('sendChatHistory', function(d) {
	for (let i in d) {
		printMessage(d[i]);
	}
});

socket.on('reload', function() {
	window.location.reload();
});

function checkForm(id, nextNum) {
	event.preventDefault();
	let formId = document.getElementById(id);
	let formDataNode = formId.querySelectorAll('input');
	let formAction = formId.action;
	let nameTest = formId.querySelector('input[name="name"]');
	let titleTest = formId.querySelector('input[name="title"]');
	let emailTest = formId.querySelector('input[name="email"]');
	let inventoryTest = formId.querySelector('input[name="inventory"]');
	let phoneTest = formId.querySelector('input[name="phone"]');
	let daysTest = formId.querySelector('input[name="days"]');
	let test = 0;

	if (emailTest != undefined) {
		let re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let res = re.test(String(emailTest.value).toLowerCase());
		if (!res) {
			formId.querySelector('.error').innerHTML = 'Sorry but you can\'t use this email, try a real one';
			test++;
		}
	}

	if (titleTest != undefined) {
		let re =
			/^[\W \D \S ]{3,100}$/;
		let res = re.test(String(titleTest.value));
		if (!res) {
			formId.querySelector('.error').innerHTML =
				'The title is at least 3 character long ';
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

	if (phoneTest != undefined) {
		let re =
			/^[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{1,6}$/;
		let res = re.test(String(phoneTest.value));
		if (!res) {
			formId.querySelector('.error').innerHTML =
				'Phone number ex: 000-000-000000). ';
			test++;
		}
	}

	if (inventoryTest != undefined) {
		if (inventoryTest.value == 0) {
			formId.querySelector('.error').innerHTML =
				'The inventory cant be 0 ';
			test++;
		}
	}

	if (daysTest != undefined) {
		if (daysTest.value <= 0) {
			formId.querySelector('.error').innerHTML =
				'The days must be more than 0 ';
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

//Rendering the response from the server

function contentToView(json, title) {
	let x, y, obj, objKey, txt, columnHeadline;
	txt = '';
	try {
		obj = JSON.parse(json);
		console.log(obj);
		if (obj.err) {
			let error = document.getElementById('error');
			error.innerText = obj.err;
		} else {

			if (obj.title || obj.itemsList) {
				let titleT = document.getElementById('title');
				titleT.innerText = obj.title;

				if (obj.status) {
					let statusT = document.getElementById('status');
					statusT.innerText = obj.status;
				}
				if (obj.name) {
					let statusT = document.getElementById('queryUl');
					statusT.innerText = obj.name;
				}

				if (obj.itemsList) {

					columnHeadline = Object.getOwnPropertyNames(obj.itemsList[0]);
					txt += '<table>';
					txt += '<tr>';
					for (x in columnHeadline) {
						txt += '<th>' + columnHeadline[x] + '</th>';
					}
					txt += '</tr>';
					for (x in obj.itemsList) {
						txt += '<tr>';
						for (y in obj.itemsList[x]) {
							txt += '<td>' + obj.itemsList[x][y] + '</td>';
						}
						txt += '</tr>';
					}
					txt += '</table>';
					document.getElementById('queryUl').innerHTML = txt;

				}
			} else {

				if (title || obj.titleTable) {
					let titleT = document.getElementById('title');
					titleT.innerText = title;

					if (title !== 'Current Inventory:') {
						document.getElementById('queryUl').scrollIntoView();
					}
				}
				if (status || obj.statusTable) {
					let statusT = document.getElementById('status');
					statusT.innerText = status;
				} else {
					let statusT = document.getElementById('status');
					statusT.innerText = '';
				}

				columnHeadline = Object.getOwnPropertyNames(obj[0]);
				txt += '<table>';
				txt += '<tr>';
				for (x in columnHeadline) {
					txt += '<th>' + columnHeadline[x] + '</th>';
				}
				txt += '</tr>';
				for (x in obj) {
					txt += '<tr>';
					for (y in obj[x]) {
						txt += '<td>' + obj[x][y] + '</td>';
					}
					txt += '</tr>';
				}
				txt += '</table>';
				document.getElementById('queryUl').innerHTML = txt;


			}
		}
	} catch (err) {
		console.log(err);
	}
}

function dataListReq(list) {
	let dataList = document.getElementById(list + 'DataList');
	dataList.innerHTML = '';
	let input = document.getElementById(list + 'Input');
	let xhttp, jsonData;
	if (list) {
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					jsonData = JSON.parse(this.responseText);
					for (let i in jsonData) {
						let option = document.createElement('option');
						if (jsonData[i].item) {
							option.value = jsonData[i].item;
						}
						if (jsonData[i].label) {
							option.label = jsonData[i].label;
						}
						dataList.appendChild(option);
					}

				}
				if (this.status == 404) {
					//DEV
				}
			}
		};
	}
	xhttp.open('GET', '/' + list, true);
	xhttp.send();
}


function dataListReqEmail(list, email) {
	let dataList = document.getElementById(list + 'DataList');
	dataList.innerHTML = '';
	let input = document.getElementById(list + 'Input');
	let xhttp, jsonData, formData;

	formData = new FormData();
	formData.append('email', email);

	if (list) {
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					jsonData = JSON.parse(this.responseText);
					for (let i in jsonData) {
						let option = document.createElement('option');
						if (jsonData[i].item) {
							option.value = jsonData[i].item;
						}
						if (jsonData[i].label) {
							option.label = jsonData[i].label;
						}
						dataList.appendChild(option);
					}

				}
				if (this.status == 404) {
					//DEV
				}
			}
		};
	}
	xhttp.open('POST', '/' + list, true);
	xhttp.send(formData);
}


// Sending requests to the server

function includeThisHTML(page, back, title) {
	let pagePath, xhttp;
	if (page) {
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					if (this.response.startsWith('<!DOCTYPE html>')) {
						document.open();
						document.write(this.responseText);
						document.close();
					} else {
						contentToView(this.responseText, title);
						if (!back) {
							if (page === '/app') {
								pagePath = '';
							} else {
								pagePath = '?' + page;
							}
							history.pushState(pagePath, pagePath, pagePath);
						}
					}
				}
			}
			if (this.status == 404) {
				contentToView({
					'title': 'We have a little problem'
				});
			}
		};
	}
	xhttp.open('GET', page, true);
	xhttp.send();
}


function postForm(page, formDataNode, id, nextNum) {
	let i, xhttp, formData;

	formData = new FormData();
	for (i in formDataNode) {
		formData.append(formDataNode[i].name, formDataNode[i].value);
	}

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				if (this.response.startsWith('<!DOCTYPE html>')) {
					document.open();
					document.write(this.responseText);
					document.close();
				} else {
					contentToView(this.responseText);
					goToRentTabWithEmail(id, nextNum);
				}
			}
			if (this.status == 404) {
				contentToView({
					'title': 'We have a little problem'
				});
			}
		}
	};
	xhttp.open('POST', page, true);
	xhttp.send(formData);
}

//History manipulation

window.onpopstate = function(event) {
	minimizeToggle('dot', 0);
	if (window.location.pathname === '/' && window.location.search) {
		let newPage = window.location.search;
		let newPageLen = newPage.length;
		newPage = newPage.slice(1, newPageLen);
		includeThisHTML(newPage, '1');
	} else {
		includeThisHTML('/app');
	}
};

/*UX / UI Functions*/
const navColumn = document.getElementById('mainPage');
const miniButton = document.getElementById('chatButtonToggle');
const chatBox = document.getElementById('chatLiveBox');
const chatLogoButton = document.getElementById('chatLogoButton');

function tabToggle(num, className, event) {
	let tabClassList = document.getElementsByClassName(className);
	let tabButtonClassList = document.getElementsByClassName('tabNavButton');

	for (let i = 0; i < tabClassList.length; i++) {
		if (i === num) {
			tabClassList[i].style.display = 'flex';
			tabButtonClassList[i].className = 'tabNavButton tabNavButtonActive';

		} else {
			tabClassList[i].style.display = 'none';
			tabButtonClassList[i].className = 'tabNavButton';

		}
	}
	if (num === 1) {
		dataListReq('userEmailRent');

	}

	if (num === 2) {
		dataListReq('userEmailReturn');
	}

	if (num === 3) {
		dataListReq('itemTitleReturn');
	}
}


//Chat Toggles
let chatClosed = 0;
let chatMini = 0;

function minimizeToggle(size, close) {
	function minimizeChat() {
		miniButton.innerText = '{ }';
		chatBox.setAttribute('class', 'chatLiveBoxMini');
		miniButton.setAttribute('class', 'chatEnlarge');
		chatMini = 1;
	}

	function enlargeChat() {
		miniButton.innerText = '_';
		chatBox.setAttribute('class', 'chatLiveBox');
		miniButton.setAttribute('class', 'chatMinimize');
		chatMini = 0;
	}

	function maxChat() {
		miniButton.innerText = '_';
		chatBox.setAttribute('class', 'chatLiveBoxMax');
		miniButton.setAttribute('class', 'chatMinimizeFromMax');
		chatMini = 0;
	}
	if (size == 'max' && close !== 1) {
		maxChat();

	}
	if (size == 'mini' && close !== 1) {
		if (miniButton.innerText == '_') {
			minimizeChat();
		} else {
			enlargeChat();
		}
	} else if (size == 'dot') {
		if (chatClosed === 0) {
			chatBox.setAttribute('class', 'chatLiveBoxDot');
			chatLogoButton.classList.toggle('changeDot');
			chatClosed = 1;
		} else if (close != 1) {
			if (chatMini != 1) {
				enlargeChat();
			} else {
				minimizeChat();
			}
			chatLogoButton.classList.toggle('changeDot');
			chatClosed = 0;
		}
	}
}


//menu X/E 
let backgroundSvg = '<svg height="100%" viewBox="0 0 512 512" width="100%" fill="rgb(197, 197, 197)" xmlns="http://www.w3.org/2000/svg"><path d="m338.5 178h-15v257.734375h-13.828125v-257.734375h-15v32.5h-76.75v15h17.191406l-29.691406 45.277344v-92.777344h-15v257.734375h-13.828125v-257.734375h-15v257.734375h-29.578125v38.289063h43.992187v37.976562h15v-37.976562h43.992188v-38.289063h-29.578125v-54.617187h76.75v-15h-17.285156l29.785156-45.421876v115.039063h-29.578125v38.289063h43.992188v37.976562h15v-37.976562h43.992187v-38.289063h-29.578125zm-118.5 272.734375v8.289063h-72.980469v-8.289063zm33.050781-225.234375h24.0625l-30.164062 46h-24.0625zm-6.101562 140.617188h-24.0625l30.164062-46h24.0625zm-29.027344-61v15h17.191406l-29.691406 45.277343v-78.894531h76.75v-15h-17.285156l29.785156-45.421875v79.039063zm135.15625 145.617187v8.289063h-72.984375v-8.289063zm0 0" /><path d="m230.257812 136.925781-12.09375-12.089843h-4.40625v-124.835938h-60.496093v124.832031h-4.410157l-12.09375 12.09375v28.574219h93.5zm-61.996093-29.09375h17.996093v-15h-17.996093v-15.332031h17.996093v-15h-17.996093v-15.5h17.996093v-15h-17.996093v-17h30.496093v109.832031h-30.496093zm46.996093 42.667969h-63.5v-7.359375l3.308594-3.308594h56.886719l3.304687 3.308594zm0 0" /><path d="m363.335938 136.925781-12.09375-12.089843h-4.410157v-124.835938h-60.492187v124.832031h-4.410156l-12.09375 12.09375v28.574219h93.5zm-61.996094-29.09375h17.992187v-15h-17.992187v-15.332031h17.992187v-15h-17.992187v-15.5h17.992187v-15h-17.992187v-17h30.492187v109.832031h-30.492187zm46.996094 42.667969h-63.5v-7.359375l3.308593-3.304687h56.886719l3.304688 3.304687zm0 0" /><path d="m38 286.5h111.09375v-15h-111.09375c-12.683594 0-23-10.316406-23-23s10.316406-23 23-23h111.09375v-15h-111.09375c-20.953125 0-38 17.046875-38 38s17.046875 38 38 38zm0 0" /><path d="m351 225.5h123c12.683594 0 23 10.316406 23 23s-10.316406 23-23 23h-123v15h123c20.953125 0 38-17.046875 38-38s-17.046875-38-38-38h-123zm0 0" /><path d="m474 305.117188h-123v15h123c12.683594 0 23 10.320312 23 23 0 12.683593-10.316406 23-23 23h-123v15h123c20.953125 0 38-17.046876 38-38 0-20.953126-17.046875-38-38-38zm0 0" /><path d="m149.09375 366.117188h-111.09375c-12.683594 0-23-10.316407-23-23 0-12.679688 10.316406-23 23-23h111.09375v-15h-111.09375c-20.953125 0-38 17.046874-38 38 0 20.953124 17.046875 38 38 38h111.09375zm0 0" /><path d="m474 250.5h-73v-15h73zm-83 0h-15v-15h15zm-25 0h-15v-15h15zm0 0" /><path d="m474 345.117188h-73v-15h73zm-83 0h-15v-15h15zm-25 0h-15v-15h15zm0 0" /></svg>';
let backgroundSvg64 = window.btoa(backgroundSvg);
let resultsPanelBackground = document.getElementById('logoBackground');

resultsPanelBackground.style.backgroundImage = 'url(\'data:image/svg+xml;base64,' + backgroundSvg64 + '\')';
let menuOpen = 0;
let menuClass;



function menuX(x, st) {
	x.classList.toggle('change');
	navColumn.classList.toggle('change');
	minimizeToggle('dot', 1);
	menuClass = x;
	if (menuOpen === 0) {
		st = setTimeout(function() {
			menuOpen = 1;
		}, 200);
	} else {
		menuOpen = 0;
	}
}


//Close the menu if the user click anywhere else

function menuXX() {
	if (menuOpen === 1) {
		menuX(menuClass);
	}
}
const style = document.documentElement.style;

function themeColors(is) {
	let rootColors = [{
		tc: ''
	},
	{
		tb: ''
	},
	{
		te: ''
	},
	{
		tec: ''
	},
	{
		tcc: ''
	},
	{
		tbi: ''
	},
	{
		tbc: ''
	},
	{
		tbic: ''
	}
	];
	for (index in rootColors) {
		let id = Object.getOwnPropertyNames(rootColors[index]);
		let value = Object.values(rootColors[index]);
		style.setProperty('--' + id, 'var(--' + id + is + ')');
	}
}

//Dark theme

function themeToggle(id) {
	let themeStateText = document.getElementById(id).innerText;
	if (themeStateText == 'Dark-Side') {
		themeColors('d');
		document.getElementById(id).innerText = 'Light-Side';
	} else {
		themeColors('l');
		document.getElementById(id).innerText = 'Dark-Side';
	}
}
document.body.addEventListener('click', menuXX);



/*Forms and data*/

function goToRentTabWithEmail(id, nextNum) {
	let thisTab = document.getElementById(id);

	if (thisTab.querySelector('input[name="email"]')) {
		let email = thisTab.querySelector('input[name="email"]').value;
		let tabClassList = document.getElementsByClassName('inventoryTab');
		thisTab.reset();
		tabToggle(nextNum, 'inventoryTab');
		tabClassList[nextNum].querySelector('input[name="email"]').value = email;

		if (tabClassList[nextNum].querySelector('input[name="email"]')) {
			let titleT = document.getElementById('title');
			titleT.innerText = email;
		}
	} else {
		thisTab.reset();
		tabToggle(nextNum, 'inventoryTab');
	}
}