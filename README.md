### Install Mongodb

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

## Start the database

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
mongod --dbpath D:\Dropbox\Coding\Javascript\Database\database\data

mongo
```

or 
```
mongod --dbpath "C:\Users\Shahar Yogev LP\Dropbox\Coding\Javascript\Database\database\data"

mongo
```


The database is on port 27017 - 
http://localhost:27017/


DropDown - https://codepen.io/ejsado/pen/dAtra

Schema:
db users
collections:
userslist
    user name ~
    email ~
    has ~
    movies
    log
    login sucsses ~
    login faliur ~

movieslist
    movie name
    inventory status +-
    users email + inventory 
    
    dropdown bi - db querys
        Most rented movies
        The movie with the higest inventory
        The movie with the lowst inventory
        The user with the higest inventory
        The user with the higest movies veraity 
        Top 10 movies for rent
        



