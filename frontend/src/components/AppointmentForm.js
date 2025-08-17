import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../actions/appointmentActions';

function AppointmentForm() {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch();
  const patients = useSelector(state => state.patients.patients);
  const users = useSelector(state => state.auth.users);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAppointment({ patientId, doctorId, date, time, notes }));
  };

  return (
    <form onSubmit={handleSubmit}>
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>{patient.name}</option>
          ))}
        </select>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
          <option value="">Select Doctor</option>
          {users.filter(user => user.role === "doctor").map((user) => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button type="submit">Create Appointment</button>
    </form>
  );
}

export default AppointmentForm;