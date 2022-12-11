import React from 'react'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import "./footer.css"
import { Link } from 'react-router-dom';
const CommonFooter = () => {
  return (
    <div className='_footer'>
      <div className='container'>
        <div className='footer_content'>
          <div className='row'>
            <div className='col-lg-8 col-sm-9'>
              <div className='menu-left'>
                <ul>
                  <li> <Link style={{color:'white'}} to="/terms" >Terms of  Service  <span className='mr-2 ml-2'>/</span></Link> </li>
                  <li> <Link style={{color:'white'}} to="/terms" >Privacy  <span className='mr-2 ml-2'>/</span></Link> </li>
                  <li>  <Link to="/how-to-play" style={{color:'white'}} > How to Play <span className='mr-2 ml-2'> /</span></Link> </li>
                  <li>Contact  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-4 col-sm-3'>
              <div>
                
              <div className='menu-right text-right'>
                <ul>
                  <li className='mr-3'> <FacebookOutlinedIcon style={{color:'white', fontSize:'40px'}} /></li>
                  <li className='mr-3'> <TwitterIcon style={{color:'white', fontSize:'40px'}} /></li>
                  <li className='mr-3'> <YouTubeIcon style={{color:'white', fontSize:'40px'}} /></li>
                </ul>
              </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default CommonFooter