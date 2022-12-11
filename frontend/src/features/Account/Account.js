import React, { useEffect, useState } from 'react'
import Header from '../Components/Header/PageHeader'
import Footer from '../Components/Footer/Footer'
import "./account.css"
import AccountComponent from './AccountComponent'
import DashboardComponent from './DashboardComponent'
import Map from './Map'
import axios from 'axios'
import { appState } from '../../states/appState'
import { useRecoilState } from 'recoil'
import { Link } from 'react-router-dom'
const Account = () => {
  const [getAppState, setAppState] = useRecoilState(appState)
  const [sidebarToggle, setSidebarToggle] = useState(false)
  useEffect(() => {
    if (window.innerWidth > 767) {
      setSidebarToggle(true)
    }
  }, [])
  return (
    <div className='account_page'>
      <div >
        <Header content="none" />
        <div className='container pt_90'>
          <div className="d-flex align-items-start account_db ">
            {
              !sidebarToggle ?
                <div className='acc_sidebar_toggle p-0' onClick={e => setSidebarToggle(!sidebarToggle)}>
                  <i className="las la-bars"></i>
                </div> : ''
            }
            <div style={{ display: sidebarToggle ? "block" : "none" }} className="nav flex-column nav-pills me-3 account_sidebar scrollbar-hidden" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              {
                sidebarToggle ?
                  <div className='acc_sidebar_toggle_hide' onClick={e => setSidebarToggle(!sidebarToggle)}>
                    <i className="las la-times"></i>
                  </div> : ''
              }
              <div className='p-4  account_sidebar_top' >
                <div className='profile_box' >
                  <div className='profile_circle'></div>
                  <div className='profile_image'>
                    <img src='/assets/1.png' />
                  </div>
                </div>
                <h2  > {getAppState.user?.name} </h2>
              </div>
              <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Account</button>
              {
                getAppState.user.userType == "admin" ?
                  <>
                    <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Dashboard</button>
                    <button className="nav-link" id="v-pills-map-tab" data-bs-toggle="pill" data-bs-target="#v-pills-map" type="button" role="tab" aria-controls="v-pills-map" aria-selected="false">Map</button>
                  </> : ''
              }
              <div className='sidebar_play_btn text-center mt-5'>
                <Link to="/home">
                  <button className='btn y_btn yellow_btn mb-4'   >Play</button>
                </Link>
              </div>
            </div>
            {/* Sidebar Content */}
            <div className="tab-content account_sidebar_tab" id="v-pills-tabContent">
              <div className=''>
                <div className="tab-pane toggle_tab fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                  <AccountComponent user={getAppState.user} />
                </div>
                <div className="tab-pane toggle_tab fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                  <DashboardComponent />
                </div>
                <div className="tab-pane toggle_tab fade" id="v-pills-map" role="tabpanel" aria-labelledby="v-pills-map-tab">
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  )
}

export default Account