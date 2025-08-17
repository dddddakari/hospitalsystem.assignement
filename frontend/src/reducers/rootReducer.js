import { combineReducers } from 'redux';
import patientReducer from './patientReducer';
import appointmentReducer from './appointmentReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  patients: patientReducer,
  appointments: appointmentReducer,
  auth: authReducer,
});

export default rootReducer;