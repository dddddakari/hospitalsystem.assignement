const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const auth = require('../middleware/auth'); // Example auth middleware

router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const patient = new Patient(req.body);
  try {
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... other routes (GET by ID, PUT, DELETE)
module.exports = router;