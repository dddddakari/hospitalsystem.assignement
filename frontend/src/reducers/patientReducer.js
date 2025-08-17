const initialState = {
    patients: [],
    loading: false,
    error: null,
  };
  
  const patientReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_PATIENTS_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_PATIENTS_SUCCESS':
        return { ...state, loading: false, patients: action.payload };
      case 'FETCH_PATIENTS_FAILURE':
        return { ...state, loading: false, error: action.payload };
      // ... other patient actions
      default:
        return state;
    }
  };
  
  export default patientReducer;