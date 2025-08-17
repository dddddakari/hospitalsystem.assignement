import React from 'react';

function PatientDetails({ patient }) {
  if (!patient) return <div>Select a patient</div>;

  return (
    <div>
      <h2>Patient Details</h2>
      <p>Name: {patient.name}</p>
      <p>DOB: {patient.dob}</p>
      <p>Medical History: {patient.medicalHistory}</p>
      {/* ... other patient details */}
    </div>
  );
}

export default PatientDetails;