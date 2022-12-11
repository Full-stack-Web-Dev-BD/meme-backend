import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { allLang, baseURL, logout } from '../../utils/constant'

const AccountComponent = ({ user }) => {
    const [country, setCountry] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [city, setCity] = useState()
    const [language, setLanguage] = useState()
    useEffect(() => {
        setCountry(user.country)
        setName(user.name)
        setEmail(user.email)
        setCity(user.city)
        setLanguage(user.language)
    }, [])
    const submitHandler = (e) => {
        e.preventDefault()
        var udpatedUser = { ...user, country, city, language, name, email }
        axios.post(`${baseURL}/api/user/update-user`, udpatedUser)
            .then(resp => {
                console.log(resp)
                toast.success("Your  Information Update Success !!")
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className='d-flex'>
            <div className='account_sidebar_tab_content account_sidebar_tab_content_acc'>
                <div className='p-4'>
                    <button className='btn yellow_btn pl-lg-2 text-black pr-2'>Basic Information</button>
                    <div className='text-center'>
                        <div className='profile_box' >
                            <div className='profile_circle'></div>
                            <div className='profile_image'>
                                <img src='/assets/1.png' />
                            </div>
                        </div>
                        <h4 className='text-white'  >{user?.name}</h4>
                        <button className='btn btn-danger' onClick={e => logout()}>Logout</button>

                    </div>
                    <div className='mt-lg-4'>
                        <form onSubmit={e => submitHandler(e)} className='account_form'>
                            <div className='fs_20'>
                                <label>Name</label>
                                <div>
                                    <input onChange={e => setName(e.target.value)} style={{ color: 'gray' }} className='form-control ' value={name} placeholder='Name of the uesr' />
                                </div>

                            </div>
                            <div className='mt-lg-4 mt-sm-2 fs_20'>
                                <label>E-mail</label>
                                <input onChange={e => setEmail(e.target.value)} style={{ color: 'gray' }} className='form-control' value={email} placeholder='Email' />
                            </div>
                            <div className='mt-lg-4 mt-sm-2 pb-5'>
                                <div className='flex_content_between '>
                                    <label className='fs_24' >Country</label>
                                    {
                                        user.country ?
                                            <div className='account_select_item w-70p'>
                                                <input className='form-control ' disabled value={country} placeholder='user@gmail.com' />
                                            </div> :
                                            <div className='account_select_item w-70p'>
                                                <div className='account_select_item w-70p'>
                                                    <input onChange={e => setCountry(e.target.value)} className='form-control ' value={country} placeholder='user@gmail.com' />
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className='flex_content_between mb-lg-4 mb-sm-2  mt-lg-4 mt-sm-2 '>
                                    <label className='fs_24' >City</label>
                                    <div className='account_select_item w-70p'>
                                        <input style={{ color: 'gray' }} className='form-control ' onChange={e => setCity(e.target.value)} value={city} placeholder='City Name' />
                                    </div>
                                </div>
                                <div className='flex_content_between '>
                                    <label className='fs_24' >Language</label>
                                    <div className='account_select_item w-70p'>
                                        {/* <input style={{ color: 'gray' }} onChange={e => setLanguage(e.target.value)} placeholder="Language" className='form-control ' value={language} /> */}
                                        <select value={language} onChange={e => setLanguage(e.target.value)} className='form-control'>
                                            <option value=""> {language ? language : 'Select Language'} </option>
                                            {
                                                allLang.map(el => {
                                                    return (
                                                        <option key={el.code} value={el.name}> {el.name} </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <button type='submit' className='mt-2 btn yellow_btn'> Update  Info </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='mt-lg-auto account_meme_img ' style={{ width: '30%' }}>
                <img style={{ width: "100%" }} src='/assets/memechallengeYellow.png' />
            </div>
        </div>
    )
}

export default AccountComponent 