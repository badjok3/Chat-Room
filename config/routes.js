const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const chatController = require('./../controllers/chat');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/chatRoom/allChats', chatController.loadPage);

    app.get('/chatRoom/newChat', chatController.getNewConversation);
    app.post('/chatRoom/newChat', chatController.newConversation);

    app.get('/conversation/:id', chatController.joinConversation)
};

