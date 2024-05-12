const mongoose = require('mongoose');
const { Schema } = mongoose;
const conversationSchema = new Schema({
    person1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    person2: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;