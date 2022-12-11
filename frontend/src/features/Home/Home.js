import React, { useEffect, useState } from 'react'
import Footer from '../Components/Footer/Footer'
import Header from '../Components/Header/PageHeader'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import "./home.css"
import axios from 'axios';
import { baseURL } from '../../utils/constant';
import { toast } from 'react-toastify'
import queryString from 'query-string'
import { appState } from '../../states/appState';
import { useRecoilState } from 'recoil';

const Home = () => {
  const [getAppState, setAppState] = useRecoilState(appState)
  const [room, setRoom] = useState()
  const [availableRoom, setAvailableRoom] = useState([])
  const [searchText, setSearchText] = useState('')
  const [topic, setTopic] = useState()

  useEffect(() => {
    axios.get(`${baseURL}/api/room`)
      .then(resp => {
        setAvailableRoom(resp.data)
      })
  }, [])

  const enterRoom = (room) => {
    if (!getAppState.loaded) return toast.error("Page Loading")
    window.location.href = `/dashboard?name=${getAppState.user.name}&room=${room.roomName}&topic=${room.topic}`
  }
  const submitHandler = (e) => {
    e.preventDefault()
    if (!getAppState.loaded) return toast.error("Page Still Loading")
    axios.get(`${baseURL}/api/room/${room}`)
      .then(resp => {
        console.log(resp)
        if (Object.keys(resp.data).length == 0) {
          window.location.href = `/dashboard?name=${getAppState.user.name}&room=${room}&topic=${topic}`
        } else {
          toast.error("Room existing ")
        }
      })
  }
  const search = (e) => {
    e.preventDefault()
    if (!searchText) return toast.error("Please Enter a Valid Name")
    axios.get(`${baseURL}/api/room/${searchText}`)
      .then(resp => {
        console.log(resp)
        if (resp.data.roomName) {
          setAvailableRoom([resp.data])
        } else {
          toast.error(`Room ${searchText}  Not Finded !! `)
        }
      })
  }
  const checkRoom = () => { }
  return (
    <div className='home_page'>
      <Header content="loginRegister" />
      <div className='home_content'>
        <div className='meme_challange'>
          <div className='meme_challange_content'>
            <img src="/assets/memechallengeYellow.png" />
          </div>
        </div>
        <div className='container mt-5'>
          <div className='row'>
            <div className='col-lg-10  col-md-12 offset-lg-1'>
              <div className='row mb-5 landscape_pb_100'>
                <div className='col-lg-5 col-md-6 mb-sm-4 mb-xs-4 mb_xs_4  '>
                  <div className='home_card_left'>
                    <div className='home_profile_box' >
                      <div className='home_profile_circle'></div>
                      <div className='home_profile_image'>
                        <img src={`/assets/${getAppState.user.pp}.png`} />
                      </div>
                    </div>
                    <form onSubmit={e => submitHandler(e)} className='home_card_form'>
                      <div className='mt-2'>
                        <label htmlFor='room_code' >Topic</label>
                        <br />
                        <div className='home_input_copy_group'>
                          <input required name='topic' onChange={e => setTopic(e.target.value)} style={{ paddingRight: '40px' }} value={topic} className='form-control pl_white' id='room_code' placeholder='Topic' />
                        </div>
                      </div> <div className='mt-2'>
                        <label htmlFor='room_code' >Room Code or Name</label>
                        <br />
                        <div className='home_input_copy_group'>
                          <input required name='room' onChange={e => setRoom(e.target.value)} style={{ paddingRight: '40px' }} value={room} className='form-control pl_white' id='room_code' placeholder='Room Name' />
                        </div>
                      </div>
                      <div className='mt-4 text-center'>
                        <button onClick={e => checkRoom()} type='submit' className='btn home_btn_play'> Create & PLAY </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='col-lg-2 d-lg-block d-md-none'></div>
                <div className='col-lg-5 col-md-6'>
                  <div className='home_card_right'>
                    <div className='home_list_title' >
                      <h3>People Playing</h3>
                      <div className='home_search_box'>
                        <form onSubmit={e => search(e)} >
                          <input className='form-control pl_white' onChange={e => setSearchText(e.target.value)} placeholder='Search Room' />
                        </form>
                        <div className='search_icon'>
                          <span >
                            <SearchOutlinedIcon style={{ color: 'white', fontSize: '26px' }} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='home_list hide_sc mt-3'>
                      {
                        availableRoom.map((el, i) => (
                          <div key={i} className='list_item'>
                            <div className='streamer_photo'>
                              <img src='/assets/1.png' />
                            </div>
                            <div className='streamer_name'>
                              <p> {el.roomName} </p>
                            </div>
                            <div className='enter_room'>
                              <button className='btn enter_room_btn' onClick={e => enterRoom(el)} >ENTER ROOM</button>
                            </div>
                          </div>
                        ))
                      }   {
                        availableRoom.length < 1 ?
                          <div >
                            <h4 style={{ margin: '100px 0 ' }} className='text-center mt-5 mb-5'>No Room Available</h4>
                          </div>
                          :
                          <div className='home_pagination text-center'>
                            {/* <p><span style={{ fontSize: '12px' }}>Next page</span> <ArrowForwardIosOutlinedIcon style={{ color: 'white', fontSize: '25px' }} />  </p> */}
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home