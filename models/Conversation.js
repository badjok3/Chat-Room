const mongoose = require('mongoose'), Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    name: {type: String, unique: true, required: true},
    participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    isPublic: {type: Boolean, default: true}
});


module.exports = mongoose.model('Conversation', ConversationSchema);