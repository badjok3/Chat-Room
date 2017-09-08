const express = require('express'), http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const mongo = require('mongodb').MongoClient;

let usernames = {};

let rooms = ['room1', 'room2'];

// Connect to mongo
mongo.connect('mongodb://localhost/chatDb', function (err, db) {
    if (err) {
        throw err;
    }

    console.log('MongoDB connected...');
    let rooms = db.collection('ChatRooms');

    // Connect to socket.io
    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('sendchat', function (data) {
            io.sockets.in(socket.room).emit('updatechat', socket.username, data);
        });

        // listener, whenever the server emits 'updatechat', this updates the chat body
        socket.on('updatechat', function (username, data) {
            $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
        });

// listener, whenever the server emits 'updaterooms', this updates the room the client is in
        socket.on('updaterooms', function (rooms, current_room) {
            $('#rooms').empty();
            $.each(rooms, function (key, value) {
                if (value == current_room) {
                    $('#rooms').append('<div>' + value + '</div>');
                }
                else {
                    $('#rooms').append('<div><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></div>');
                }
            });
        });

        function switchRoom(room) {
            socket.emit('switchRoom', room);
        }

// on load of page
        $(function () {
            // when the client clicks SEND
            $('#datasend').click(function () {
                console.log('q');
                let message = $('#data').val();
                $('#data').val('');
                // tell server to execute 'sendchat' and send along one parameter
                socket.emit('sendchat', message);
            });

            // when the client hits ENTER on their keyboard
            $('#data').keypress(function (e) {
                if (e.which == 13) {
                    $(this).blur();
                    $('#datasend').focus().click();
                }
            });

            socket.on('switchRoom', function (newroom) {
                // leave the current room (stored in session)
                socket.leave(socket.room);
                // join new room, received as function parameter
                socket.join(newroom);
                socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
                // sent message to OLD room
                socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
                // update socket session room title
                socket.room = newroom;
                socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
                socket.emit('updaterooms', rooms, newroom);
            });

            socket.on('disconnect', function () {
                // remove the username from global usernames list
                delete usernames[socket.username];
                // update list of users in chat, client-side
                io.sockets.emit('updateusers', usernames);
                // echo globally that this client has left
                socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                socket.leave(socket.room);
            });
        });
    });
});