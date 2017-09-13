const Conversation = require('../models/Conversation'),
    Message = require('../models/Message'),
    User = require('mongoose').model('User');

const FormatDate = require('../utilities/formatDate');


exports.getConversations = function (req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({})
        .then(conversations => {
            res.render('conversation/conversation', {conversations: conversations})
        });

};

exports.getCurrentConversation = function (req, res, next) {
    Conversation.find({})
        .then(conversations => {

            Conversation.findOne({'name': req.query.name})
                .populate('participants')
                .then(conversation => {

                    Message.find({'conversationId': conversation._id})
                        .populate('author')
                        .then(messages => {
                            messages.forEach(m => m.date = FormatDate.formatDate(m.timestamps));
                            res.render('conversation/conversation', {
                                conversations: conversations,
                                conversation: conversation,
                                messages: messages
                            })
                        })
                })
        });
};

exports.getConversationByID = function (req, res, next) {
    let conversationId = req.params.id;
    Conversation.find({})
        .then(conversations => {

            Conversation.findOne({'_id': conversationId})
                .populate('participants')
                .then(conversation => {

                    Message.find({'conversationId': conversation._id})
                        .populate('author')
                        .then(messages => {
                            messages.forEach(m => m.date = FormatDate.formatDate(m.timestamps));
                            res.render('conversation/conversation', {
                                conversations: conversations,
                                conversation: conversation,
                                messages: messages
                            })
                        })
                })
        });
};

exports.newConversation = function (req, res, next) {

    let conversation = new Conversation({
        participants: [req.user._id],
        name: req.body.name,
    });

    conversation.save(function (err, newConversation) {
        if (err) {
            res.send({error: err});
            return next(err);
        }
        let today = new Date();

        let initialMessage = new Message({
            conversationId: conversation._id,
            body: 'Conversation "' + conversation.name + '" has been created on ' + today.getDay() + '.' + today.getMonth() + '.' + today.getFullYear() + '!',
            author: req.user
        });

        initialMessage.save();

        let name = req.body.name;
        res.redirect('/conversation/conversation?name=' + name);
    });
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