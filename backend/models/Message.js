const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  doctorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  senderName:  { type: String },
  senderEmail: { type: String },
  senderPhone: { type: String },
  problem:     { type: String },
  reply:       { type: String },
  isAIReply:   { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);