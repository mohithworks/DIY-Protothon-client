import { Typography } from '@mui/material'
import React from 'react'
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button'
import { useAuth } from '../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom';

function Header({ areaname, areawallet }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate();

  return (
    <div className='bg-green-200 border-b-5 border-black'>
        <div className='flex justify-between bg-green-200 px-5 py-5 border-b-5 border-black'>
            <div>
                <Typography variant='h5' component='b'>DIY</Typography>
                <Chip color="secondary" label={areaname} className='ml-2 -mt-2' />
            </div>
            <div className='justify-between'>
                <Button variant="contained" color="primary" onClick={() => navigate('/contribute')} >Contribute</Button>
                <Button variant="outlined" color="primary"className="ml-3" onClick={() => signOut()}>Sign Out</Button>
            </div>
        </div>
        <div className='px-5'>
            <Typography variant='h6' component='b'>Area Wallet - Rs.{areawallet}</Typography>
        </div>
    </div>
  )
}

export default Header