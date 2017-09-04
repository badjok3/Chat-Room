const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(3000).sockets;

// Connect to mongo
mongo.connect('mongodb://localhost/chatDb', function (err, db) {
    if (err) {
        throw err;
    }

    console.log('MongoDB connected');
});




// module.exports = (config) => {
//     mongoose.connect(config.connectionString);
//
//     //подай ми сегашната конекция и я приеми в database
//     let database = mongoose.connection;
//     database.once('open', (error) => {
//         if (error) {
//             console.log(error);
//             return;
//         }
//
//         console.log('MongoDB ready!')
//     });
//
//
//     //заявяваме , че ще използваме долу описаните файлове и директорията им
//     require('./../models/Role').initialize();
//     require('./../models/User').seedAdmin();
//     require('./../models/Article');
//     require('./../models/Category');
//     require('./../models/Tag');
//     require('./../models/Comment');
//
// };