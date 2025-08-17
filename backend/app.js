// backend/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const billingRoutes = require('./routes/billing');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/billing', billingRoutes);

module.exports = app; 
