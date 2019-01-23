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
/******/ 	return __webpack_require__(__webpack_require__.s = "./login.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./login.js":
/*!******************!*\
  !*** ./login.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function loginToggle(b) {\r\n  let loginTabA = document.getElementById('loginTabA');\r\n  let loginTabB = document.getElementById('loginTabB');\r\n  if (b === 1) {\r\n    loginTabA.style.display = 'flex';\r\n    loginTabB.style.display = 'none';\r\n  } else {\r\n    loginTabA.style.display = 'none';\r\n    loginTabB.style.display = 'flex';\r\n  }\r\n};\r\n\r\nfunction checkForm(id, nextNum) {\r\n  event.preventDefault();\r\n  let formId = document.getElementById(id);\r\n  let formDataNode = formId.querySelectorAll('input');\r\n  let formAction = formId.action;\r\n  let emailTest = formId.querySelector('input[name=\"email\"]');\r\n  let passwordTest = formId.querySelector('input[name=\"password\"]');\r\n  let nameTest = formId.querySelector('input[name=\"name\"]');\r\n  let test = 0\r\n\r\n  if (emailTest != undefined) {\r\n    let re =\r\n      /^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;\r\n    let res = re.test(String(emailTest.value).toLowerCase());\r\n    if (!res) {\r\n      document.querySelector('.errorEmail').innerHTML = 'Sorry but you can\\'t use this email, try a real one';\r\n      test++;\r\n    }\r\n  };\r\n\r\n  if (passwordTest != undefined) {\r\n    let re =\r\n      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{5,}$/;\r\n    let res = re.test(String(passwordTest.value));\r\n    if (!res) {\r\n      document.querySelector('.errorPassword').innerHTML =\r\n        'The Password is at least 5 character long + upper cases + lower cases + digits ';\r\n      test++;\r\n    }\r\n  };\r\n  if (nameTest != undefined) {\r\n    let re =\r\n      /^[\\W \\D \\S ]{3,100}$/;\r\n    let res = re.test(String(nameTest.value));\r\n    if (!res) {\r\n      formId.querySelector('.error').innerHTML =\r\n        'The customer name must be at least 3 character long ';\r\n      test++;\r\n    }\r\n  };\r\n  if (test > 0) {\r\n    test = 0;\r\n    return false;\r\n  } else {\r\n    postForm(formAction, formDataNode, id, nextNum);\r\n  }\r\n};\r\n\r\nfunction contentToView(json, nextNum) {\r\n  let error = document.getElementById('error')\r\n  obj = JSON.parse(json);\r\n  if (obj.err) {\r\n    error.innerText = obj.err;\r\n  } else {\r\n    error.innerText = \"Your login attempt was not successful. Please try again.\";\r\n  }\r\n};\r\n\r\nfunction postForm(file, formDataNode, id, nextNum) {\r\n\r\n  let i, pagePath, xhttp, formData;\r\n  formData = new FormData();\r\n  pagePath = file;\r\n  for (i in formDataNode) {\r\n    formData.append(formDataNode[i].name, formDataNode[i].value);\r\n  };\r\n  xhttp = new window.XMLHttpRequest();\r\n  xhttp.onreadystatechange = function () {\r\n    if (this.readyState == 4) {\r\n      if (this.status == 200) {\r\n        if (this.response.startsWith(\"<!DOCTYPE html>\")) {\r\n          document.open();\r\n          document.write(this.responseText);\r\n          pagePath = '?' + id;\r\n          history.pushState({\r\n            data: pagePath\r\n          }, {\r\n            title: pagePath\r\n          }, \"\");\r\n          document.close();\r\n        } else {\r\n          contentToView(this.responseText, nextNum);\r\n        }\r\n      }\r\n      if (this.status == 404) {\r\n        contentToView({\r\n          \"err\": 'Help me, Obi-Wan Kenobi. You’re my only hope. The server turned to the dark side',\r\n        }, nextNum);\r\n      }\r\n    }\r\n  }\r\n  xhttp.open('POST', pagePath, true);\r\n  xhttp.send(formData);\r\n};\r\n\r\nfunction clearPath(path, x) {\r\n  if (window.location.pathname === path) {\r\n    window.location.pathname = '/';\r\n    for (i = 0; i < x; i++) {\r\n      history.pushState(\"\", \"\", \"/\");\r\n    };\r\n  }\r\n  if (window.location.search) {\r\n    history.pushState(\"\", \"\", \"/\");\r\n  }\r\n};\r\nclearPath('/logout', 30);\n\n//# sourceURL=webpack:///./login.js?");

/***/ })

/******/ });