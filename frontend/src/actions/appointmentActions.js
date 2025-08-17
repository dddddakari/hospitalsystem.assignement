import api from '../services/api';

export const fetchAppointmentsRequest = () => ({ type: 'FETCH_APPOINTMENTS_REQUEST' });
export const fetchAppointmentsSuccess = (appointments) => ({ type: 'FETCH_APPOINTMENTS_SUCCESS', payload: appointments });
export const fetchAppointmentsFailure = (error) => ({ type: 'FETCH_APPOINTMENTS_FAILURE', payload: error });

export const fetchAppointments = () => async (dispatch) => {
  dispatch(fetchAppointmentsRequest());
  try {
    const response = await api.get('/appointments');
    dispatch(fetchAppointmentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchAppointmentsFailure(error.message));
  }
};

export const createAppointment = (appointment) => async (dispatch) => {
    try {
        await api.post('/appointments', appointment);
        dispatch(fetchAppointments());
    } catch (error) {
        console.error("Error creating appointment:", error);
    }
}

// ... other appointment actions