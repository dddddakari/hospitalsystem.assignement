import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatients } from '../actions/patientActions';

function PatientList() {
  const patients = useSelector((state) => state.patients.patients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <div>
      <h2>Patient List</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;