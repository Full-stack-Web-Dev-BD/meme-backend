import React, { Component, useEffect } from 'react'
import DashboardChat from './DashboardChat/DashboardChat'
import DashboardMainContent from './DashboardMainContent/DashboardMainContent'
import DashboardSidebar from './DashboardSidebar/DashboardSidebar'
import queryString from 'query-string';
import socketIOClient from 'socket.io-client'
import "./dashboard.css"
import { baseURL } from '../../utils/constant';
import axios from 'axios'
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
var socket
export class Dashboard extends Component {
  state = {
    users: [],
    chatHistory: [],
    name: '',
    error: '',
    room: '',
    userID: '',
    roomDetails: {},
    topic: '',
    socketIO: ''
  }
  async componentDidMount() {
    console.log(new Date().getSeconds())
    var user = jwtDecode(window.localStorage.getItem("meme_token"))
    const { name, room, topic } = queryString.parse(window.location.search);
    if (!name || !room) return window.location.href = '/'
    this.setState({ ...this.state, name: name, room: room, topic: topic })

    var dbChatHistory = await axios.get(`${baseURL}/api/chat/${room}`)
    await this.setState({ ...this.state, chatHistory: [...dbChatHistory.data] })

    socket = socketIOClient(baseURL, { transports: ['websocket', 'polling', 'flashsocket'] })
    this.setState({ ...this.state, socketIO: socket })
    console.log("user is ", user)
    socket.emit('join', { name, room, topic, owner: user._id, pp: user.pp }, async (error) => {
      if (error) {
        this.setState({ ...this.state, error: error });
      }
    });
    socket.on("message", async (data) => {
      if (!this.state.userID) {
        this.setState({ ...this.state, uid: data.sms.uid, chatHistory: [...this.state.chatHistory, { sms: data.sms }] })
        this.getRoom()
      } else {
        this.setState({ ...this.state, chatHistory: [...this.state.chatHistory, { sms: data.sms }] })
        this.getRoom()
      }
    })
    socket.on('roomUpdate', data => {
      this.setState({ ...this.state, roomDetails: data.room })
    })
    socket.on("roundPushBack", data => {
      toast.success("A new Round Created , Refrashing Page to get Update !!")
      setTimeout(() => {
        window.location.reload()
      }, 1500);
    })
  }
  getRoom = () => {
    axios.post(`${baseURL}/api/room/find`, { roomName: this.state.room })
      .then(resp => {
        this.setState({ ...this.state, roomDetails: resp.data })
      })
      .catch(err => {
      })
  }
  sendSms = (sms) => {
    socket.emit('sendMessage', { message: sms })
  }
  render() {
    return (
      <div className='dashboard_container '>
        {/* <button onClick={e => console.log(this.state)}>  log </button> */}
        <div className='dashboard_sidebar'>
          <DashboardSidebar state={this.state} />
        </div>
        <div className='dashboard_main_content'>
          <DashboardMainContent state={this.state} socket={socket} />
        </div>
        <div className='dashboard_chat'>
          <DashboardChat sendSMS={this.sendSms} state={this.state} />
        </div>
      </div>
    )
  }
}

export default Dashboard