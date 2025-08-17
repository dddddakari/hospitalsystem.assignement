import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../actions/appointmentActions';

function AppointmentList() {
  const appointments = useSelector((state) => state.appointments.appointments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  return (
    <div>
      <h2>Appointment List</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {appointment.patientId.name} - {appointment.date} {appointment.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentList;