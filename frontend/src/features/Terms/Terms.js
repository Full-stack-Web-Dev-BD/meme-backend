import React from 'react'
import Header from "../Components/Header/PageHeader"
import Footer from "../Components/Footer/Footer"
import "./terms.css"
const Terms = () => {
  return (
    <div className='terms_page'>
      <Header />
      <div className=' container pb-5'>
        <div className="text-center pt_45">
          <img style={{ width: '400px' }} src="/assets/memechallengeYellow.png" />
        </div>
        <div className='terms_card'>
          <div className='terms_card_inner'>
            <div className='terms_content'>
              <h2 className='text-center'> TERMS OF SERVICE / <br/> PRIVACY</h2>
              <div className='mt-2 mb-5'>
                <p> a) Rules in and with memechallenge.me</p>
                <p> 1. No porn, no naked, no sexual content </p>
                <p> 2. Never use children to infringe the law</p>
              </div>
              <div >
                <p> 1. With memes </p>
                <p> 2. With login </p>
                <p> 3. With comments </p>
                <p> 4. Don't no break the law in any way</p>
              </div>
              <div className='mt-5 '>
                <p> 3. No bullying racism, gender, ostracism, from nowhere or from anywhere </p>
                <p> 4. without confidential information about nobody,</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Terms