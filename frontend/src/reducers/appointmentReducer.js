const initialState = {
    appointments: [],
    loading: false,
    error: null,
  };
  
  const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_APPOINTMENTS_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_APPOINTMENTS_SUCCESS':
        return { ...state, loading: false, appointments: action.payload };
      case 'FETCH_APPOINTMENTS_FAILURE':
        return { ...state, loading: false, error: action.payload };
      // ... other appointment actions
      default:
        return state;
    }
  };
  
  export default appointmentReducer;