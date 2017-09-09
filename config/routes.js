const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/home');
const io = require('socket.io').listen(80);
const chatController = require('./../controllers/chat');

let chat = io
    .of('/chat')
    .on('connection', function (socket) {
        chatController.respond(chat, socket);
    });

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/chatRoom/allChats', chatController.chat);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

};

