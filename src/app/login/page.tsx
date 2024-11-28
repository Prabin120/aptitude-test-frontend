'use client'
import { LoginComponent } from '@/app/login/login'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
const Login = () => {
  return (
    <ReduxProvider>
      <main className='dark'>
        <LoginComponent />
      </main>
    </ReduxProvider>
  )
}

export default Login
