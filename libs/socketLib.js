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
        socket.on('disconnect', () => { // disconnect the user from socket

        });
    });
}


/* Database operations are kept outside of socket.io code. */


module.exports = {
    setServer: setServer
}