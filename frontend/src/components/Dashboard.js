import React from 'react';
import PatientList from './PatientList';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <PatientList />
      <AppointmentList />
      <AppointmentForm />
    </div>
  );
}

export default Dashboard;