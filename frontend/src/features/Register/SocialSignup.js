import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import { baseURL } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
};

export default function SocialSignup({ isSocialSignupModalOpen, user }) {
    const [password, setPassword] = useState()
    const submitHandler = (e) => {
        e.preventDefault()
        var regUser = { ...user, password: password }
        console.log(regUser)
        axios.post(`${baseURL}/api/user/register`, regUser)
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
    return (
        <div>
            <Modal
                open={isSocialSignupModalOpen}
                onClose={e => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <h5 className='text-center'>Register </h5>
                        <hr />
                        <form onSubmit={e => submitHandler(e)}>
                            <label>Enter a password ( For Login in next time ) </label>
                            <Input type='password' value={password} onChange={e => setPassword(e.target.value)} fullWidth required placeholder='Password' />
                            <div className='mt-4'>
                                <button type='submit' className='btn yellow_btn'>Register</button>
                            </div>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
