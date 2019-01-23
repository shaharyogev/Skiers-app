/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/javascripts/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! exports provided: chatSend, message, chatUl, chatUsersUl, userName, miniButton, chatBox, chatLogoButton, navColumn, resultsPanelBackground */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"chatSend\", function() { return chatSend; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"message\", function() { return message; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"chatUl\", function() { return chatUl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"chatUsersUl\", function() { return chatUsersUl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"userName\", function() { return userName; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"miniButton\", function() { return miniButton; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"chatBox\", function() { return chatBox; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"chatLogoButton\", function() { return chatLogoButton; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"navColumn\", function() { return navColumn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resultsPanelBackground\", function() { return resultsPanelBackground; });\nlet chatSend = document.getElementById('chatSend');\r\nlet message = document.getElementById('chatInput');\r\nlet chatUl = document.getElementById('chatUl');\r\nlet chatUsersUl = document.getElementById('chatUsersUl');\r\nlet userName = document.getElementById('userName');\r\nlet miniButton = document.getElementById('chatButtonToggle');\r\nlet chatBox = document.getElementById('chatLiveBox');\r\nlet chatLogoButton = document.getElementById('chatLogoButton');\r\nlet navColumn = document.getElementById('mainPage');\r\nlet resultsPanelBackground = document.getElementById('logoBackground');\r\n\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./appChat.js":
/*!********************!*\
  !*** ./appChat.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ \"./app.js\");\n  \r\n\r\n  //Send user name to the server\r\n\r\n  let socket = io();\r\n\r\n  if (_app_js__WEBPACK_IMPORTED_MODULE_0__[\"userName\"]) {\r\n    let userNameText = _app_js__WEBPACK_IMPORTED_MODULE_0__[\"userName\"].innerText;\r\n    includeThisHTML('/app', false, 'Current Inventory:');\r\n    socket.emit('namedUserConnected', {\r\n      userName: userNameText.toLowerCase()\r\n    });\r\n\r\n  };\r\n\r\n  let newUserChatCount = 0;\r\n  let newUserChatColorList = new Array;\r\n\r\n  function newUserOnline(d) {\r\n    newUserChatCount++;\r\n    let newUserChatLi = document.createElement('li');\r\n    let newChatH3 = document.createElement('h3');\r\n    newChatH3.appendChild(document.createTextNode(d));\r\n    newUserChatLi.appendChild(newChatH3);\r\n    let colorPickerVar = newUserChatCount % 8;\r\n    newChatH3.style.color = 'var(--c' + colorPickerVar + ')';\r\n    newUserChatLi.setAttribute('class', 'newUserLi');\r\n    newUserChatColorList[d] = 'var(--c' + colorPickerVar + ')';\r\n    _app_js__WEBPACK_IMPORTED_MODULE_0__[\"chatUsersUl\"].insertBefore(newUserChatLi, _app_js__WEBPACK_IMPORTED_MODULE_0__[\"chatUsersUl\"].firstElementChild);\r\n  }\r\n\r\n\r\n  //Update users list\r\n  socket.on('updateOnlineUsersList', function (d) {\r\n    let chatOnlineUsersUl = document.getElementById('chatUsersUl');\r\n    chatOnlineUsersUl.innerHTML = \"<li></li>\";\r\n    newUserChatCount = 0;\r\n    for (let i in d) {\r\n      newUserOnline(d[i])\r\n    }\r\n  });\r\n\r\n  //Emit message + acknowledgement\r\n\r\n  function sendMessage(newMessage) {\r\n    socket.emit('new message', {\r\n      message: newMessage\r\n    }, function (d) {});\r\n\r\n    //clear message input\r\n    _app_js__WEBPACK_IMPORTED_MODULE_0__[\"message\"].value = '';\r\n  };\r\n\r\n  //send message \r\n  _app_js__WEBPACK_IMPORTED_MODULE_0__[\"chatSend\"].addEventListener(\"click\", function () {\r\n    if (_app_js__WEBPACK_IMPORTED_MODULE_0__[\"message\"].value)\r\n      sendMessage(_app_js__WEBPACK_IMPORTED_MODULE_0__[\"message\"].value);\r\n  });\r\n\r\n  _app_js__WEBPACK_IMPORTED_MODULE_0__[\"message\"].addEventListener(\"keydown\", function (e) {\r\n    if (e.keyCode === 13) {\r\n      if (_app_js__WEBPACK_IMPORTED_MODULE_0__[\"message\"].value)\r\n        sendMessage(_app_js__WEBPACK_IMPORTED_MODULE_0__[\"message\"].value);\r\n    }\r\n  });\r\n\r\n  function printMessage(d) {\r\n    let newChatLi = document.createElement('li');\r\n    let newChatH3 = document.createElement('h3');\r\n    let newChatP = document.createElement('p');\r\n    let newChatH3Color = newUserChatColorList[d.userName];\r\n\r\n    newChatH3.appendChild(document.createTextNode(d.userName));\r\n    newChatH3.style.color = newChatH3Color;\r\n    newChatP.appendChild(document.createTextNode(d.message));\r\n    newChatLi.appendChild(newChatH3);\r\n    newChatLi.appendChild(newChatP);\r\n    newChatLi.setAttribute('class', 'newMessageLi');\r\n    _app_js__WEBPACK_IMPORTED_MODULE_0__[\"chatUl\"].appendChild(newChatLi);\r\n\r\n    let messages = _app_js__WEBPACK_IMPORTED_MODULE_0__[\"chatUl\"].querySelectorAll('li');\r\n    let lastMessage = messages[messages.length - 1];\r\n    lastMessage.scrollIntoView();\r\n  };\r\n\r\n  //Receive message and print to screen\r\n  socket.on('new message', function (d) {\r\n    printMessage(d);\r\n  });\r\n\r\n  socket.on('sendChatHistory', function (d) {\r\n    for (let i in d) {\r\n      printMessage(d[i]);\r\n    }\r\n  });\r\n\r\n  socket.on('reload', function () {\r\n    window.location.reload();\r\n  });\n\n//# sourceURL=webpack:///./appChat.js?");

/***/ }),

/***/ "./appMenu.js":
/*!********************!*\
  !*** ./appMenu.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ \"./app.js\");\n\r\n\r\n/*UX / UI Functions*/\r\n\r\nfunction tabToggle(num, className, event) {\r\n  let tabClassList = document.getElementsByClassName(className);\r\n  let tabButtonClassList = document.getElementsByClassName('tabNavButton');\r\n\r\n  for (let i = 0; i < tabClassList.length; i++) {\r\n    if (i === num) {\r\n      tabClassList[i].style.display = 'flex';\r\n      tabButtonClassList[i].className = 'tabNavButton tabNavButtonActive';\r\n\r\n    } else {\r\n      tabClassList[i].style.display = 'none';\r\n      tabButtonClassList[i].className = 'tabNavButton';\r\n\r\n    }\r\n  }\r\n  if (num === 1) {\r\n    dataListReq('userEmailRent');\r\n\r\n  }\r\n\r\n  if (num === 2) {\r\n    dataListReq('userEmailReturn');\r\n  }\r\n\r\n  if (num === 3) {\r\n    dataListReq('itemTitleReturn');\r\n  }\r\n};\r\n\r\n\r\n//Chat Toggles\r\nlet chatClosed = 0;\r\nlet chatMini = 0;\r\n\r\nfunction minimizeToggle(size, close) {\r\n  function minimizeChat() {\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].innerText = '{ }';\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"chatBox\"].setAttribute('class', 'chatLiveBoxMini');\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].setAttribute('class', 'chatEnlarge');\r\n    chatMini = 1;\r\n  }\r\n\r\n  function enlargeChat() {\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].innerText = '_';\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"chatBox\"].setAttribute('class', 'chatLiveBox');\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].setAttribute('class', 'chatMinimize');\r\n    chatMini = 0;\r\n  }\r\n\r\n  function maxChat() {\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].innerText = '_';\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"chatBox\"].setAttribute('class', 'chatLiveBoxMax');\r\n    _app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].setAttribute('class', 'chatMinimizeFromMax');\r\n    chatMini = 0;\r\n  }\r\n  if (size == 'max' && close !== 1) {\r\n    maxChat();\r\n\r\n  }\r\n  if (size == 'mini' && close !== 1) {\r\n    if (_app__WEBPACK_IMPORTED_MODULE_0__[\"miniButton\"].innerText == '_') {\r\n      minimizeChat();\r\n    } else {\r\n      enlargeChat();\r\n    }\r\n  } else if (size == 'dot') {\r\n    if (chatClosed === 0) {\r\n      _app__WEBPACK_IMPORTED_MODULE_0__[\"chatBox\"].setAttribute('class', 'chatLiveBoxDot');\r\n      _app__WEBPACK_IMPORTED_MODULE_0__[\"chatLogoButton\"].classList.toggle('changeDot');\r\n      chatClosed = 1;\r\n    } else if (close != 1) {\r\n      if (chatMini != 1) {\r\n        enlargeChat()\r\n      } else {\r\n        minimizeChat()\r\n      }\r\n      _app__WEBPACK_IMPORTED_MODULE_0__[\"chatLogoButton\"].classList.toggle('changeDot');\r\n      chatClosed = 0;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n//menu X/E \r\nlet backgroundSvg = '<svg height=\"100%\" viewBox=\"0 0 512 512\" width=\"100%\" fill=\"rgb(197, 197, 197)\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m338.5 178h-15v257.734375h-13.828125v-257.734375h-15v32.5h-76.75v15h17.191406l-29.691406 45.277344v-92.777344h-15v257.734375h-13.828125v-257.734375h-15v257.734375h-29.578125v38.289063h43.992187v37.976562h15v-37.976562h43.992188v-38.289063h-29.578125v-54.617187h76.75v-15h-17.285156l29.785156-45.421876v115.039063h-29.578125v38.289063h43.992188v37.976562h15v-37.976562h43.992187v-38.289063h-29.578125zm-118.5 272.734375v8.289063h-72.980469v-8.289063zm33.050781-225.234375h24.0625l-30.164062 46h-24.0625zm-6.101562 140.617188h-24.0625l30.164062-46h24.0625zm-29.027344-61v15h17.191406l-29.691406 45.277343v-78.894531h76.75v-15h-17.285156l29.785156-45.421875v79.039063zm135.15625 145.617187v8.289063h-72.984375v-8.289063zm0 0\" /><path d=\"m230.257812 136.925781-12.09375-12.089843h-4.40625v-124.835938h-60.496093v124.832031h-4.410157l-12.09375 12.09375v28.574219h93.5zm-61.996093-29.09375h17.996093v-15h-17.996093v-15.332031h17.996093v-15h-17.996093v-15.5h17.996093v-15h-17.996093v-17h30.496093v109.832031h-30.496093zm46.996093 42.667969h-63.5v-7.359375l3.308594-3.308594h56.886719l3.304687 3.308594zm0 0\" /><path d=\"m363.335938 136.925781-12.09375-12.089843h-4.410157v-124.835938h-60.492187v124.832031h-4.410156l-12.09375 12.09375v28.574219h93.5zm-61.996094-29.09375h17.992187v-15h-17.992187v-15.332031h17.992187v-15h-17.992187v-15.5h17.992187v-15h-17.992187v-17h30.492187v109.832031h-30.492187zm46.996094 42.667969h-63.5v-7.359375l3.308593-3.304687h56.886719l3.304688 3.304687zm0 0\" /><path d=\"m38 286.5h111.09375v-15h-111.09375c-12.683594 0-23-10.316406-23-23s10.316406-23 23-23h111.09375v-15h-111.09375c-20.953125 0-38 17.046875-38 38s17.046875 38 38 38zm0 0\" /><path d=\"m351 225.5h123c12.683594 0 23 10.316406 23 23s-10.316406 23-23 23h-123v15h123c20.953125 0 38-17.046875 38-38s-17.046875-38-38-38h-123zm0 0\" /><path d=\"m474 305.117188h-123v15h123c12.683594 0 23 10.320312 23 23 0 12.683593-10.316406 23-23 23h-123v15h123c20.953125 0 38-17.046876 38-38 0-20.953126-17.046875-38-38-38zm0 0\" /><path d=\"m149.09375 366.117188h-111.09375c-12.683594 0-23-10.316407-23-23 0-12.679688 10.316406-23 23-23h111.09375v-15h-111.09375c-20.953125 0-38 17.046874-38 38 0 20.953124 17.046875 38 38 38h111.09375zm0 0\" /><path d=\"m474 250.5h-73v-15h73zm-83 0h-15v-15h15zm-25 0h-15v-15h15zm0 0\" /><path d=\"m474 345.117188h-73v-15h73zm-83 0h-15v-15h15zm-25 0h-15v-15h15zm0 0\" /></svg>';\r\nlet backgroundSvg64 = window.btoa(backgroundSvg);\r\n_app__WEBPACK_IMPORTED_MODULE_0__[\"resultsPanelBackground\"].style.backgroundImage = \"url('data:image/svg+xml;base64,\" + backgroundSvg64 + \"')\";\r\nlet menuOpen = 0;\r\nlet menuClass;\r\n\r\n\r\n\r\nfunction menuX(x, st) {\r\n  x.classList.toggle('change');\r\n  _app__WEBPACK_IMPORTED_MODULE_0__[\"navColumn\"].classList.toggle('change');\r\n  minimizeToggle('dot', 1);\r\n  menuClass = x;\r\n  if (menuOpen === 0) {\r\n    st = setTimeout(function () {\r\n      menuOpen = 1;\r\n    }, 200);\r\n  } else {\r\n    menuOpen = 0;\r\n  }\r\n}\r\n\r\n\r\n//Close the menu if the user click anywhere else\r\n\r\nfunction menuXX() {\r\n  if (menuOpen === 1) {\r\n    menuX(menuClass);\r\n  };\r\n}\r\nconst style = document.documentElement.style;\r\n\r\nfunction themeColors(is) {\r\n  let rootColors = [{\r\n      tc: \"\"\r\n    },\r\n    {\r\n      tb: \"\"\r\n    },\r\n    {\r\n      te: \"\"\r\n    },\r\n    {\r\n      tec: \"\"\r\n    },\r\n    {\r\n      tcc: \"\"\r\n    },\r\n    {\r\n      tbi: \"\"\r\n    },\r\n    {\r\n      tbc: \"\"\r\n    },\r\n    {\r\n      tbic: \"\"\r\n    }\r\n  ];\r\n  for (index in rootColors) {\r\n    let id = Object.getOwnPropertyNames(rootColors[index]);\r\n    let value = Object.values(rootColors[index]);\r\n    style.setProperty('--' + id, 'var(--' + id + is + ')');\r\n  }\r\n}\r\n\r\n//Dark theme\r\n\r\nfunction themeToggle(id) {\r\n  let themeStateText = document.getElementById(id).innerText;\r\n  if (themeStateText == 'Dark-Side') {\r\n    themeColors('d');\r\n    document.getElementById(id).innerText = 'Light-Side';\r\n  } else {\r\n    themeColors('l');\r\n    document.getElementById(id).innerText = 'Dark-Side';\r\n  }\r\n}\r\ndocument.body.addEventListener(\"click\", menuXX);\r\n\r\n\r\n\r\n/*Forms and data*/\r\n\r\nfunction goToRentTabWithEmail(id, nextNum) {\r\n  let thisTab = document.getElementById(id);\r\n\r\n  if (thisTab.querySelector('input[name=\"email\"]')) {\r\n    let email = thisTab.querySelector('input[name=\"email\"]').value\r\n    let tabClassList = document.getElementsByClassName(\"inventoryTab\");\r\n    thisTab.reset();\r\n    tabToggle(nextNum, 'inventoryTab');\r\n    tabClassList[nextNum].querySelector('input[name=\"email\"]').value = email;\r\n\r\n    if (tabClassList[nextNum].querySelector('input[name=\"email\"]')) {\r\n      let titleT = document.getElementById('title')\r\n      titleT.innerText = email;\r\n    }\r\n  } else {\r\n    thisTab.reset();\r\n    tabToggle(nextNum, 'inventoryTab');\r\n  }\r\n}\r\n\r\n\r\n//Forms validation\n\n//# sourceURL=webpack:///./appMenu.js?");

/***/ }),

/***/ "./appReq.js":
/*!*******************!*\
  !*** ./appReq.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function checkForm(id, nextNum) {\r\n  event.preventDefault();\r\n  let formId = document.getElementById(id);\r\n  let formDataNode = formId.querySelectorAll('input');\r\n  let formAction = formId.action;\r\n  let nameTest = formId.querySelector('input[name=\"name\"]');\r\n  let titleTest = formId.querySelector('input[name=\"title\"]');\r\n  let emailTest = formId.querySelector('input[name=\"email\"]');\r\n  let inventoryTest = formId.querySelector('input[name=\"inventory\"]');\r\n  let phoneTest = formId.querySelector('input[name=\"phone\"]');\r\n  let daysTest = formId.querySelector('input[name=\"days\"]');\r\n  let test = 0;\r\n\r\n  if (emailTest != undefined) {\r\n    let re =\r\n      /^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;\r\n    let res = re.test(String(emailTest.value).toLowerCase());\r\n    if (!res) {\r\n      formId.querySelector('.error').innerHTML = 'Sorry but you can\\'t use this email, try a real one';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (titleTest != undefined) {\r\n    let re =\r\n      /^[\\W \\D \\S ]{3,100}$/;\r\n    let res = re.test(String(titleTest.value));\r\n    if (!res) {\r\n      formId.querySelector('.error').innerHTML =\r\n        'The title is at least 3 character long ';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (nameTest != undefined) {\r\n    let re =\r\n      /^[\\W \\D \\S ]{3,100}$/;\r\n    let res = re.test(String(nameTest.value));\r\n    if (!res) {\r\n      formId.querySelector('.error').innerHTML =\r\n        'The customer name must be at least 3 character long ';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (phoneTest != undefined) {\r\n    let re =\r\n      /^[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s\\.]{0,1}[0-9]{3}[-\\s\\.]{0,1}[0-9]{1,6}$/;\r\n    let res = re.test(String(phoneTest.value));\r\n    if (!res) {\r\n      formId.querySelector('.error').innerHTML =\r\n        'Phone number ex: 000-000-000000). ';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (inventoryTest != undefined) {\r\n    if (inventoryTest.value == 0) {\r\n      formId.querySelector('.error').innerHTML =\r\n        'The inventory cant be 0 ';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (daysTest != undefined) {\r\n    if (daysTest.value <= 0) {\r\n      formId.querySelector('.error').innerHTML =\r\n        'The days must be more than 0 ';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (test > 0) {\r\n    test = 0;\r\n    return false;\r\n\r\n  } else {\r\n    postForm(formAction, formDataNode, id, nextNum);\r\n  }\r\n};\r\n\r\n//Rendering the response from the server\r\n\r\nfunction contentToView(json, title) {\r\n  let x, y, obj, objKey, txt, columnHeadline;\r\n  txt = '';\r\n  try {\r\n    obj = JSON.parse(json);\r\n\r\n    if (obj.err) {\r\n      let error = document.getElementById('error')\r\n      error.innerText = obj.err;\r\n    } else {\r\n\r\n      if (obj.title) {\r\n        let titleT = document.getElementById('title')\r\n        titleT.innerText = obj.title;\r\n\r\n\r\n        if (obj.status) {\r\n          let statusT = document.getElementById('status')\r\n          statusT.innerText = obj.status\r\n        }\r\n        if (obj.name) {\r\n          let statusT = document.getElementById('queryUl')\r\n          statusT.innerText = obj.name\r\n        }\r\n\r\n        if (obj.itemsList) {\r\n          let ul = document.getElementById('queryUl');\r\n          ul.innerHTML = '';\r\n          for (i in obj.itemsList) {\r\n            let li = document.createElement('li');\r\n            li.appendChild(document.createTextNode(obj.itemsList[i]));\r\n            ul.appendChild(li);\r\n          }\r\n        }\r\n      } else {\r\n        if (title) {\r\n          let titleT = document.getElementById('title')\r\n          titleT.innerText = title;\r\n\r\n          if (title !== 'Current Inventory:') {\r\n            console.log('test');\r\n            document.getElementById(\"queryUl\").scrollIntoView();\r\n          }\r\n        }\r\n        if (!status) {\r\n          let statusT = document.getElementById('status')\r\n          statusT.innerText = ''\r\n        }\r\n\r\n        columnHeadline = Object.getOwnPropertyNames(obj[0])\r\n        txt += \"<table>\"\r\n        txt += \"<tr>\"\r\n        for (x in columnHeadline) {\r\n          txt += \"<th>\" + columnHeadline[x] + \"</th>\";\r\n        }\r\n        txt += \"</tr>\"\r\n        for (x in obj) {\r\n          txt += \"<tr>\"\r\n          for (y in obj[x]) {\r\n            txt += \"<td>\" + obj[x][y] + \"</td>\"\r\n          }\r\n          txt += \"</tr>\";\r\n        }\r\n        txt += \"</table>\"\r\n        document.getElementById(\"queryUl\").innerHTML = txt;\r\n\r\n\r\n      }\r\n    }\r\n  } catch (err) {\r\n    console.log(err);\r\n  }\r\n};\r\n\r\nfunction dataListReq(list) {\r\n  let dataList = document.getElementById(list + 'DataList');\r\n  dataList.innerHTML = '';\r\n  let input = document.getElementById(list + 'Input');\r\n  let xhttp, jsonData;\r\n  if (list) {\r\n    xhttp = new XMLHttpRequest();\r\n    xhttp.onreadystatechange = function () {\r\n      if (this.readyState == 4) {\r\n        if (this.status == 200) {\r\n          jsonData = JSON.parse(this.responseText)\r\n          for (let i in jsonData) {\r\n            let option = document.createElement('option');\r\n            if (jsonData[i].item) {\r\n              option.value = jsonData[i].item;\r\n            }\r\n            if (jsonData[i].label) {\r\n              option.label = jsonData[i].label\r\n            }\r\n            dataList.appendChild(option);\r\n          };\r\n\r\n        }\r\n        if (this.status == 404) {\r\n          //DEV\r\n        }\r\n      }\r\n    }\r\n  }\r\n  xhttp.open(\"GET\", \"/\" + list, true);\r\n  xhttp.send();\r\n};\r\n\r\n\r\nfunction dataListReqEmail(list, email) {\r\n  let dataList = document.getElementById(list + 'DataList');\r\n  dataList.innerHTML = '';\r\n  let input = document.getElementById(list + 'Input');\r\n  let xhttp, jsonData, formData;\r\n\r\n  formData = new FormData();\r\n  formData.append(\"email\", email);\r\n\r\n  if (list) {\r\n    xhttp = new XMLHttpRequest();\r\n    xhttp.onreadystatechange = function () {\r\n      if (this.readyState == 4) {\r\n        if (this.status == 200) {\r\n          jsonData = JSON.parse(this.responseText)\r\n          for (let i in jsonData) {\r\n            let option = document.createElement('option');\r\n            if (jsonData[i].item) {\r\n              option.value = jsonData[i].item;\r\n            }\r\n            if (jsonData[i].label) {\r\n              option.label = jsonData[i].label\r\n            }\r\n            dataList.appendChild(option);\r\n          };\r\n\r\n        }\r\n        if (this.status == 404) {\r\n          //DEV\r\n        }\r\n      }\r\n    }\r\n  }\r\n  xhttp.open(\"POST\", \"/\" + list, true);\r\n  xhttp.send(formData);\r\n};\r\n\r\n\r\n// Sending requests to the server\r\n\r\nfunction includeThisHTML(page, back, title) {\r\n  let pagePath, xhttp;\r\n  if (page) {\r\n    xhttp = new XMLHttpRequest();\r\n    xhttp.onreadystatechange = function () {\r\n      if (this.readyState == 4) {\r\n        if (this.status == 200) {\r\n          if (this.response.startsWith(\"<!DOCTYPE html>\")) {\r\n            document.open();\r\n            document.write(this.responseText);\r\n            document.close();\r\n          } else {\r\n            contentToView(this.responseText, title);\r\n            if (!back) {\r\n              if (page === '/app') {\r\n                pagePath = '';\r\n              } else {\r\n                pagePath = '?' + page;\r\n              }\r\n              history.pushState(pagePath, pagePath, pagePath);\r\n            }\r\n          }\r\n        }\r\n      }\r\n      if (this.status == 404) {\r\n        contentToView({\r\n          \"title\": 'We have a little problem'\r\n        });\r\n      }\r\n    }\r\n  }\r\n  xhttp.open(\"GET\", page, true);\r\n  xhttp.send();\r\n};\r\n\r\n\r\n\r\nfunction postForm(page, formDataNode, id, nextNum) {\r\n  let i, xhttp, formData;\r\n\r\n  formData = new FormData();\r\n  for (i in formDataNode) {\r\n    formData.append(formDataNode[i].name, formDataNode[i].value);\r\n  };\r\n\r\n  xhttp = new XMLHttpRequest();\r\n  xhttp.onreadystatechange = function () {\r\n    if (this.readyState == 4) {\r\n      if (this.status == 200) {\r\n        if (this.response.startsWith(\"<!DOCTYPE html>\")) {\r\n          document.open();\r\n          document.write(this.responseText);\r\n          document.close();\r\n        } else {\r\n          contentToView(this.responseText);\r\n          goToRentTabWithEmail(id, nextNum);\r\n        }\r\n      }\r\n      if (this.status == 404) {\r\n        contentToView({\r\n          'title': 'We have a little problem'\r\n        });\r\n      }\r\n    }\r\n  }\r\n  xhttp.open('POST', page, true);\r\n  xhttp.send(formData);\r\n};\r\n\r\n//History manipulation\r\n\r\nwindow.onpopstate = function (event) {\r\n  minimizeToggle('dot', 0);\r\n  if (window.location.pathname === '/' && window.location.search) {\r\n    let newPage = window.location.search;\r\n    let newPageLen = newPage.length;\r\n    newPage = newPage.slice(1, newPageLen)\r\n    includeThisHTML(newPage, \"1\");\r\n  } else {\r\n    includeThisHTML('/app');\r\n  }\r\n};\n\n//# sourceURL=webpack:///./appReq.js?");

/***/ }),

/***/ 0:
/*!************************************************************!*\
  !*** multi ./app.js ./appChat.js ./appMenu.js ./appReq.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./app.js */\"./app.js\");\n__webpack_require__(/*! ./appChat.js */\"./appChat.js\");\n__webpack_require__(/*! ./appMenu.js */\"./appMenu.js\");\nmodule.exports = __webpack_require__(/*! ./appReq.js */\"./appReq.js\");\n\n\n//# sourceURL=webpack:///multi_./app.js_./appChat.js_./appMenu.js_./appReq.js?");

/***/ })

/******/ });