const mongoose = require('mongoose');
const { Schema } = mongoose;
const messageSchema = new Schema({
    message: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    time: { type: Date, default: Date.now }
});
messageSchema.index({ conversation: 1, time: -1 });
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;