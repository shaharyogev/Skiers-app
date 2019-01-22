import {
  chatBox,
  chatLogoButton,
  miniButton,
  navColumn,
  resultsPanelBackground
} from './app';

/*UX / UI Functions*/

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
};


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
        enlargeChat()
      } else {
        minimizeChat()
      }
      chatLogoButton.classList.toggle('changeDot');
      chatClosed = 0;
    }
  }
}


//menu X/E 
let backgroundSvg = '<svg height="100%" viewBox="0 0 512 512" width="100%" fill="rgb(197, 197, 197)" xmlns="http://www.w3.org/2000/svg"><path d="m338.5 178h-15v257.734375h-13.828125v-257.734375h-15v32.5h-76.75v15h17.191406l-29.691406 45.277344v-92.777344h-15v257.734375h-13.828125v-257.734375h-15v257.734375h-29.578125v38.289063h43.992187v37.976562h15v-37.976562h43.992188v-38.289063h-29.578125v-54.617187h76.75v-15h-17.285156l29.785156-45.421876v115.039063h-29.578125v38.289063h43.992188v37.976562h15v-37.976562h43.992187v-38.289063h-29.578125zm-118.5 272.734375v8.289063h-72.980469v-8.289063zm33.050781-225.234375h24.0625l-30.164062 46h-24.0625zm-6.101562 140.617188h-24.0625l30.164062-46h24.0625zm-29.027344-61v15h17.191406l-29.691406 45.277343v-78.894531h76.75v-15h-17.285156l29.785156-45.421875v79.039063zm135.15625 145.617187v8.289063h-72.984375v-8.289063zm0 0" /><path d="m230.257812 136.925781-12.09375-12.089843h-4.40625v-124.835938h-60.496093v124.832031h-4.410157l-12.09375 12.09375v28.574219h93.5zm-61.996093-29.09375h17.996093v-15h-17.996093v-15.332031h17.996093v-15h-17.996093v-15.5h17.996093v-15h-17.996093v-17h30.496093v109.832031h-30.496093zm46.996093 42.667969h-63.5v-7.359375l3.308594-3.308594h56.886719l3.304687 3.308594zm0 0" /><path d="m363.335938 136.925781-12.09375-12.089843h-4.410157v-124.835938h-60.492187v124.832031h-4.410156l-12.09375 12.09375v28.574219h93.5zm-61.996094-29.09375h17.992187v-15h-17.992187v-15.332031h17.992187v-15h-17.992187v-15.5h17.992187v-15h-17.992187v-17h30.492187v109.832031h-30.492187zm46.996094 42.667969h-63.5v-7.359375l3.308593-3.304687h56.886719l3.304688 3.304687zm0 0" /><path d="m38 286.5h111.09375v-15h-111.09375c-12.683594 0-23-10.316406-23-23s10.316406-23 23-23h111.09375v-15h-111.09375c-20.953125 0-38 17.046875-38 38s17.046875 38 38 38zm0 0" /><path d="m351 225.5h123c12.683594 0 23 10.316406 23 23s-10.316406 23-23 23h-123v15h123c20.953125 0 38-17.046875 38-38s-17.046875-38-38-38h-123zm0 0" /><path d="m474 305.117188h-123v15h123c12.683594 0 23 10.320312 23 23 0 12.683593-10.316406 23-23 23h-123v15h123c20.953125 0 38-17.046876 38-38 0-20.953126-17.046875-38-38-38zm0 0" /><path d="m149.09375 366.117188h-111.09375c-12.683594 0-23-10.316407-23-23 0-12.679688 10.316406-23 23-23h111.09375v-15h-111.09375c-20.953125 0-38 17.046874-38 38 0 20.953124 17.046875 38 38 38h111.09375zm0 0" /><path d="m474 250.5h-73v-15h73zm-83 0h-15v-15h15zm-25 0h-15v-15h15zm0 0" /><path d="m474 345.117188h-73v-15h73zm-83 0h-15v-15h15zm-25 0h-15v-15h15zm0 0" /></svg>';
let backgroundSvg64 = window.btoa(backgroundSvg);
resultsPanelBackground.style.backgroundImage = "url('data:image/svg+xml;base64," + backgroundSvg64 + "')";
let menuOpen = 0;
let menuClass;



function menuX(x, st) {
  x.classList.toggle('change');
  navColumn.classList.toggle('change');
  minimizeToggle('dot', 1);
  menuClass = x;
  if (menuOpen === 0) {
    st = setTimeout(function () {
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
  };
}
const style = document.documentElement.style;

function themeColors(is) {
  let rootColors = [{
      tc: ""
    },
    {
      tb: ""
    },
    {
      te: ""
    },
    {
      tec: ""
    },
    {
      tcc: ""
    },
    {
      tbi: ""
    },
    {
      tbc: ""
    },
    {
      tbic: ""
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
document.body.addEventListener("click", menuXX);



/*Forms and data*/

function goToRentTabWithEmail(id, nextNum) {
  let thisTab = document.getElementById(id);

  if (thisTab.querySelector('input[name="email"]')) {
    let email = thisTab.querySelector('input[name="email"]').value
    let tabClassList = document.getElementsByClassName("inventoryTab");
    thisTab.reset();
    tabToggle(nextNum, 'inventoryTab');
    tabClassList[nextNum].querySelector('input[name="email"]').value = email;

    if (tabClassList[nextNum].querySelector('input[name="email"]')) {
      let titleT = document.getElementById('title')
      titleT.innerText = email;
    }
  } else {
    thisTab.reset();
    tabToggle(nextNum, 'inventoryTab');
  }
}


//Forms validation