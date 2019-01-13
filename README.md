# Skiers
Online ski rental shop management app

## The app includes:
* Login screen - for store employees + password hash. 
* Creation of new employee.
* Inventory and customers management system - MongoDB database.
* Business intelligent API - managerial queries that help manage the store inventory. 
* Chat - for an easy way to communicate between employees in the store - socket.Io.

## Technologys in this project: 

## Mongodb

Install mongodb
open new project folder
install express to the folder
add the kerberos and mongodb curent versions to the package.json file.
```
"mongodb": "~3.1.8",
"kerberos": "~1.1.0"
```

npm install 

conect the mongodb to env https://stackoverflow.com/questions/15053893/error-when-trying-to-connect-to-a-mongod/15055641

### Start the database

start nodejs - 
```
npm start
/
nodemon /bin/www 

npm run debug
```

The server is on port 3000 - 
http://localhost:3000/

In a new terminal
start mongodb: mongod --dbpath(the path to the data folder in the project)
```
mongod --dbpath D:\path\data

mongo
```


The database is on port 27017 - 
http://localhost:27017/


Schema:
db users
collections:
userslist
    user name
    email
    pasword hash


itemlist
    item name
    inventory status +-
    users email + inventory 
    
    customer name
    email
    phone
    iventory
    days

    dropdown bi - db querys
        Most rented items
        The items with the higest inventory
        The items with the lowst inventory
        The customer with the higest inventory
        The customer with the higest movies veraity 
        Top 10 items for rent
        
        
## Socket.IO 

npm install --save socket.io 
npm install --save express-validator
  https://express-validator.github.io/docs/index.html
npm install --save express-session


## Icons: 

All the icons on this project are from flaticon and iconfinder I have the permission to use them but i dont own them:

Icon made by https://www.freepik.com from www.flaticon.com 

https://www.flaticon.com/free-icon/ski_1348799

Icon made by Google from www.flaticon.com - https://www.flaticon.com/authors/google

https://www.flaticon.com/free-icon/send-button_60525

https://www.iconfinder.com/icons/326503/chat_icon
