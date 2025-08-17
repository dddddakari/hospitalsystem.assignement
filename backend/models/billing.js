const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  amount: Number,
  date: Date,
  description: String,
});

module.exports = mongoose.model('Billing', billingSchema);