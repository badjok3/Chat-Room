const Conversation = require('../models/Conversation'),
    Message = require('../models/Message'),
    User = require('mongoose').model('User');
const FormatDate = require('../utilities/formatDate');

exports.postMessage = function (req, res) {

    let message = new Message({
        conversationId: req.body.inputConversationId,
        author: req.user,
        body: req.body.message
    });

    message.save();

    Conversation.find({})
        .then(conversations => {

            Conversation.findOne({'_id': req.body.inputConversationId})
                .populate('participants')
                .then(conversation => {

                    let isInList = false;
                    for (let obj of conversation.participants) {
                        if (obj.nickname === req.user.nickname) {
                            isInList = true;
                            break;
                        }
                    }

                    if (!isInList) {
                        conversation.participants.push(req.user);
                        conversation.update();
                        conversation.save();
                    }

                    if (isInList === false) {
                        conversation.participants.push(req.user);
                        conversation.update();
                        conversation.save();
                    }

                    Message.find({'conversationId': conversation._id})
                        .populate('author')
                        .then(messages => {
                            messages
                                .reverse()
                                .forEach(m => m.date = FormatDate.formatDate(m.timestamps));
                            res.render('conversation/conversation', {
                                conversations: conversations,
                                conversation: conversation,
                                messages: messages
                            })
                        });
                })
        });


};


