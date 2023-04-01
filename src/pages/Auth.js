import React from 'react'
import Login from '../components/Login'
import Home from '../pages/Home'
import { useAuth } from '../utils/context/AuthContext'

function Auth() {
  const { user } = useAuth()

  if(user) {
    return <Home /> 
  }else {
    return <Login />
  }  
}

export default Auth