const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId doctorId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const appointment = new Appointment(req.body);
  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... (GET by ID, PUT, DELETE)
module.exports = router;