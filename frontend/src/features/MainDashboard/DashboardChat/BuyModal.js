import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { PayPalButton } from "react-paypal-button-v2";
import axios from 'axios';
import { baseURL } from '../../../utils/constant';
import { useRecoilState } from 'recoil';
import { appState } from '../../../states/appState';
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

export default function BuyModal() {
    const [pack, setPack] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [getAppState, setAppState] = useRecoilState(appState)
    const [payLink, setPayLink] = React.useState()
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    var pack1 = {
        esterEggs: 5,
        rottenEggs: 7,
        price: 5,
        packName: "Pack 2",
    }
    var pack2 = {
        packName: "Pack 1",
        esterEggs: 7,
        rottenEggs: 10,
        price: 7

    }
    const checkout = (p) => {
        p.user = getAppState.user._id
        setPack(p)
        axios.post(`${baseURL}/api/user/checkout`, p)
            .then(resp => {
                setPayLink(resp.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            <button onClick={handleOpen} className='btn  btn-block ' >Cheer to Win ! </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <h5 className='text-center'>Purchase Eggs</h5>
                        <hr />
                        {
                            pack ?
                                <div>
                                    <div>
                                        <div className='mb-3 d-flex' style={{ justifyContent: 'space-between' }}>
                                            <span style={{ textAlign: "center", display: 'flex' }}  >
                                                <img style={{ width: '22px', height: '28px' }} src='/assets/rottenEgg.png' />
                                                <h4 className='ml-1'> {pack.esterEggs} </h4>
                                            </span>
                                            <span style={{ textAlign: "center", display: 'flex' }} >
                                                <img src='/assets/EasterEgg.png' style={{ width: '22px', height: '28px' }} />
                                                <h4 className='ml-1'> {pack.rottenEggs} </h4>
                                            </span>
                                            <button className='btn yellow_btn p-0 pl-2 pr-2'   > Selected Pack (  {pack.price} $ ) </button>
                                        </div>
                                    </div>
                                    <div className='text-right mb-5'>
                                        <button className='btn   ' style={{ width: "40px", height: '40px', borderRadius: '40px', color: 'white', backgroundColor: '#bd2038', fontWeight: '700', cursor: 'pointer' }} onClick={e => { setPack(null); setPayLink("") }}  > X </button>
                                    </div>
                                </div> :
                                <div>
                                    <div>
                                        <div className='mb-3 d-flex' style={{ justifyContent: 'space-between' }}>
                                            <span style={{ textAlign: "center", display: 'flex' }}  >
                                                <img style={{ width: '22px', height: '28px' }} src='/assets/ester.png' />
                                                <h4 className='ml-1'>{pack1.esterEggs}</h4>
                                            </span>
                                            <span style={{ textAlign: "center", display: 'flex' }} >
                                                <img src='/assets/EasterEgg.png' style={{ width: '22px', height: '28px' }} />
                                                <h4 className='ml-1'>{pack1.rottenEggs}  </h4>
                                            </span>
                                            <button className='btn yellow_btn p-0 pl-2 pr-2' onClick={e => { checkout(pack1) }} > Select Pack ( 5$ ) </button>
                                        </div>
                                    </div>
                                    <div className=' mt-4'>
                                        <div className='mb-3 d-flex' style={{ justifyContent: 'space-between' }}>
                                            <span style={{ textAlign: "center", display: 'flex' }}  >
                                                <img style={{ width: '22px', height: '28px' }} src='/assets/rotten.png' />
                                                <h4 className='ml-1'>{pack2.esterEggs}</h4>
                                            </span>
                                            <span style={{ textAlign: "center", display: 'flex' }} >
                                                <img src='/assets/EasterEgg.png' style={{ width: '22px', height: '28px' }} />
                                                <h4 className='ml-1'> {pack2.rottenEggs} </h4>
                                            </span>
                                            <button className='btn yellow_btn p-0 pl-2 pr-2 ' onClick={e => checkout(pack2)}> Select Pack ( 7$ ) </button>
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            pack ?
                                <div className='mt-4 ' style={{ display: 'inline', width: '300px' }}>
                                    {
                                        payLink ?
                                            <a href={payLink} target="_blank" >
                                                <img src='/assets/paypal.png' style={{ width: "100%" }} />
                                            </a> :
                                            <p>Please Wait ...</p>
                                    }
                                </div>
                                :
                                <p className='text-center text-bold text-danger'> <b>Please select a Pack to continue</b> </p>
                        }
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
