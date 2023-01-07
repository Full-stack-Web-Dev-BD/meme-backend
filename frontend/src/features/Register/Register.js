import React, { useEffect, useState } from 'react'
import Footer from '../Components/Footer/Footer'
import Header from '../Components/Header/PageHeader'
import { toast } from 'react-toastify'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import "./register.css"
import axios from 'axios'
import { baseURL } from '../../utils/constant';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login'
import SocialSignup from './SocialSignup';

import { useLinkedIn } from 'react-linkedin-login-oauth2';
// You can use provided image shipped by this package or using your own

const Register = () => {
  const clientId = '777503944063-5mssnj41ranrib5alak109bhr2h3csl7.apps.googleusercontent.com'
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [socialModal, setSocialModal] = useState(false)
  const [country, setCountry] = useState()
  const [user, setUser] = useState({})
  useEffect(() => {
    axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=aca13a5d9cbf4f219a47a8a4a6c6b119')
      .then(resp => {
        setCountry(resp.data?.country)
      })
  }, [])
  const submitHandler = (e) => {//register by   form 
    e.preventDefault()
    axios.post(`${baseURL}/api/user/register`, {
      name: name,
      email: email,
      password: password,
      country
    })
      .then(res => {
        toast.success("Registration Success ")
        setTimeout(() => {
          window.location.href = '/'
        }, 2000);
      })
      .catch(err => {
        if (err.response) {
          Object.keys(err.response.data).map(e => {
            console.log(e, err.response.data[e])
            toast.error(err.response.data[e])
          })
        }
      })
  }
  const onSuccess = (sres) => {
    var socialuser = sres.profileObj
    axios.get(`${baseURL}/api/user/find-email/${socialuser.email}`)
      .then(res => {
        console.log(res.data)
        if (res.data == null) {
          socialuser.country = country
          setUser(socialuser)
          setSocialModal(true)
        } else {
          toast.warning("Your Account Already Exist  , Please Login ")
          toast.info("Redirecting on Login Page ")
          setTimeout(() => {
            window.location.href = "/"
          }, 2500);
        }
      })
  };
  const onFBSuccess = (fres) => {
    return console.log(fres)
    var socialuser = fres
    axios.get(`${baseURL}/api/user/find-email/${socialuser.email}`)
      .then(res => {
        if (res.data == null) {
          toast.warning("Your Account Already Exist  , Please Login ")
          toast.info("Redirecting on Login Page ")
          setTimeout(() => {
            window.location.href = "/"
          }, 2500);
        } else {
          socialuser.country = country
          setUser(socialuser)
          setSocialModal(true)
        }
      })
  };
  const onFailure = (err) => {
    console.log(err)
    console.log("Connection Error !!")
  };

  return (
    <div className='register_page'>
      <Header content="none" />
      <div className='register_content '>
        <div className='meme_challange'>
          <div className='meme_challange_content'>
            <img src="/assets/memechallengeYellow.png" />
          </div>
        </div>
        <div className='container mt-5 '>
          <div className='row'>
            <div className='col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12'>
              <div className='register_card'>
                <div className='register_or'>
                  <span>OR</span>
                </div>
                <div className='_register '>
                  <div className=' mt-5 text-center register_login_area' >
                    <SocialSignup
                      isSocialSignupModalOpen={socialModal}
                      user={user}
                    />
                    <GoogleLogin
                      clientId={clientId}
                      buttonText="Sign Up with Google"
                      onSuccess={e => onSuccess(e)}
                      autoLoad={false}
                      onFailure={e => onFailure(e)}
                      cookiePolicy={'single_host_origin'}
                    />

{/* <FacebookLogin
    appId="486721986534201"
    autoLoad={false}
    fields="name,email,picture"
    callback={e=>console.log("facebook response",e)}
    cssClass="my-facebook-button-class"
    icon="fa-facebook"
  /> */}
                    {/* <FacebookLogin
                      appId="486721986534201"
                      autoLoad={false}
                      fields="name,email,picture"
                      onClick={e => onFBSuccess(e)}
                      callback={e => onFBSuccess(e)}
                      icon={<FacebookOutlinedIcon style={{ color: 'white', fontSize: '22px' }} />}
                      textButton="Signup With Facebook"
                      size="small btn fb_btn"
                    /> */}


                    {/* <img
                      onClick={linkedInLogin}
                      src={linkedin}
                      alt="Sign in with Linked In"
                      style={{ maxWidth: '180px', cursor: 'pointer' }}
                    /> */}
                    {/*  
                    {/* 86ssuzfdrq8qeo */}
                    {/* <button className='btn register_social_btn fb_login_btn'> <span><FacebookOutlinedIcon style={{ color: 'white', fontSize: '22px' }} /></span> Login With Facebook</button><br /> */}
                    {/* <button className='btn register_social_btn google_login_btn'> <span style={{ opacity: '0' }}><YouTubeIcon style={{ color: 'white', fontSize: '22px' }} /> </span>Login with Google</button><br /> */}
                    {/* <button className='btn register_social_btn twitter_login_btn'> <span><TwitterIcon style={{ color: 'white', fontSize: '22px' }} /></span> Login With Twitter</button><br /> */}

                    <p className=' text-white mt-4'>Already have account , <Link to="/" >Go to Login</Link>  </p>
                  </div>
                  <div className='register_sm_or'>
                    <span>OR</span>
                  </div>
                  <div className='register_subscribe_area' >
                    <div className='register_subscribe_area_title'>
                      <h2>SUBSCRIBE MANUALLY</h2>
                    </div>
                    <div>
                      <form onSubmit={e => submitHandler(e)} >
                        <div className='gray_input text-center'>
                          <input name='name' required onChange={e => setName(e.target.value)} className='form-control register_subscribe_input' placeholder='Name' />
                          <input name='email' type="email" required onChange={e => setEmail(e.target.value)} className='form-control register_subscribe_input' placeholder='E-mail' />
                          <input name='password' type={'password'} required onChange={e => setPassword(e.target.value)} className='form-control register_subscribe_input mb-4' placeholder='Password' />
                        </div>
                        <div className='text-center'>
                          <button type='submit' className='btn btn_subscribe yellow_btn'>Register</button>
                        </div>
                      </form>
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

export default Register