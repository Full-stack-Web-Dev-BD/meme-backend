import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

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

export default function VoteModal({ activeMeme, doVote }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [paidEsterEggsCount, setPaidEsterEggsCount] = useState(1)
    const [paidRottenEggsCount, setPaidRottenEggsCount] = useState(1)
    const [freeEsterEggsCount, setFreeEsterEggsCount] = useState(10)
    const [freeRottenEggsCount, setFreeRottenEggsCount] = useState(10)
    const submitHandler = (e) => {
        e.preventDefault()
        var obj = {
            paidEsterEggs: paidEsterEggsCount,
            paidRottenEggs: paidRottenEggsCount
        }
        doVote(obj)
    }
    return (
        <div>
            <button onClick={handleOpen} className='btn  yellow_btn mt-3' > Through Eggs ! {activeMeme.user.name} </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <h5 className='text-center'>Through Your Eggs to {activeMeme.user.name} </h5>
                        <hr />
                        <form onSubmit={e => submitHandler(e)} className='mt-5'>
                            <h6>Paid (Important) </h6>
                            <div className='mb-3'>
                                <label className='m-0'>Ester Eggs</label>
                                <input required onChange={e => setPaidEsterEggsCount(e.target.value)} value={paidEsterEggsCount} type="number" className='form-control' placeholder='Enter Amount (Min-0 ) ' />
                            </div>
                            <div>
                                <label className='m-0'>Rotten  Eggs</label>
                                <input required onChange={e => setPaidRottenEggsCount(e.target.value)} value={paidRottenEggsCount} type="number" className='form-control' placeholder='Enter Amount (Min-0) ' />
                            </div>
                            <h6 className='mt-4'>Free</h6>
                            <div className='mb-3'>
                                <label className='m-0'>Ester Eggs</label>
                                <input required onChange={e => setFreeEsterEggsCount(e.target.value)} value={freeEsterEggsCount} type="number" className='form-control' placeholder='Enter Amount (Min-0 ) ' />
                            </div>
                            <div>
                                <label className='m-0'>Ester Eggs</label>
                                <input required onChange={e => setFreeRottenEggsCount(e.target.value)} value={freeRottenEggsCount} type="number" className='form-control' placeholder='Enter Amount (Min-0) ' />
                            </div>
                            <button type='submit' className='btn mt-3  yellow_btn' > Vote</button>
                            <button className='btn mt-3  yellow_btn ml-3' onClick={e => handleClose()} > Close</button>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div >
    );
}
