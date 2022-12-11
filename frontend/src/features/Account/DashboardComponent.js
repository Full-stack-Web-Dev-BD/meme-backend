import React, { useEffect, useState } from 'react'
import { baseURL, randomNum } from '../../utils/constant'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { appState } from '../../states/appState';
import { useRecoilState } from 'recoil';
import axios from 'axios';
const DashboardComponent = () => {
    const [getAppState, setAppState] = useRecoilState(appState)
    const [totalGame, setTotalGame] = useState(0)
    const [round, setRound] = useState([])
    useEffect(() => {

        axios.get(`${baseURL}/api/round/totalround`)
            .then(res => {
                setTotalGame(res.data?.total)
            })
    }, [])

    const fetchRound = (roomID) => {
        var owner = getAppState.rooms[roomID].owner
        if (!owner) return 0;
        axios.get(`${baseURL}/api/round/all/${owner}`)
            .then(resp => {
                setRound(resp.data)
            })

    }
    return (
        <div>
            <div className='dashboard_component'>
                <div className='account_sidebar_tab_content acc_sidebar_content_db'>
                    <div className='p-4'>
                        <div className='room_selector'>
                            <select onChange={e => fetchRound(e.target.value)} >
                                <option style={{ color: 'gray' }} value="">Name of the room</option>
                                {
                                    getAppState.rooms.map((room, i) => {
                                        return (
                                            <option key={i} style={{ color: 'gray' }} value={i} >{room.roomName}  </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='winner_details'>
                            <div className='flex_content_between'>
                                <h5> Winner </h5>
                                <h5> Country Played </h5>
                            </div>
                            <div className='flex_content_between'>
                                <p>Name of the winner</p>
                                <p>United State of America</p>
                            </div>
                            <div className='flex_content_between'>
                                <h5> Number of Followers </h5>
                                <p> City Played </p>
                            </div>
                            <div className='flex_content_between'>
                                <p>4320495024</p>
                                <p>New York</p>
                            </div>
                        </div>
                        <div className='player_table'>
                            <div style={{ height: "300px", overflowY: 'scroll' }} className="hide_sc">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>
                                                <button className='btn yellow_btn y_btn_rs '>Players</button>
                                            </th>
                                            <th>
                                                <img style={{ width: '30px' }} src='/assets/RottenEgg.png' />
                                            </th>
                                            <th>
                                                <img style={{ width: '30px' }} src='/assets/EasterEgg.png' />
                                            </th>
                                            {/* <th>Votes Recived</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            round.map((el, i) => (
                                                <tr key={i} >
                                                    <td className=''> {el.winner?.user.name} </td>
                                                    <td className='text-center'> {el.winner?.vote.paidEsterEggsCount} </td>
                                                    <td className='text-center'> {el.winner?.vote.paidRottenEggsCount} </td>
                                                    {/* <td className='text-center'> {el.vote} </td> */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='total_status_holder '>
                    <div className='total_status'>
                        <div className='total_count total_games'>
                            <h4>Total Games</h4>
                            <h5> <img src='/assets/eggs.png' /> {totalGame} </h5>
                        </div>
                        <div className='total_count total_visitor'>
                            <h4>Total Visitor</h4>
                            <h5>  <PeopleAltIcon style={{ color: 'white', fontSize: '26px' }} />  {randomNum()} </h5>
                        </div>
                    </div>
                    <img src='/assets/memechallengeYellow.png' />
                </div>
            </div>
        </div>
    )
}

export default DashboardComponent