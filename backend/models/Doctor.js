const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:             { type: String, required: true },
  specialization:   { type: String, required: true },
  city:             { type: String, required: true },
  consultationType: { type: String, enum: ['Online', 'Physical', 'Both'], default: 'Both' },
  experience:       { type: Number, default: 0 },
  rating:           { type: Number, default: 0 },
  bio:              { type: String },
  phone:            { type: String },
  profilePic:       { type: String },
  isAvailable:      { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);