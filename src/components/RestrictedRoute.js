import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../utils/context/AuthContext'

export function RestrictedRouteSignin({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RestrictedRouteSignup({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}

export function RestrictedRouteAutenticated({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}