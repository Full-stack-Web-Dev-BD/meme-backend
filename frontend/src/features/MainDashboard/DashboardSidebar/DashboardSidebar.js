import React, { useEffect, useState } from 'react'
import "./dashboardSidebar.css"
import VolumeUpIcon from '@mui/icons-material/VolumeUpOutlined';
import InviteModal from './InviteModal';


const DashboardSidebar = ({ state }) => {
    const [activePl, setActivePl] = useState('')
    function setActivePlayer(playerID) {
        if (activePl) {
            document.getElementById(activePl).classList.remove('active_player')
            document.getElementById(playerID).classList.add('active_player')
        } else {
            document.getElementById(playerID).classList.add('active_player')
        }
        setActivePl(playerID)
    }
    useEffect(() => {

        window.addEventListener("beforeunload", function (event) {
            event.returnValue = ""
        });
    }, [])
    return (
        <div className='dashboard_sidebar_inner'>
            <div className='sidebar_top'>
                <span>
                    <VolumeUpIcon style={{ color: 'white', fontSize: '36px', cursor: 'pointer' }} />
                </span>
            </div>
            <div className='sidebar_wrap'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className='btn yellow_btn'>PLAYERS</button>
                    <InviteModal />
                </div>
                <div className='player_list mt-5'>
                    {
                        state.roomDetails.perticipant?.map((pert, i) => (
                            <div key={i} className='db_single_player d-flex' id={`playerID${(i + 1)}`} onClick={e => setActivePlayer('playerID' + (i + 1))}>
                                <div className='player_pp'>
                                    <img src={`/assets/${pert.pp}.png`} />
                                </div>
                                <h4 className='player_name'> {pert.userName}    </h4>
                                {/* <div className='p_egg'>
                                    <div className='p_egg_count'>
                                        <img src='/assets/RottenEgg.png' />
                                        <span>{pert.balance?.paidEsterEggs} </span>
                                        {console.log(pert)}
                                    </div>
                                    <div className='p_egg_count'>
                                        <img src='/assets/EasterEgg.png' />
                                        <span> {pert.balance?.paidRottenEggs} </span>
                                    </div>
                                </div> */}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div >
    )
}

export default DashboardSidebar