# Skiers
Online ski rental store management app
Link - https://skiers.appspot.com/

Demo - jango@skiers.com Jango123


## The app includes:
* Login screen - for store employees + password hash. 
* Creation of new employee.
* Inventory and customers management system - MongoDB database.
* Business intelligent API - managerial queries that help manage the store inventory. 
* Chat - for an easy way to communicate between employees in the store - socket.Io.
* CSS - all the CSS in the project created by me, based on flexbox module and the design inspiration from Google and WhatsApp(for the chat).  


## What is Skiers?

Ski rental management system for the employees and the management team.
The app itself suppose to run on the front desk tablet and all the mobile devices or tablets of the employees( they are the users).  

### Open a new order for new / returned customer:
* Add new customer - will add the customer to the database or update an existing one with the new details based on the email of the customer (the customer email follow to the next tab automatically).
* Rent tab - click on the item name input box will give the full inventory available for rent (I am using HTTP request for compatibility with older browsers).
* Return tab - click on the email input will get the full customers list and show it in the drop-down box.
* * After the customer email selection the items list will show only his items in the drop-down list.
* New inventory tab - will add new inventory for new or existing items, if the inventory will have a '-' sing before the number the inventory will be reduced in this amount.

### The chat module 

The Chat module created for better communication between the users, for them not to really on additional apps and keep them focused on the same screen. The chat purpose is to help employees communication inside the store, for instance, if one is in the storage room end need to ask the boot fitter for the size range for a customer.
The main functionality is for the group conversation and maybe one on one chat functionality in the next version. 

### Chat different modes:
* Half screen - show online users and the active chat messages that scroll in to view.
* Mini - show just a few messages.
* Full screen - show the chat module in the full available screen space on double click. 
* Icon - the chat module will shrink to the chat icon on signal click. 

## Technologies in this project: 

## Mongodb - Database

Open new project folder and install express to this folder:

````
$ npm install express
````

Install MongoDB

````
npm install mongodb --save
````

I run into this problem on windows 10 machine   - Connect the MongoDB to env:
https://stackoverflow.com/questions/15053893/error-when-trying-to-connect-to-a-mongod/15055641

Install Nodemon - Auto server reload on the development stage.

````
npm install -g nodemon
````

### Start the server with Nodemon

start nodejs - 

```
npm start

nodemon /bin/www 

npm run debug 
```

The server is on port 3000 - 
http://localhost:3000/


### Start MongoDB

In a new Terminal / PowerShell for the first setup you will need to start MongoDB by entering the path to the data folder :

mongod --dbpath(the path to the data folder in the project)

```
mongod --dbpath D:\path\data

mongo
```

The database is on port 27017 - 
http://localhost:27017/


#### App Schema:
db users
collections:
usersList
    user name
    email
    password hash
		login status
appData
    user(customer):
			email
			name
			phone
		item:
			title
    	inventory status +-
    	user(customer) email + inventory 
		

        
## Socket.IO 

Socket io made the chat module very easy to build, the documentation is great. 

````
npm install --save socket.io 
````


## Post forms with xhttp - 

For GET or POST request live with no reloads or distractions to the user I use the xhttp request and render the JSON response to the user.

express formidable is very good dataForm object reader for the POST requests, body parser can't handle these objects. 
bcrypt - use to hash the passwords. 

````
npm install --save express-formidable
npm install --save express-session
npm install --save bcrypt
````

## Icons: 

All the icons on this project are from flaticon and iconfinder I have the permission to use them  from the websites but I don't own them:

Icon made by https://www.freepik.com from www.flaticon.com 

https://www.flaticon.com/free-icon/ski_1348799

Icon made by Google from www.flaticon.com - https://www.flaticon.com/authors/google

https://www.flaticon.com/free-icon/send-button_60525

https://www.iconfinder.com/icons/326503/chat_icon


## App Data: 

All the app data that you see in the production app example is just for fun and not owned by me in any way. 

The app users names and sentences are from the Star Wars movies, the rights for their intellectual property of Disney.com.

I used quotes from the Star Wars website:

https://www.starwars.com/news/40-memorable-star-wars-quotes

The names of the customer are names of Olympic skiers and snowboarders, and all the phone numbers are reel ski rental shops from their homeland country.  

https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_alpine_skiing
https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_snowboarding
