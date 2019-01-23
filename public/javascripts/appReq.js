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
  };

  if (titleTest != undefined) {
    let re =
      /^[\W \D \S ]{3,100}$/;
    let res = re.test(String(titleTest.value));
    if (!res) {
      formId.querySelector('.error').innerHTML =
        'The title is at least 3 character long ';
      test++;
    }
  };

  if (nameTest != undefined) {
    let re =
      /^[\W \D \S ]{3,100}$/;
    let res = re.test(String(nameTest.value));
    if (!res) {
      formId.querySelector('.error').innerHTML =
        'The customer name must be at least 3 character long ';
      test++;
    }
  };

  if (phoneTest != undefined) {
    let re =
      /^[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{1,6}$/;
    let res = re.test(String(phoneTest.value));
    if (!res) {
      formId.querySelector('.error').innerHTML =
        'Phone number ex: 000-000-000000). ';
      test++;
    }
  };

  if (inventoryTest != undefined) {
    if (inventoryTest.value == 0) {
      formId.querySelector('.error').innerHTML =
        'The inventory cant be 0 ';
      test++;
    }
  };

  if (daysTest != undefined) {
    if (daysTest.value <= 0) {
      formId.querySelector('.error').innerHTML =
        'The days must be more than 0 ';
      test++;
    }
  };

  if (test > 0) {
    test = 0;
    return false;

  } else {
    postForm(formAction, formDataNode, id, nextNum);
  }
};

//Rendering the response from the server

function contentToView(json, title) {
  let x, y, obj, objKey, txt, columnHeadline;
  txt = '';
  try {
    obj = JSON.parse(json);

    if (obj.err) {
      let error = document.getElementById('error')
      error.innerText = obj.err;
    } else {

      if (obj.title) {
        let titleT = document.getElementById('title')
        titleT.innerText = obj.title;


        if (obj.status) {
          let statusT = document.getElementById('status')
          statusT.innerText = obj.status
        }
        if (obj.name) {
          let statusT = document.getElementById('queryUl')
          statusT.innerText = obj.name
        }

        if (obj.itemsList) {
          let ul = document.getElementById('queryUl');
          ul.innerHTML = '';
          for (i in obj.itemsList) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(obj.itemsList[i]));
            ul.appendChild(li);
          }
        }
      } else {
        if (title) {
          let titleT = document.getElementById('title')
          titleT.innerText = title;

          if (title !== 'Current Inventory:') {
            console.log('test');
            document.getElementById("queryUl").scrollIntoView();
          }
        }
        if (!status) {
          let statusT = document.getElementById('status')
          statusT.innerText = ''
        }

        columnHeadline = Object.getOwnPropertyNames(obj[0])
        txt += "<table>"
        txt += "<tr>"
        for (x in columnHeadline) {
          txt += "<th>" + columnHeadline[x] + "</th>";
        }
        txt += "</tr>"
        for (x in obj) {
          txt += "<tr>"
          for (y in obj[x]) {
            txt += "<td>" + obj[x][y] + "</td>"
          }
          txt += "</tr>";
        }
        txt += "</table>"
        document.getElementById("queryUl").innerHTML = txt;


      }
    }
  } catch (err) {
    console.log(err);
  }
};

function dataListReq(list) {
  let dataList = document.getElementById(list + 'DataList');
  dataList.innerHTML = '';
  let input = document.getElementById(list + 'Input');
  let xhttp, jsonData;
  if (list) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          jsonData = JSON.parse(this.responseText)
          for (let i in jsonData) {
            let option = document.createElement('option');
            if (jsonData[i].item) {
              option.value = jsonData[i].item;
            }
            if (jsonData[i].label) {
              option.label = jsonData[i].label
            }
            dataList.appendChild(option);
          };

        }
        if (this.status == 404) {
          //DEV
        }
      }
    }
  }
  xhttp.open("GET", "/" + list, true);
  xhttp.send();
};


function dataListReqEmail(list, email) {
  let dataList = document.getElementById(list + 'DataList');
  dataList.innerHTML = '';
  let input = document.getElementById(list + 'Input');
  let xhttp, jsonData, formData;

  formData = new FormData();
  formData.append("email", email);

  if (list) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          jsonData = JSON.parse(this.responseText)
          for (let i in jsonData) {
            let option = document.createElement('option');
            if (jsonData[i].item) {
              option.value = jsonData[i].item;
            }
            if (jsonData[i].label) {
              option.label = jsonData[i].label
            }
            dataList.appendChild(option);
          };

        }
        if (this.status == 404) {
          //DEV
        }
      }
    }
  }
  xhttp.open("POST", "/" + list, true);
  xhttp.send(formData);
};


// Sending requests to the server

function includeThisHTML(page, back, title) {
  let pagePath, xhttp;
  if (page) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          if (this.response.startsWith("<!DOCTYPE html>")) {
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
          "title": 'We have a little problem'
        });
      }
    }
  }
  xhttp.open("GET", page, true);
  xhttp.send();
};



function postForm(page, formDataNode, id, nextNum) {
  let i, xhttp, formData;

  formData = new FormData();
  for (i in formDataNode) {
    formData.append(formDataNode[i].name, formDataNode[i].value);
  };

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        if (this.response.startsWith("<!DOCTYPE html>")) {
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
  }
  xhttp.open('POST', page, true);
  xhttp.send(formData);
};

//History manipulation

window.onpopstate = function (event) {
  minimizeToggle('dot', 0);
  if (window.location.pathname === '/' && window.location.search) {
    let newPage = window.location.search;
    let newPageLen = newPage.length;
    newPage = newPage.slice(1, newPageLen)
    includeThisHTML(newPage, "1");
  } else {
    includeThisHTML('/app');
  }
};