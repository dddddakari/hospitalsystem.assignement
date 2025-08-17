import AuthService from '../services//authService.js';
import api from '../services/api';

export const loginRequest = () => ({ type: 'LOGIN_REQUEST' });
export const loginSuccess = (user) => ({ type: 'LOGIN_SUCCESS', payload: user });
export const loginFailure = (error) => ({ type: 'LOGIN_FAILURE', payload: error });
export const logoutAction = () => ({ type: 'LOGOUT' });
export const fetchUsersSuccess = (users) => ({ type: 'FETCH_USERS_SUCCESS', payload: users});

export const login = (username, password, history) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const user = await AuthService.login(username, password);
    if (user) {
      dispatch(loginSuccess(user));
      history.push('/dashboard');
      const users = await api.get('/users')
      dispatch(fetchUsersSuccess(users.data))
    } else {
      dispatch(loginFailure('Invalid credentials'));
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => (dispatch) => {
  AuthService.logout();
  dispatch(logoutAction());
};