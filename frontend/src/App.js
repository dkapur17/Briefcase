import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import 'jquery';
import 'popper.js'

import Navbar from './components/General/Layout/Navbar';
import Home from './components/General/Home/Home';
import Login from './components/General/Auth/Login';
import Register from './components/General/Auth/Register';

import UserContext from './contexts/UserContext';

const App = () => {

  const [userData, setUserData] = useState({ token: undefined, user: undefined });

  useEffect(() => {
    const loginCheck = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }
      const tokenType = await (await axios.post('api/general/tokenType', null, { headers: { 'auth-token': token } })).data.type;
      let user = null;
      if (tokenType)
        user = await (await axios.post(`api/${tokenType}/getUserData`, null, { headers: { 'auth-token': token } })).data;
      setUserData({ token, user });
      if (!user)
        localStorage.setItem('auth-token', '');
    };
    loginCheck();
  }, []);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
