import React, { useEffect, useState } from 'react'
import Footer from "../Components/Footer/Footer"
import "./topic.css"
import CommonHeader from '../Components/Header/PageHeader'
import axios from 'axios'
import { baseURL } from '../../utils/constant'
import { toast } from 'react-toastify'
import queryString from 'query-string'

const Topic = () => {
  const [topicName, setTopicName] = useState('')
  const [topics, setTopics] = useState([])
  useEffect(() => {
    axios.get(`${baseURL}/api/topic`)
      .then(resp => {
        setTopics(resp.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const createTopic = (e) => {
    e.preventDefault()
    if (!topicName) return toast.error("Topic Name Required to Continuew")
    axios.post(`${baseURL}/api/topic`, { topicName: topicName })
      .then(resp => {
        toast.success("Topic Created Success !! Redirecting to Game Mode with this Topic!!")
        setTimeout(() => {
          const { name, room } = queryString.parse(window.location.search);
          if (name && room) {
            window.location.href = `/dashboard?name=${name}&room=${room}$topic=${topicName}`
          } else {
            window.location.href = `/?topic=${topicName}`
          }
        }, 1300);
      })
  }
  return (
    <div className='topic_page'>
      <CommonHeader />
      <div className=' container'>
        <div className='col-lg-8 offset-md-2'>
          <div className="text-center">
            <img style={{ width: '400px', position: 'relative', zIndex: '9999' }} src="/assets/memechallengeYellow.png" />
          </div>
          <div className='topic_card'>
            <div className='topic_card_inner'>
              <div className='topic_content col-lg-8 offset-md-2'>
                <div className='text-center mb-4'>
                  <img src='/assets/1.png' />
                </div>
                <h2 className='text-center'> WRITE A TOPIC CHALLANGE</h2>
                <div>
                  <form onSubmit={e => createTopic(e)}>
                    <input name="topic" onChange={e => setTopicName(e.target.value)} placeholder='Enter a Topic to Contine' className='form-control' />
                  </form>
                </div>
                <div className='mt-4 flex_content_between'>
                  <button className='btn yellow_btn' onClick={e => createTopic(e)} >Start</button>
                  {
                    topics.length > 0 ?
                      <button className='btn yellow_btn'>Random</button>
                      : ""
                  }
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

export default Topic