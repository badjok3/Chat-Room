const Conversation = require('../models/Conversation'),
    Message = require('../models/Message'),
    User = require('mongoose').model('User');


exports.postMessage = function (req, res) {

    let message = new Message ({
        conversationId: req.body.inputConversationId,
        author: req.user,
        body: req.body.message
    });

    message.save();
};

