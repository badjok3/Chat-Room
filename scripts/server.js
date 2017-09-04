const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to mongo
mongo.connect('mongodb://localhost/chatDb', function (err, db) {
    if (err) {
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to socket.io
    client.on('connection', function () {
        let chat = db.collection('chats');

        // Send status
        let sendStatus = function (s) {
            socket.emit('status', s);
        };

        // Get chats from database
        chat.find().limit(100).sort({_id:1}).toArray(function (err, res) {
            if(err) {
                throw err;
            }

            //Emit messages
            socket.emit('output', res);
        });

        //Handle input events
        socket.on('input', function (data) {
            let name = data.name;
            let msg = data.message;

            //Check for name and message
            if(name === '' || msg === '') {
                sendStatus('Please enter a name and message');
            } else {
                //Insert message
                chat.insert({name: name, message: message}, function () {
                    client.emit('output', [data]);

                    //Send status object
                    sendStatus({
                        message: 'Message sent'
                    });
                });
            }
        });
    });
});