const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: Date,
  medicalHistory: String,
  // ... other fields
});

module.exports = mongoose.model('Patient', patientSchema);