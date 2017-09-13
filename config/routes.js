const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const conversationController = require('../controllers/conversation');
const messageController = require('../controllers/message');


module.exports = (app) => {
    app.get('/', homeController.indexGet);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);



    app.get('/conversation/conversation/:id', conversationController.getConversationByID);
    app.get('/conversation/conversation', conversationController.getConversations);
    app.get('/conversation/list', conversationController.getConversations);
    app.post('/chat/create', conversationController.newConversation);

    app.post('/message/create', messageController.postMessage);

    app.get('/user/profile', userController.profileGet);
    app.post('/user/edit', userController.profileEdit)
};

