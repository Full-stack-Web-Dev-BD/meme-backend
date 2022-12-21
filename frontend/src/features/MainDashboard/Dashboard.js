import React, { Component, useEffect } from 'react'
import DashboardChat from './DashboardChat/DashboardChat'
import DashboardMainContent from './DashboardMainContent/DashboardMainContent'
import DashboardSidebar from './DashboardSidebar/DashboardSidebar'
import queryString from 'query-string';
import "./dashboard.css"
import { baseURL, socket } from '../../utils/constant';
import axios from 'axios'
import jwtDecode from 'jwt-decode';

export class Dashboard extends Component {
  state = {
    users: [],
    chatHistory: [],
    oldHistory: {},
    name: '',
    error: '',
    room: '',
    userID: '',
    roomDetails: {},
    topic: '',
    socketIO: '',
    tokenUser: {}
  }
  async componentDidMount() {
    var user = jwtDecode(window.localStorage.getItem("meme_token"))
    const { name, room, topic } = queryString.parse(window.location.search);
    if (!name || !room) return window.location.href = '/'
    var dbChatHistory = await axios.get(`${baseURL}/api/chat/${room}`)

    this.setState({ ...this.state, name: name, room: room, topic: topic, tokenUser: user, chatHistory: dbChatHistory.data })
    socket.emit('join', { name, room, topic, owner: user._id, pp: user.pp }, async (error) => {
      if (error) {
        this.setState({ ...this.state, error: error });
      }
    });
    socket.on("message", async (data) => {
      if (!this.state.userID) {
        this.setState({ ...this.state, uid: data.sms?.uid, chatHistory: [...this.state.chatHistory, { sms: data.sms, user: data.user }] })
        this.getRoom()
      } else {
        this.setState({ ...this.state, chatHistory: [...this.state.chatHistory, { sms: data.sms }] })
        this.getRoom()
      }
    })
    socket.on('roomUpdate', data => {
      this.setState({ ...this.state, roomDetails: data.room })
    })
  }
  getRoom = () => {
    axios.post(`${baseURL}/api/room/find`, { roomName: this.state.room })
      .then(resp => {
        console.log("rooom details is  ", resp.data)
        this.setState({ ...this.state, roomDetails: resp.data })
      })
      .catch(err => {
      })
  }
  sendSms = (sms) => {
    socket.emit('sendMessage', { message: sms, uid: this.state.tokenUser._id })
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