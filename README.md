# TODO List Application
> Creating and sharing list containing todo tasks.
## Table of contents
* [Files and architecture](#files-and-architecture)
* [Environment](#environment)
* [Installation](#enstallation)
* [Functionality](#functionality)
* [Technologies](#technologies)
* [Authors](#authors)
* [Important links](#Important-links)
* [References](#references)

## Files and architecture

* Frontend - Angular
    *  components
        * dashbaord - to show all lists, add ,remove task and share lists among friends
        * subtask - to show nested tasks
        * friends - to send and receive friend request and add and remove them from your friends list
        * login - to login and forgot password of user's account
        * signup - to create a new account
    * services
        * app - call all api's related to user
        * list - call all api's related to user's lists
        * socket - to emit and listen to events for RTC(Real Time Communication)
    * pipes
        * search - to search tasks or subtasks from list
        * filter - to filter users
        * filter-friends - to filter friends and friendRequests
* Backend - Node.js
    * config - Redis and MongoDB configuration
    * controllers - contains function for each route
    * libs - libraries
    * middlewares - for checking authorization
    * models - Database Models and schemas
    * routes - api routes
    * app.js - connection and imports

## Environment

* [Angular](https://angular.io/guide/setup-local)
* [Node.js](https://nodejs.org/dist/v12.18.0/node-v12.18.0-x64.msi)
* [MongoDB](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.7-signed.msi)

## Installation

1. Clone or [Download Zip](https://github.com/sauravgarg001/TODO-list-backend.zip) 
```
git clone https://github.com/sauravgarg001/TODO-list-backend.git
```
2. Goto TODO-list-backend directory
```
cd TODO-list-backend
```
3. Install all dependencies
```
npm install
```
4. [Signup](https://redislabs.com/try-free/) and [Login](https://app.redislabs.com/#/login) on redislabs.com

5. Create database and copy Endpoint and Redis Password, update the given info in *config/configApp.js* file.
```
redis: {
        url: 'redis://<endpoint>',
        password: '<redis password>'
    }
```
6. Run server
```
npm start
```
7. Open given below url on browser
```
http://localhost:3000/
```
8. Clone or [Download Zip](https://github.com/sauravgarg001/TODO-list-frontend.zip) 
```
git clone https://github.com/sauravgarg001/TODO-list-frontend.git
```
9. Goto TODO-list-frontend directory
```
cd TODO-list-frontend
```
10. Install all dependencies
```
npm install
```
11. Run server
```
ng serve
```
12. Open given below url on browser
```
http://localhost:4200/
```

## Functionality

* User can signup and create account and then login to dashboard
* Forgot password option can be used in case the user doesn't remember password. An OTP is send to the registered email of user. After entering the correct OTP and new password the passsword gets changed.
* At dashboard user has an option to create new list or his previous active list will appear if any.
* User can create subtasks of any task, and there is also an option to search each task at any level.
* User can select any list from his lists to be in active list.
* If the User has edit access he/she can add or remove tasks from the list.
* If the user is Owner of list he/she can add, remove or change access to edit or readonly for contributers.
* All the contributers of list can see the updated list in real time.
* User can send or accpet friend requests from the users list.

## Technologies

* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [Angular](https://angular.io/guide/setup-local) - Frontend JavaScript Framework
* [JavaScript](https://www.javascript.com/) - Programming language
* [MongoDB](https://www.mongodb.com/) - NoSQL database

## Authors

* **Saurav Garg** - *Initial work* - [sauravgarg001](https://github.com/sauravgarg001)


## Important links

* [API Documentation]()
* [Socket Endpoints Documentation]()
* [Github repository for frontend](https://github.com/sauravgarg001/TODO-list-frontend)
* [Github repository for frontend build version](https://github.com/sauravgarg001/TODO-list-angular)
* [Github repository for backend](https://github.com/sauravgarg001/TODO-list-backend)
* [Hosted app on AWS](ec2-54-167-94-143.compute-1.amazonaws.com)


## References

* Count subdocument array with conditional field: https://stackoverflow.com/questions/46339175/mongodb-aggregation-conditional-adding-field-based-on-value-in-array
* Mongoose instance .save() not working when embedded array object changed:
https://stackoverflow.com/questions/47123599/mongoose-instance-save-not-working-when-embedded-array-object-changed
* Font Awesome 5: https://github.com/FortAwesome/angular-fontawesome
* Get child node index: https://stackoverflow.com/questions/5913927/get-child-node-index
* Mixed Schema Type: https://mongoosejs.com/docs/2.7.x/docs/schematypes.html
