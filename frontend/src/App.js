import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AppointmentList from './components/AppointmentList';
import Billing from './components/Billing';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatients } from './actions/patientActions';
import { fetchAppointments } from './actions/appointmentActions';
import { fetchUsersSuccess } from './actions/authActions';
import api from './services/api';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPatients());
      dispatch(fetchAppointments());
      api.get('/users').then(response => {
        dispatch(fetchUsersSuccess(response.data))
      })
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/login" component={LoginForm} />
          <PrivateRoute path="/dashboard" component={Dashboard} isAuthenticated={isAuthenticated} />
          <PrivateRoute path="/patients" component={PatientList} isAuthenticated={isAuthenticated} />
          <PrivateRoute path="/appointments" component={AppointmentList} isAuthenticated={isAuthenticated} />
          <PrivateRoute path="/billing" component={Billing} isAuthenticated={isAuthenticated} />
          <Route exact path="/">
            {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default App;