const express = require('express'), http = require('http');
const app = express();
const server = http.createServer(app);
const client = require('socket.io').listen(server);
const mongo = require('mongodb').MongoClient;
const User = require('mongoose').model('User');


mongo.connect('mongodb://127.0.0.1/chatDb', function (err, db) {
    if (err) {
        throw err;
    }

    // Connect to Socket.io
    client.on('connection', function (socket) {
        let currentRoom = $('#publicChatsList option:selected');
        let chat = db.collection(currentRoom);

        // Create function to send status
        sendStatus = function (s) {
            socket.emit('status', s);
        };

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id: 1}).toArray(function (err, res) {
            if (err) {
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function (data) {
            let args = req.body;
            console.log(args);
            console.log(data);
            let name = User.findOne({email: args.email});
            let message = data.message;

            // Check for name and message
            if (name == '' || message == '') {
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function () {
                    client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function (data) {
            // Remove all chats from collection
            chat.remove({}, function () {
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});


module.exports = {
    chatGet: (req, res) => {
        res.render('chatRoom/allChats');
    },
};