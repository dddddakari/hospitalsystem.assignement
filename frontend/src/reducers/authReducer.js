const initialState = {
    isAuthenticated: localStorage.getItem('token') ? true : false,
    user: null,
    loading: false,
    error: null,
    users: []
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_REQUEST':
        return { ...state, loading: true, error: null };
      case 'LOGIN_SUCCESS':
        return { ...state, loading: false, isAuthenticated: true, user: action.payload };
      case 'LOGIN_FAILURE':
        return { ...state, loading: false, error: action.payload };
      case 'LOGOUT':
        return { ...state, isAuthenticated: false, user: null };
      case 'FETCH_USERS_SUCCESS':
          return {...state, users: action.payload};
      default:
        return state;
    }
  };
  
  export default authReducer;