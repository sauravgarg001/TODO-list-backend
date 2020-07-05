const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const events = require('events');

const eventEmitter = new events.EventEmitter();

//Libraries
const token = require("./tokenLib");
const redis = require("./redisLib");
const check = require("./checkLib");
const time = require("./timeLib");

//Models
const UserModel = mongoose.model('User');

let setServer = (server) => {

    let io = socketio.listen(server);

    let myIo = io.of('/'); //Namespaces '/' -> for creating multilple RTC in single website with different namspace

    myIo.on('connection', (socket) => { //All events should be inside this connection

        //socket.emit("<event name>",<data>)  -> triggering an event on client side
        //scoket.on("<event name", <callback function>) -> listening to an event from client side

        //-------------------------------------------------
        socket.emit("verifyUser", "");
        //-------------------------------------------------
        socket.on('set-user', (data) => {
            let userId = data.userId;
            let authToken = data.authToken;
            token.verifyTokenFromDatabase(authToken)
                .then((user) => {

                    console.log("User Verified");

                    let currentUser = user.data;
                    if (currentUser.userId != userId) {
                        throw Error("authToken not correct");
                    }
                    socket.userId = currentUser.userId // setting socket user id to identify it further
                    socket.email = currentUser.email // setting socket user id to identify it further

                    let key = currentUser.email
                    let value = authToken

                    redis.getAllUsersInAHash('onlineUsers')
                        .then((result) => {

                            let timeout = 0;
                            if (result[key]) { //check whether user is already logged somewhere
                                myIo.emit('auth-error@' + result[key], { status: 500, error: 'Already logged somewhere!' });
                                timeout = 500;
                            }

                            setTimeout(function() {

                                redis.setANewOnlineUserInHash("onlineUsers", key, value)
                                    .then((res) => {

                                        console.log(`${socket.email} is connected`);
                                        socket.room = 'edTODO' // joining chat room.
                                        socket.join(socket.room)

                                        redis.getAllUsersInAHash('onlineUsers')
                                            .then((result) => {
                                                let users = Object.keys(result); //with email
                                                let onlineUsers = Array(); //Online users email
                                                getFriends({ email: socket.email })
                                                    .then((friends) => {

                                                        for (let i = 0; i < users.length; i++) {
                                                            for (let j = 0; j < friends.length; j++) {
                                                                if (friends[j].user_id.email == users[i]) {
                                                                    onlineUsers.push(users[i]);
                                                                    socket.to(socket.room).broadcast.emit('online-user-add@' + result[users[i]], currentUser.email);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        socket.emit('online-users', onlineUsers);
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    });
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });

                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });

                            }, timeout);

                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }).catch((err) => {
                    console.log("Authentication error:" + err);
                    myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
                });
        });
        //-------------------------------------------------
        socket.on('add-contributer', (data) => {
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        socket.to(socket.room).broadcast.emit('add-contributer@' + result[data.email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('remove-contributer', (data) => {
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        console.log('remove-contributer@' + result[data.email]);

                        socket.to(socket.room).broadcast.emit('remove-contributer@' + result[data.email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('change-contributer', (data) => {
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        socket.to(socket.room).broadcast.emit('change-contributer@' + result[data.email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('add-friend', (data) => {
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        let email = data.email;
                        data.email = socket.email;
                        socket.to(socket.room).broadcast.emit('add-friend@' + result[email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('remove-friend', (data) => {
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        let email = data.email;
                        data.email = socket.email;
                        socket.to(socket.room).broadcast.emit('remove-friend@' + result[email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('add-friend-request', (data) => {
            if (data.userId == socket.userId) {
                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        let email = data.email;
                        data.email = socket.email;
                        socket.to(socket.room).broadcast.emit('add-friend-request@' + result[email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('tasks', (data) => {
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {
                        delete data.userId;
                        socket.to(socket.room).broadcast.emit('tasks@' + result[data.email], data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Authentication error: Invalid Token");
                myIo.emit('auth-error@' + authToken, { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('disconnect', () => { // disconnect the user from socket
            console.log(`${socket.email} is disconnected`);
            if (socket.email) {
                redis.deleteUserFromHash('onlineUsers', socket.email);
                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {

                        getFriends({ email: socket.email })
                            .then((friends) => {
                                for (let i = 0; i < friends.length; i++) {
                                    if (result[friends[i].user_id.userId])
                                        socket.to(socket.room).broadcast.emit('online-user-remove@' + result[friends[i].user_id.userId], socket.email);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });

                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    });
}


/* Database operations are kept outside of socket.io code. */
let getFriends = (data) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: data.email })
            .populate('friends.user_id', 'userId firstName lastName email -_id')
            .then((user) => {
                resolve(user.friends);
            }).catch((err) => {
                reject(err.message);
            });
    });
}


module.exports = {
    setServer: setServer
}