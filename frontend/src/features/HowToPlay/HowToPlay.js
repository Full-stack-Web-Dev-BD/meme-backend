import React from 'react'
import Header from "../Components/Header/PageHeader"
import Footer from "../Components/Footer/Footer"
import "./howToPlay.css"
const Terms = () => {
  return (
    <div className='terms_page'>
      <Header />
      <div className=' container'>
        <div className="text-center pt_90">
          <img style={{ width: '400px' }} src="/assets/memechallengeYellow.png" />
        </div>
        <div className='terms_card'>
          <div className='terms_card_inner'>
            <div className='terms_content'>
              <h2 className='text-center'> How To Play</h2>
              <p>Do you want to be the best meme challenger? Invite your friends, or rivals from the opposing team.</p>
              <div className='mt-5'>
                <p>The last to enter is a rotten egg: <img style={{width:'30px'}} src='/assets/rottenEgg.png' /> </p>
              </div>
              <div className='mt-5'>
                <p>a. meme creator</p>
              </div>
              <div className='ml-3'>
                <p> 1. Create your profile</p>
                <p> 2. Select your meme style</p>
                <p> 3. Submit your challenge (6 max)</p>
                <p> 4. Invite your followers</p>
                <p> 5. Select the theme or choose the theme randomly</p>
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