const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientName: { type: String },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  type:        { type: String, enum: ['Online', 'Physical'], default: 'Online' },
  problem:     { type: String },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);