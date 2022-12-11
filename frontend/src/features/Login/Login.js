import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getUserFromToken } from '../../Util'
import { baseURL } from '../../utils/constant'
import CommonHeader from '../Components/Header/PageHeader'
import "./login.css"
const Login = () => {
    const [email, setEmail] = useState()
    const [password, setpassword] = useState()

    useEffect(() => {
        if (getUserFromToken()) {
            window.location.href = "/account"
        }
    }, [])


    const submitHandler = (e) => {
        e.preventDefault()
        axios.post(`${baseURL}/api/user/login`, {
            email, password
        })
            .then(res => {
                setTimeout(() => {
                    window.location.href = "/home"
                }, 2000);
                window.localStorage.setItem("meme_token", res.data.token)
                toast.success("Login Success , Redirecting to Account !")
            })
            .catch(err => {
                console.log(err)
                Object.keys(err.response.data).map(e => {
                    toast.error(err.response.data[e])
                })
            })
    }
    return (
        <div>
            <div>
                <CommonHeader content="loginRegister" />
                <div className='login_page'  >
                    <div className='row' >
                        <div className='col-md-4 offset-md-4'>
                            <form onSubmit={e => submitHandler(e)} className='card p-3' >
                                <div>
                                    <label> Email </label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} className='form-control' name='email' type={'email'} placeholder='Enter Email Address' />
                                </div>
                                <div className='mt-3'>
                                    <label> Password </label>
                                    <input className='form-control' name='password' value={password} onChange={e => setpassword(e.target.value)} type={"password"} placeholder='Enter Password Address' />
                                </div>
                                <div className='mt-4'>
                                    <button type='submit' className='btn yellow_btn log_in_btn'>LOG IN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login