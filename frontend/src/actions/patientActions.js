import api from '../services/api.js';

export const fetchPatientsRequest = () => ({ type: 'FETCH_PATIENTS_REQUEST' });
export const fetchPatientsSuccess = (patients) => ({ type: 'FETCH_PATIENTS_SUCCESS', payload: patients });
export const fetchPatientsFailure = (error) => ({ type: 'FETCH_PATIENTS_FAILURE', payload: error });

export const fetchPatients = () => async (dispatch) => {
  dispatch(fetchPatientsRequest());
  try {
    const response = await api.get('/patients');
    dispatch(fetchPatientsSuccess(response.data));
  } catch (error) {
    dispatch(fetchPatientsFailure(error.message));
  }
};

// ... other patient actions