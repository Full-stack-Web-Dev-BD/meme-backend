import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './features/Home/Home';
import Register from './features/Register/Register';
import "./app.css"
import Account from './features/Account/Account';
import Terms from './features/Terms/Terms';
import HowToPlay from './features/HowToPlay/HowToPlay';
import Dashboard from './features/MainDashboard/Dashboard'
import Login from './features/Login/Login';
import { getUserFromToken } from './Util';
import { useRecoilState } from 'recoil';
import { appState } from './states/appState';
import axios from 'axios';
import { baseURL } from './utils/constant';
import Success from './features/PaymentSuccess/Success';

import { gapi } from 'gapi-script';
function App() {
  const [user, setuser] = useState()
  const [getAppState, setAppState] = useRecoilState(appState)
  const clientId = '777503944063-5mssnj41ranrib5alak109bhr2h3csl7.apps.googleusercontent.com'

  useEffect(() => {
    setuser(getUserFromToken())
    if (getUserFromToken()) {
      axios.get(`${baseURL}/api/user/find/${getUserFromToken()._id}`)
        .then(resp => {
          setAppState({ ...getAppState, user: { name: "hello" } })
          axios.get(`${baseURL}/api/room`)
            .then(resp2 => {
              setAppState({ ...getAppState, rooms: resp2.data, user: resp.data, loaded: true })
            })
        })
    } else {
      setAppState({ ...getAppState, loaded: true })
    }

  }, [])
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  });
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position="bottom-right" />
        {
          getAppState.loaded ?
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              {
                user ?
                  <>
                    {/* <Route path="/topic" element={<Topic />} /> */}
                    <Route path="/success" element={<Success />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/account" element={<Account />} />
                  </> : ''
              }
            </Routes> :
            <img className='loading_gif' src='/assets/loading.gif' />
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
