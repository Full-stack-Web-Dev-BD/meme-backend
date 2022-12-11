import getVideoId from 'get-video-id';
import React, { useEffect, useState } from 'react'
import "./dashboardMainContent.css"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { baseURL, randomNum, utilActiveDB, utilSelectedInput } from '../../../utils/constant';
import ProfileBox from '../../Components/ProfileBox/ProfileBox';
import Countdown, { } from 'react-countdown'
import { toast } from 'react-toastify';
import CreateRoundModal from './CreateRoundModal';
import moment, { } from 'moment'
import axios, { } from 'axios'
import { appState } from '../../../states/appState';
import jwtDecode, { } from 'jwt-decode'
import { useRecoilState } from 'recoil';
import queryString from 'query-string'
import VoteModal from './VoteModal';
const DashboardMainContent = ({ state }) => {
  const slideTime = 10
  const [getAppState, setAppState] = useRecoilState(appState)
  const [selectHistory, setSelectHistory] = useState({
    images: [],
    img: '',
    gif: "",
    color: '',
    video: ''
  })
  const [activeRound, setActiveRound] = useState({})
  const [allFiles, setAllFiles] = useState([])
  const [allRound, setAllRound] = useState([])
  const [file, setFile] = useState({})
  const [memeUploaded, setMemeUploaded] = useState()
  const [activeDB, setActiveDB] = useState(utilActiveDB.waiting)
  const [tokenUser, setTokenUser] = useState({})
  const [myRoom, setMyRoom] = useState({})
  const [selectedGrid, setSelectedGrid] = useState()
  const [selectedInput, setSelectedInput] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [activeMeme, setActiveMEME] = useState({})

  useEffect(() => {
    var tokenuser = jwtDecode(window.localStorage.getItem("meme_token"))
    setTokenUser(tokenuser)
    getActiveRound()
    getAllRound()
    getMyRoom()
    isRoundExpired()
    getAllFiles()
  }, [])
  const getAllFiles = () => {
    axios.get(`${baseURL}/files`)
      .then(resp => {
        setAllFiles(resp.data)
      })
  }
  const getActiveRound = () => {
    var tokenuser = jwtDecode(window.localStorage.getItem("meme_token"))
    var params = queryString.parse(window.location.href)
    axios.get(`${baseURL}/api/room/${params.room}`)
      .then(res => {
        if (res.data?.owner == tokenuser._id) { //owner test
          axios.get(`${baseURL}/api/round/active-round/${tokenuser._id}`)
            .then(resp => {
              setActiveRound(resp.data)
              if (resp.data.status) {
                setActiveDB(utilActiveDB.roundStarted)
                var diff = getDiff(resp.data)
                setTimeout(() => {
                  axios.get(`${baseURL}/api/round/${resp.data.round._id}`)
                    .then(res => {
                      var currentMEME = 0
                      setActiveDB(utilActiveDB.voting)
                      var memeInterval = setInterval(() => {
                        if (res.data.perticipants[currentMEME]) {
                          setActiveMEME(res.data.perticipants[currentMEME])
                          setActiveDB(utilActiveDB.showMEME)
                          currentMEME += 1;
                        } else {
                          console.log("cleare interval")
                          clearInterval(memeInterval)
                          axios.get(`${baseURL}/api/round/${resp.data.round._id}`)
                            .then(rs => {
                              var perticipants = rs.data.perticipants
                              var winner = perticipants[0]
                              for (var i = 0; i < perticipants.length; i++) {
                                var winnerTotalEggs = winner.vote.paidEsterEggsCount + winner.vote.paidRottenEggsCount
                                var thisTotalEggs = perticipants[i].vote.paidEsterEggsCount + perticipants[i].vote.paidRottenEggsCount
                                if (thisTotalEggs > winnerTotalEggs) {
                                  winner = perticipants[i]
                                }
                              }
                              console.log("Winner is ", winner)
                              axios.post(`${baseURL}/api/round/winner/${resp.data.round._id}`, { winner: winner })
                                .then(r => {
                                  toast.success("Winner Detected !!")
                                  setActiveMEME(winner)
                                  setActiveDB(utilActiveDB.winner_result)
                                })
                            })
                          // Detect Winner Now 
                        }
                      }, slideTime * 1000);
                    })
                    .catch(err => { console.log(err) })
                }, diff);
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          axios.get(`${baseURL}/api/round/active-round/${res.data?.owner}`)
            .then(resp => {
              setActiveRound(resp.data)
              if (resp.data.status) {
                setActiveDB(utilActiveDB.roundStarted)
                var diff = getDiff(resp.data)
                setTimeout(() => {
                  axios.get(`${baseURL}/api/round/${resp.data.round._id}`)
                    .then(res => {
                      var currentMEME = 0
                      var memeInterval = setInterval(() => {
                        if (res.data.perticipants[currentMEME]) {
                          setActiveMEME(res.data.perticipants[currentMEME])
                          setActiveDB(utilActiveDB.showMEME)
                          currentMEME += 1;
                        } else {
                          clearInterval(memeInterval)
                          axios.get(`${baseURL}/api/round/${resp.data.round._id}`)
                            .then(rs => {
                              var perticipants = rs.data.perticipants
                              var winner = perticipants[0]
                              for (var i = 0; i < perticipants.length; i++) {
                                var winnerTotalEggs = winner.vote.paidEsterEggsCount + winner.vote.paidRottenEggsCount
                                var thisTotalEggs = perticipants[i].vote.paidEsterEggsCount + perticipants[i].vote.paidRottenEggsCount
                                if (thisTotalEggs > winnerTotalEggs) {
                                  winner = perticipants[i]
                                }
                              }
                              axios.post(`${baseURL}/api/round/winner/${resp.data.round._id}`, { winner: winner })
                                .then(r => {
                                  toast.success("Winner Detected !!")
                                  setActiveMEME(winner)
                                  setActiveDB(utilActiveDB.winner_result)
                                })
                            })
                          // Detect Winner Now 
                        }
                      }, slideTime * 1000);
                    })
                    .catch(err => { console.log(err) })
                }, diff);
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getAllRound = () => {
    if (isRoomOwner()) {
      axios.get(`${baseURL}/api/round/all/${getAppState.user._id}`)
        .then(resp => {
          setAllRound(resp.data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      axios.get(`${baseURL}/api/round/all/${myRoom.owner}`)
        .then(resp => {
          setAllRound(resp.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const getMyRoom = () => {
    var params = queryString.parse(window.location.href)
    axios.get(`${baseURL}/api/room/${params.room}`)
      .then(res => {
        if (!res.data.date) {
          return getMyRoom()
        }
        setMyRoom(res.data)
      })
      .catch(err => {
        console.log(err)
      })

  }
  const Completionist = () => <span>Time Up</span>;
  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>{minutes}:{seconds}</span>;
    }
  };
  // layout Image
  const addImage = (img) => {
    if (activeDB == utilActiveDB.v_single) {
      console.log(selectHistory)
      if (selectHistory.images.length < 2) {
        setSelectHistory({ ...selectHistory, images: [...selectHistory.images, img] })
      } else {
        toast.error("You can Select Up to 2 Image  For this Layout")
      }
    }
  }
  const roundCreateFN = (time) => {
    var obj = {
      id: getAppState.user._id,
      time: time
    }
    axios.post(`${baseURL}/api/round`, obj)
      .then(resp => {
        console.log(resp)
        toast.success("Round created ")
        state.socketIO.emit("roundPush", { room: myRoom.roomName, })
        getActiveRound()
        getAllRound()
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getDiff = (acRound) => {
    var diffMS = moment(acRound.round?.expTime).diff(new Date(), 'milliseconds') // 0
    if (diffMS < 0) {
      return 0
    } else {
      return diffMS
    }
  }
  const isRoomOwner = () => {
    return myRoom.owner == tokenUser._id
  }
  const isRoundExpired = () => {
    if (!activeRound.status) {
      return false
    }
    if (0 < getDiff(activeRound)) {
      return true
    } else {
      return false
    }
  }
  const memeUpload = () => {
    if (!activeRound.status) return toast.error("No active Round")
    if (!isRoundExpired()) return toast.error("Round  Expired ")
    if (file.size) {
      var formdata = new FormData()
      console.log(activeRound)
      formdata.append("file", file)
      formdata.append("userID", tokenUser._id)
      formdata.append("roundID", activeRound.round._id)
      formdata.append("user", JSON.stringify(tokenUser))
      axios.post(`${baseURL}/api/round/upload`, formdata)
        .then(resp => {
          if (resp.data?.status) {
            setMemeUploaded(resp.data.file)
            toast.success(resp.data.message)
          } else {
            toast.error(resp.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      var obj = {
        fileName: file.name,
        userID: tokenUser._id,
        roundID: activeRound.round._id,
        user: JSON.stringify(tokenUser)
      }
      axios.post(`${baseURL}/api/round/upload`, obj)
        .then(resp => {
          if (resp.data?.status) {
            setMemeUploaded(resp.data.file)
            toast.success(resp.data.message)
          } else {
            toast.error(resp.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const doVote = (obj) => {
    obj.userID = tokenUser._id
    obj.id = activeRound.round._id

    axios.post(`${baseURL}/api/round/vote`, obj)
      .then(resp => {
        console.log(resp)
        if (resp.data.status) {
          toast.success(resp.data.message)
        } else {
          Object.keys(resp.data.error).map(el => {
            toast.error(resp.data.error[el])
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  const detectFileType = (str) => {
    var fileName = str.split(".")
    if (fileName[1] == "png" || fileName[1] == "jpg" || fileName[1] == "jpeg") {
      return "png"
    }
    if (fileName[1] == "mp4") {
      return "mp4"
    }
    if (fileName[1] == "gif") {
      return "gif"
    }
  }

  return (
    <div className='dashboard_main_content_inner' >
      {
        activeRound.status ?
          <div className='round_time'>
            <div className='flex_content_between'>
              <span>ROUND - {allRound.length} </span>
              <span>
                <Countdown date={Date.now() + getDiff(activeRound)} renderer={renderer} />
              </span>
            </div>
            <div className='mt-2'>
              <button className='btn btn_fullwidth_outlined ' style={{ textTransform: 'capitalize' }}> {state.topic} </button>
            </div>
          </div> :
          <div className='round_time'>
            <div className='flex_content_between'>
              <span>
                Round
              </span>
              <span>
                {
                  isRoomOwner() ?
                    <CreateRoundModal roundCreateFN={roundCreateFN} roundNumber={allRound.length + 1} />
                    :
                    <div>
                      {
                        activeRound.status ?
                          <Countdown date={Date.now() + getDiff(activeRound)} renderer={renderer} /> :
                          <span> Waiting  for New Round </span>
                      }
                    </div>
                }
              </span>
            </div>
            <div className='mt-2'>
              <button className='btn btn_fullwidth_outlined ' style={{ textTransform: 'capitalize' }}>  {state.topic} </button>
            </div>
          </div>
      }
      <div className='db_playing_box_top'>
        <div className='db_dynamic_content'>
          {
            activeDB == utilActiveDB.image ?
              <div className='selected_img'>
                <div className='selected_img_x'>
                  {/* <span>X</span> */}
                </div>
                <div className='selected_img_img'>
                  {
                    file.size ?
                      <div className='s_img_box'>
                        {
                          memeUploaded ?
                            <>
                              {
                                detectFileType(memeUploaded) == "gif" || detectFileType(memeUploaded) == "png" ?
                                  <img style={{ width: '241px' }} src={`${baseURL}/${memeUploaded}`} /> : ''
                              }

                              {
                                detectFileType(memeUploaded) == "mp4" ?
                                  <video style={{ width: '240px' }} src={`${baseURL}/${memeUploaded}`} /> : ''
                              }
                            </> :
                            <p className='text_yellow' >{file.name} </p>
                        }
                      </div> :
                      <div className='s_img_box'>
                        {
                          detectFileType(file.name) == "gif" || detectFileType(file.name) == "png" ?
                            <img style={{ width: '120px' }} src={`${baseURL}/${file.name}`} /> : ''
                        }
                        {
                          detectFileType(file.name) == "mp4" ?
                            <video style={{ width: '240px' }} controls src={`${baseURL}/${file.name}`} /> : ''
                        }
                      </div>
                  }
                  <div className=' text-center'>
                    <button className='btn yellow_btn' onClick={e => memeUpload()} >Upload MEME</button>
                  </div>
                </div>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.waiting ?
              <div className='db_waiting mt-4' >
                <h2>WAITING FOR PLAYERS & ROUND</h2>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.roundStarted ?
              <div className='db_waiting' >
                <h2>Round Started (<Countdown date={Date.now() + getDiff(activeRound)} renderer={renderer} />) </h2>
                <div className='text-center'>
                  <butotn className="btn text_black yellow_btn c_pointer" onClick={e => { setSelectedInput(utilSelectedInput.img) }} >Upload Your MEME ! </butotn>
                </div>
              </div> : ''
          }

          {
            activeDB == utilActiveDB.showMEME ?
              <div>
                <div>
                  <ProfileBox name={activeMeme.user?.name} />
                </div>
                <div className='meme_wrapper'>
                  {
                    detectFileType(activeMeme.meme) == "png" || detectFileType(activeMeme.meme) == "gif" ?
                      <img style={{ width: '250px' }} src={`${baseURL}/${activeMeme.meme}`} /> : ''
                  }
                  {
                    detectFileType(activeMeme.meme) == "mp4" ?
                      <video style={{ width: "200px" }} src={`${baseURL}/${activeMeme.meme}`} />
                      : ''
                  }
                  {
                    activeMeme.roundID ?
                      <div>
                        <VoteModal activeMeme={activeMeme} doVote={doVote} />
                      </div> : ''
                  }
                </div>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.topic ?
              <div className='db_waiting' >
                <h1>THE TOPIC IS </h1>
                <h2 className='text-center' style={{ textTransform: 'capitalize' }}>{state.topic}</h2>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.voting ?
              <div>
                <h5 className='text-center mt-4'> Be ready to vote your  favorite MEME , It will Start soonn !! </h5>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.player ?
              <div>
                <div>
                  <ProfileBox />
                </div>
                <div className='meme_wrapper'>
                  <div className='meme_box'>
                    <span>MEME</span>
                  </div>
                </div>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.color ?
              <div className='text-center mt-4'>
                <div className='c_p' style={{ width: '200px', height: '200px', display: 'inline-block', marginTop: '20px', color: 'white', background: selectHistory.color }}>
                  <span style={{ lineHeight: '200px' }}>Color Selected</span>
                </div>
              </div>
              : ''
          }
          {
            activeDB == utilActiveDB.v_single ?
              <div className='selected_l mt-5 ml-5'>
                <div className='selected_l_x'>
                  <span style={{
                    color: "black",
                    fontSize: "34px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}>X</span>
                </div>
                <div className='selected_layout'>
                  {
                    selectHistory.images[0] ?
                      <div >
                        <img src={selectHistory.images[0]} />
                      </div> :
                      <div className='c_p' onClick={e => { setSelectedInput(utilSelectedInput.img) }} style={{ background: selectedGrid == "v_1" ? "#f9af12" : "black" }}>
                        <span>Select Image</span>
                      </div>
                  }     {
                    selectHistory.images[1] ?
                      <div >
                        <img src={selectHistory.images[1]} />
                      </div> :
                      <div className='c_p' onClick={e => { setSelectedInput(utilSelectedInput.img) }} style={{ background: selectedGrid == "v_1" ? "#f9af12" : "black" }}>
                        <span>Select Image</span>
                      </div>
                  }
                </div>
              </div> : ''
          }
          {
            activeDB == utilActiveDB.winner_result ?
              <div className=' winner_r text-center'>
                <div className='text-center'>
                  <ProfileBox smName={true} name={`${activeMeme.user.name} (Round Winner) `} />
                  {/* <img style={{ width: '200px' }} src={`${baseURL}/${activeMeme.meme}`} /> */}
                  {
                    detectFileType(activeMeme.meme) == "png" || detectFileType(activeMeme.meme) == "gif" ?
                      <img style={{ marginTop: '5px', width: '251px' }} src={`${baseURL}/${activeMeme.meme}`} /> : ''
                  }
                  {
                    detectFileType(activeMeme.meme) == "mp4" ?
                      <video controls style={{ width: "202px", marginTop: '5px' }} src={`${baseURL}/${activeMeme.meme}`} />
                      : ''
                  }
                </div>
                <br />
                <button onClick={e => window.location.reload()} className='btn yellow_btn mt-1'>Next Game</button>
              </div> : ''
          }
        </div>
      </div>

      {/* bottom side */}
      <div className='db_playing_box_bottom'>
        <div className='pb_icons d-flex'>
          <div className='pb_icon_box mr-3'>
            <img src='/assets/eraser.svg' />
          </div>
          <div className='pb_icon_box'>
            <img src='/assets/text.svg' />
          </div>
        </div>
        <div className='playing_tool_box mt-4'>
          <div className='tool_box_inner'>
            <div className='playing_tools mr-5'>
              <div className='playing_tool d-flex '>
                <div className={`pl_icon_box ${selectedInput == utilSelectedInput.img ? 'active_pl_icon_box' : ''}`} onClick={e => setSelectedInput(utilSelectedInput.img)} >
                  <img src='/assets/image.svg' />
                </div>
                <div className={`pl_icon_box ${selectedInput == utilSelectedInput.gif ? 'active_pl_icon_box' : ''}`} onClick={e => setSelectedInput(utilSelectedInput.gif)}>
                  <img src='/assets/gif.svg' />
                </div>
                <div className={`pl_icon_box ${selectedInput == utilSelectedInput.video ? 'active_pl_icon_box' : ''}`} onClick={e => setSelectedInput(utilSelectedInput.video)}>
                  <img src='/assets/video.svg' />
                </div>
                {/* <div className={`pl_icon_box ${selectedInput == utilSelectedInput.layout ? 'active_pl_icon_box' : ''}`} onClick={e => setSelectedInput(utilSelectedInput.layout)}>
                  <img src='/assets/layout.svg' />
                </div>
                <div className={`pl_icon_box ${selectedInput == utilSelectedInput.color ? 'active_pl_icon_box' : ''}`} onClick={e => setSelectedInput(utilSelectedInput.color)}>
                  <img src='/assets/pencil.svg' />
                </div> */}
                {/* <div className={`pl_icon_box`}>
                  <img src='/assets/y_ok.png' style={{ borderRadius: '8px' }} />
                </div> */}
              </div>
            </div>
            <div className='playing_input '>
              {
                activeDB == "round_winner" ?
                  <div className='_overlay'></div> : ''
              }
              <div className='input_show' style={{
                height: selectedInput == utilSelectedInput.player ? "inherit" : "150px"
              }}>
                <div className='input_components pt-2'>
                  {
                    selectedInput == utilSelectedInput.img ?
                      <div>
                        <div className='input_img_container'>
                          <div className='sr-only' >
                            <input onChange={e => { setFile(e.target.files[0]); setActiveDB(utilActiveDB.image); }} type={'file'} accept="image/x-png,image/jpeg" id="image_selector" />
                          </div>
                          <div title='Select Image' onClick={e => document.getElementById("image_selector").click()} className='img_placeholder c_pointer'>
                            <img src='/assets/select_image.png' />
                          </div>
                          {
                            allFiles.map(el => (
                              <>
                                {
                                  detectFileType(el) == "png" ?
                                    <div onClick={e => { setFile({ name: el }); setActiveDB(utilActiveDB.image) }} key={el} className='img_placeholder c_pointer'>
                                      <img src={`${baseURL}/${el}`} />
                                    </div> : ''
                                }
                              </>
                            ))
                          }
                        </div>
                      </div> : ''
                  }

                  {
                    selectedInput == utilSelectedInput.gif ?
                      <div>
                        <div className='input_img_container'>
                          <div className='sr-only' >
                            <input type={'file'} onChange={e => { setFile(e.target.files[0]); setActiveDB(utilActiveDB.image) }} accept="image/gif," id="select_gif" />
                          </div>
                          <div title='Select Image' onClick={e => document.getElementById("select_gif").click()} className='img_placeholder c_pointer'>
                            <img src='/assets/select_image.png' />
                          </div>
                          {
                            allFiles.map(el => (
                              <>
                                {
                                  detectFileType(el) == "gif" ?
                                    <div onClick={e => { setFile({ name: el }); setActiveDB(utilActiveDB.image) }} key={el} className='c_p img_placeholder'>
                                      <img src={`${baseURL}/${el}`} />
                                    </div> : ''
                                }
                              </>
                            ))
                          }
                        </div>
                      </div> : ''
                  }
                  {
                    selectedInput == utilSelectedInput.video ?
                      <div>
                        <div className='input_img_container'>
                          <div className='sr-only' >
                            <input type={'file'} onChange={e => { setFile(e.target.files[0]); setActiveDB(utilActiveDB.image) }} accept="video/mp4" id="select_video" />
                          </div>
                          <div title='Select Image' onClick={e => document.getElementById("select_video").click()} className='img_placeholder c_pointer'>
                            <img src='/assets/select_image.png' />
                          </div>
                          {
                            allFiles.map(el => (
                              <>
                                {
                                  detectFileType(el) == "mp4" ?
                                    <div onClick={e => { setFile({ name: el }); setActiveDB(utilActiveDB.image) }} key={el} className=' c_p img_placeholder' >
                                      <div className='text-center'>
                                        <img src={`/assets/video.svg`} />
                                      </div>
                                    </div> : ''
                                }
                              </>
                            ))
                          }
                        </div>
                      </div> : ''
                  }
                  {
                    selectedInput == utilSelectedInput.color ?
                      <div>
                        <div className='placeholder_container'>
                          {
                            ["colors"].map((el, i) => (
                              <div key={el} className='c_p color_placeholder  ' onClick={e => { setSelectedColor(`img${i}`); setSelectHistory({ ...selectHistory, color: el }); setActiveDB(utilActiveDB.color) }} style={{ background: el }}>
                                <div className='img' style={{
                                  display: selectedColor == `img${i}` ? 'block' : 'none'
                                }} >
                                  <img src='/assets/ok.svg' />
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div> : ''
                  }
                  {/* layout */}
                  {
                    selectedInput == utilSelectedInput.layout ?
                      <div className='input_grid'>
                        <div className='v_grid c_p' onClick={e => setActiveDB(utilActiveDB.v_single)}>
                          <div style={{ background: activeDB == "v_single" ? "#f9af12" : 'black' }} className='v_single' >
                            <span>1</span>
                          </div>
                          <div style={{ background: activeDB == "v_single" ? "#f9af12" : 'black' }} className='v_single' >
                            <span>2</span>
                          </div>
                        </div>
                        <div className='h_grid c_p'>
                          <div style={{ background: activeDB == "h_single" ? "#f9af12" : 'black' }} className='h_single ' >
                            <span>1</span>
                          </div>
                          <div style={{ background: activeDB == "h_single" ? "#f9af12" : 'black' }} className='h_single  ' >
                            <span>2</span>
                          </div>
                        </div>
                        <div className='h_3_grid c_p'>
                          <div style={{ background: activeDB == "h_single_3bar" ? "#f9af12" : 'black' }} className='h_single ' >
                            <span>1</span>
                          </div>
                          <div style={{ background: activeDB == "h_single_3bar" ? "#f9af12" : 'black' }} className='h_single ' >
                            <span>2</span>
                          </div>
                          <div style={{ background: activeDB == "h_single_3bar" ? "#f9af12" : 'black' }} className='h_single ' >
                            <span>3</span>
                          </div>
                        </div>
                      </div> : ''
                  }
                  {
                    selectedInput == utilSelectedInput.player ?
                      <div className='through_eggs'>
                        <div className='_eggs'>
                          <div className='t_egg_1'>
                            <img src='/assets/RottenEgg.png' />
                          </div>
                          <div className='t_egg_2'>
                            <img src='/assets/EasterEgg.png' />
                            <span>5s</span>
                          </div>
                        </div>
                        <h3>Through your eggs</h3>
                      </div> : ''
                  }
                </div>
              </div>
              {
                selectedInput != utilSelectedInput.player ?
                  <div className='p_search_bar'>
                    <div>
                      <div className='p_upload'>
                        <img src='/assets/upload.svg' />
                      </div>
                    </div>
                    <div className='input_grup'>
                      <span className='ps_icon'>
                        <SearchOutlinedIcon />
                      </span>
                      <input className='form-control' />
                    </div>
                  </div> : ''
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMainContent