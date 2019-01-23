  import {
    chatSend,
    message,
    chatUl,
    chatUsersUl,
    userName
  } from './app.js';

  //Send user name to the server

  let socket = io();

  if (userName) {
    let userNameText = userName.innerText;
    includeThisHTML('/app', false, 'Current Inventory:');
    socket.emit('namedUserConnected', {
      userName: userNameText.toLowerCase()
    });

  };

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
  socket.on('updateOnlineUsersList', function (d) {
    let chatOnlineUsersUl = document.getElementById('chatUsersUl');
    chatOnlineUsersUl.innerHTML = "<li></li>";
    newUserChatCount = 0;
    for (let i in d) {
      newUserOnline(d[i])
    }
  });

  //Emit message + acknowledgement

  function sendMessage(newMessage) {
    socket.emit('new message', {
      message: newMessage
    }, function (d) {});

    //clear message input
    message.value = '';
  };

  //send message 
  chatSend.addEventListener("click", function () {
    if (message.value)
      sendMessage(message.value);
  });

  message.addEventListener("keydown", function (e) {
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
  };

  //Receive message and print to screen
  socket.on('new message', function (d) {
    printMessage(d);
  });

  socket.on('sendChatHistory', function (d) {
    for (let i in d) {
      printMessage(d[i]);
    }
  });

  socket.on('reload', function () {
    window.location.reload();
  });