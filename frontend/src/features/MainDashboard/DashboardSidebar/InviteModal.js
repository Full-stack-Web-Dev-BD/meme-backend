import React, { useState } from 'react';
import Box from '@mui/material/Box';
import PersonAdd from '@mui/icons-material/PersonAdd';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterOutlinedIcon from '@mui/icons-material/Twitter';
import Linkedin from '@mui/icons-material/LinkedIn';
import Telegram from '@mui/icons-material/Telegram';
import Modal from '@mui/material/Modal';
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

export default function InviteModal() {
    const [open, setOpen] = useState()
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function copy() {
        // Get the text field
        var copyText = document.getElementById("myInput");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

        // Alert the copied text
        toast.success("Copied the Invitation Link: " + copyText.value);
    }
    return (
        <div>
            <button className='btn yellow_btn' style={{
                padding: '2px 18px'
            }}
                onClick={handleOpen}
            >
                <span
                    style={{
                        margin: "0 5px",
                        position: "relative",
                        bottom: "2px"
                    }}
                >
                    <PersonAdd />
                </span>
                Invite
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <h5 className='text-center'>Invite People</h5>
                        <hr />
                        <div className='row no-gutters'>
                            <div className='col-md-9'>
                                <input value={window.location.href} className='form-control' style={{ borderRadius: '0' }} />
                            </div>
                            <div className='col-md-3'>
                                <input className='sr-only' id="myInput" value={window.location.href} />
                                <button className='btn btn-block '
                                    onClick={e => copy()}
                                    style={{
                                        margin: '0 5px',
                                        border: "1px solid #f96b12",
                                        borderRadius: "0",
                                        color: "#f96b12"
                                    }}
                                > Copy</button>
                            </div>
                        </div>
                        <div className='mt-4 ' style={{
                            textAlign: 'center',
                        }}>
                            <a target="_blank" onClick={e => copy()} href='https://facebook.com'>
                                <span>
                                    <FacebookOutlinedIcon style={{ color: '#4064ac', fontSize: '32px' }} />
                                </span>
                            </a>
                            <a target="_blank" onClick={e => copy()} href='https://facebook.com'>
                                <span>
                                    <TwitterOutlinedIcon style={{ color: '#4064ac', fontSize: '32px' }} />
                                </span>
                            </a>
                            <a target="_blank" onClick={e => copy()} href='https://facebook.com'>
                                <span>
                                    <Linkedin style={{ color: '#4064ac', fontSize: '32px' }} />
                                </span>
                            </a>
                            <a target="_blank" onClick={e => copy()} href='https://facebook.com'>
                                <span>
                                    <Telegram style={{ color: '#4064ac', fontSize: '32px' }} />
                                </span>
                            </a>

                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
