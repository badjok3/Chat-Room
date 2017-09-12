const mongoose = require('mongoose'), Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    title: {type: String, required: true},
    participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    private: {type: Boolean}
});

module.exports = mongoose.model('Conversation', ConversationSchema);