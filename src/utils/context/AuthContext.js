import React, { useContext, useState, useEffect } from 'react'
import supabaseClient from '../supabaseClient'
import { userSignin, userSignup, userSignout } from '../../services/AuthServices'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, userLoggedOut } from "../../store/auth/userslice"
import { setSession, sessionLoggedOut } from "../../store/auth/sessionslice"

const AuthContext = React.createContext()

export function AuthContextProvider({ children }) {
  
    const dispatch = useDispatch();
  
    const reduxUser = useSelector((state) => state.auth.user)

    console.log(reduxUser)

    const [user, setuser] = useState()
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
  
      setuser(Object.keys(reduxUser).length !== 0 ? reduxUser : null)
      setLoading(false)
  
      const { subscription  } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Signed IN' + event);
        if(event === 'SIGNED_IN') {
          dispatch(setUser(session?.user ?? null))
          dispatch(setSession(session ?? null))
          setuser(session?.user ?? null)
          setLoading(false)
        }
        if(event === 'SIGNED_OUT') {
          setuser(null)
          dispatch(userLoggedOut())
          dispatch(sessionLoggedOut())
          setLoading(false)
        }
      })

      console.log(user);
  
      return () => {
        subscription?.unsubscribe()
      }
    }, [])
  
    // Will be passed down to Signup, Login and Dashboard components
    const value = {
      signUp: ({email, password, name, area, aadarno}) => userSignup(email, password, name, area, aadarno),
      signIn: ({email, password}) => userSignin(email, password),
      signOut: () => userSignout(),
      user,
    }
  
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
   return useContext(AuthContext)
}