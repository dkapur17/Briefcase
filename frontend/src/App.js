import { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import 'jquery';
import 'popper.js'

import Navbar from './components/General/Layout/Navbar';
import Home from './components/General/Home/Home';
import MyProfile from './components/General/Home/MyProfile';
import Login from './components/General/Auth/Login';
import Register from './components/General/Auth/Register';
import FullPageSpinner from './components/General/Layout/FullPageSpinner';
import CreateJob from './components/Recruiters/CreateJob';
import ActiveJobs from './components/Recruiters/ActiveJobs';
import JobDashboard from './components/Applicants/JobDasboard';
import MyApplications from './components/Applicants/MyApplications';
import JobApplications from './components/Recruiters/JobApplications';
import MyRecruits from './components/Recruiters/MyRecruits';

import UserContext from './contexts/UserContext';

const App = (props) => {

  const [userData, setUserData] = useState({ token: undefined, user: undefined });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginCheck = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }
      const tokenType = await (await axios.post('/api/general/tokenType', null, { headers: { 'auth-token': token } })).data.type;
      let user = null;
      if (tokenType)
        user = await (await axios.post(`/api/${tokenType}/getUserData`, null, { headers: { 'auth-token': token } })).data;
      setUserData({ token, user });
      if (!user)
        localStorage.setItem('auth-token', '');
      setLoading(false);
    };
    loginCheck();
  }, []);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Navbar />
          {loading ? <FullPageSpinner /> : <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/myProfile' component={MyProfile} />
            <Route exact path='/createJob' component={CreateJob} />
            <Route exact path='/activeJobs' component={ActiveJobs} />
            <Route exact path='/jobDashboard' component={JobDashboard} />
            <Route exact path='/myApplications' component={MyApplications} />
            <Route exact path='/viewApplications/:jobId' component={JobApplications} />
            <Route exact path='/myRecruits' component={MyRecruits} />
            <Redirect to='/404' />
          </Switch>}
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App;
