import React from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { randomNum } from '../../utils/constant';

const Map = () => {
  return (
    <div className='mb-5'>
      <div className='w-100p map_box'>
        <img src='/assets/map.png' />
      </div>
      <div className='flex_content_between'>
        <div className='total_count total_count_map total_visitor '>
          <h4>Total Visitor</h4>
          <h5>  <PeopleAltIcon style={{ color: 'white', fontSize: '26px' }} />  {randomNum()} </h5>
        </div>
        <div className='total_count total_count_map total_games'>
          <h4>Total Games</h4>
          <h5> <img src='/assets/eggs.png' /> {randomNum()} </h5>
        </div>
        <div className='total_count total_count_map followers'>
          <h4>Followers</h4>
          <h5> <img src='/assets/followers.png' /> {randomNum()} </h5>
        </div>
      </div>
    </div>
  )
}

export default Map