import React, { useEffect, useState } from 'react'
import "./dashboardChat.css"
import SendIcon from '@mui/icons-material/Send';
import { appState } from '../../../states/appState';
import { useRecoilState } from 'recoil';
import BuyModal from './BuyModal';
import { logout } from '../../../utils/constant';

const DashboardChat = ({ state, sendSMS }) => {
  const [getAppState, setAppState] = useRecoilState(appState)
  const [Sms, setSms] = useState()
  const handleMessage = (e) => {
    e.preventDefault()
    sendSMS(Sms);
    setSms('')
  }
  const [accountDialog, setAccountDialog] = useState(false)
  // useEffect(() => {
  //   window.onbeforeunload = function (event) {
  //     return window.confirm("Confirm refresh");
  //   };
  // }, [])
  const scroll_bottom = () => {
    var db_chat_box = document.getElementById("db_chat_box")
    db_chat_box.scrollTo = db_chat_box.scrollHeight;

  }
  useEffect(() => {
    scroll_bottom()
  }, [])

  return (
    <div className='dashboard_chat_inner'>
      <div className='profile_bar'>
        <div className='d-inline '>
          <div className='acc_nav_holder'>
            <div className='account_nav d-flex' >
              {
                accountDialog ?
                  <div className='account_dialog'>
                    <div className='account_info'>
                      <p>Name : <span>{getAppState.user?.name}</span> </p>
                      <p>Email:<span>{getAppState.user?.email}</span></p>
                      <div className='row mt-3 egg_balance'>
                        <div className='col-6'>
                          <div>
                            <p>Paid</p>
                            <hr />
                            <img src='/assets/EasterEgg.png' />
                            <b> {getAppState.user.balance.paidEsterEggs} </b>
                          </div>
                          <div>
                            <img src='/assets/RottenEgg.png' />
                            <b>{getAppState.user.balance.paidRottenEggs}</b>
                          </div>
                        </div>
                        <div className='col-6'>
                          <div>
                            <p>Free</p>
                            <hr />
                            <img src='/assets/RottenEgg.png' />
                            <b>10</b>
                          </div>
                          <div>
                            <img src='/assets/EasterEgg.png' />
                            <b>10</b>
                          </div>
                        </div>                    </div>
                      <a href='/account'>
                        <button className='badge mr-3 '  >Account</button>
                      </a>
                      <button className='badge mr-3 ' onClick={e => setAccountDialog(!accountDialog)}>Close</button>
                      <button className='badge ' onClick={e => logout()} >Logout</button>
                    </div>
                  </div> : ''
              }
              <div style={{ cursor: 'pointer' }} onClick={e => setAccountDialog(!accountDialog)} className='pn_profile_box' >

                <div className='pn_profile_circle'></div>
                <div className='pn_profile_img'>
                  <img src={`/assets/${getAppState.user.pp}.png`} />
                </div>
              </div>
              <h2> {getAppState.user?.name} </h2>
              <div className='user_dropdown'>
                <ul>
                  <li>Log Out</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='dbc_holder '>
        <div id='db_chat_box' className='db_chat_box hsc'>
          <button data-toggle="tooltip" className='btn yellow_btn text_black tc'> {state.room} </button>
          <div className='chat_history'>
            {
              state.chatHistory.map((signleChat, i) => {
                return <>
                  <div key={i} className='single_chat'  >
                    <div className='chat_user'>
                      <img src={`/assets/${signleChat.user?.pp ? signleChat.user?.pp : 1}.png`} />
                      {/* {console.log(signleChat)} */}
                      <div className='chat_msg'>
                        <span className='c_user_name' > {signleChat.sms?.user}  </span>
                        <p> {signleChat.sms?.text} </p>
                      </div>
                    </div>
                  </div>
                </>
              })
            }
          </div>

          <div className='dc_egg'>
            <div className='dc_egg_layout' >
              <div className='ec_egg_container'>
                <span> {getAppState.user.balance.paidEsterEggs} </span>
                <img src='/assets/ester.png' />
                <span> {getAppState.user.balance.paidRottenEggs} </span>
                <img src='/assets/rotten.png' />
              </div>
            </div>
            <div className='dc_chat_box'>
              <div className='dc_input_grup'>
                <form onSubmit={e => handleMessage(e)}>
                  <input required value={Sms} onChange={e => setSms(e.target.value)} placeholder='Send A Message' className='form-control' />
                  <span>
                    <button style={{ all: 'unset' }} type='submit' > <SendIcon /> </button>
                  </span>
                </form>
              </div>
              <BuyModal />
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default DashboardChat