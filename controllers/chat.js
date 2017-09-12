const Conversation = require('../models/conversation'),
    Message = require('../models/message'),
    User = require('mongoose').model('User');

exports.loadPage = function (req, res) {
    Conversation.find({}).then(conversations => {
        conversations.count = conversations.length;
        User.find({}).then(users => {
            users.count = users.length;
            res.render('chatRoom/allChats', {
                conversations: conversations,
                users: users
            });
        });
    });

};

exports.getConversations = function (req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({participants: req.user._id})
        .select('_id')
        .exec(function (err, conversations) {
            if (err) {
                res.send({error: err});
                return next(err);
            }

            // Set up empty array to hold conversations + most recent message
            let fullConversations = [];
            conversations.forEach(function (conversation) {
                Message.find({'conversationId': conversation._id})
                    .sort('-createdAt')
                    .limit(1)
                    .populate({
                        path: "author",
                        select: "profile.firstName profile.lastName"
                    })
                    .exec(function (err, message) {
                        if (err) {
                            res.send({error: err});
                            return next(err);
                        }
                        fullConversations.push(message);
                        if (fullConversations.length === conversations.length) {
                            return res.status(200).json({conversations: fullConversations});
                        }
                    });
            });
        });
};

exports.getConversation = function (req, res, next) {
    Message.find({conversationId: req.params.conversationId})
        .select('createdAt body author')
        .sort('-createdAt')
        .populate({
            path: 'author',
            select: 'profile.firstName profile.lastName'
        })
        .exec(function (err, messages) {
            if (err) {
                res.send({error: err});
                return next(err);
            }

            res.status(200).json({conversation: messages});
        });
};

exports.getNewConversation = function (req, res) {
    res.render('chatRoom/newChat');
};

exports.newConversation = function (req, res) {
    let params = req.body;

    const conversation = new Conversation({
        title: params.title,
        participants: [req.user._id],
    });

    conversation.save(function (err, newConversation) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        res.render('chatRoom/allChats');
    });
};

exports.joinConversation = function (req, res) {
    let id = req.params._id;

    Conversation.findById(id).then(conversation => {
        conversation.participants.push(req.user._id);
        conversation.save(function (err) {
            if (err) {
                res.send({error: err});
                return next(err);
            }

            res.render(`conversation/:${id}`);
        });
    })
};

exports.sendMessage = function (req, res, next) {
    const message = new Message({
        conversationId: req.params.conversationId,
        body: req.body.composedMessage,
        author: req.user._id
    });

    message.save(function (err, sentMessage) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        res.status(200).json({message: 'Message successfully sent!'});
        return (next);
    });
};