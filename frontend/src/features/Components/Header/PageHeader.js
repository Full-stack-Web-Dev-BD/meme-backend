import React from 'react'
import VolumeUpIcon from '@mui/icons-material/VolumeUpOutlined';
import "./header.css"
import { Link } from 'react-router-dom'
import { getUserFromToken } from '../../../Util';
const CommonHeader = ({ content, pn }) => {
    return (
        <div className='page_header'>
            <div className='header_content'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-2 col-md-3 col-sm-3 col-3'>
                            <div className='header_left_content'>
                                <div className='sound_icon'>
                                    <Link to="/">
                                        <VolumeUpIcon style={{ color: 'white', fontSize: '36px', cursor: 'pointer' }} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-10 col-md-9 col-sm-9 col-9'>
                            {
                                content === "loginRegister" ?

                                    <div className='header_right_content text-right'>
                                        {
                                            getUserFromToken() ?
                                                <Link to="/account">
                                                    <button className='btn log_in_btn'>Account</button>
                                                </Link> :
                                                <div className='header_home_right_content d-inline'>
                                                    <Link to="/register">
                                                        <button className='btn sing_up_btn mr-3'>SING UP</button>
                                                    </Link>
                                                    <Link to="/">
                                                        <button className='btn log_in_btn'>LOG IN</button>
                                                    </Link>
                                                </div>
                                        }
                                    </div> : ''
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommonHeader