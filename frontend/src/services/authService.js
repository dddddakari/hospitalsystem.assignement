import api from './api';

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/users/login', { username, password });
      if (response.data.token) {
        // Save the token in localStorage
        localStorage.setItem('token', response.data.token);
        return response.data; // Return the user data or token as needed
      }
      return null; // Return null if no token is present
    } catch (error) {
      // Handle any error that may occur during the login request
      console.error('Login failed:', error.response || error.message);
      return null;
    }
  },

  logout: () => {
    // Remove token from localStorage upon logout
    localStorage.removeItem('token');
  },

  // Optional: You can add a method to check if the user is logged in
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  },

  // Optional: You can also add a method to get the stored token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default AuthService;
