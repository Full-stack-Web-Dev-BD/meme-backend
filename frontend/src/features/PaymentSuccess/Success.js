import React from 'react'

const Success = () => {
    return (
        <div className='col-md-4 offset-md-4 text-center pt-5' >
            <h2 className=' alert alert-success  mb-3'>Payment Success</h2>
            <a style={{ color: 'gray', fontWeight: '700' }} href='/home' >Home Page</a>
        </div>
    )
}

export default Success