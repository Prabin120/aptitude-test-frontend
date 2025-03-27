'use client'
import { LoginForm } from '@/app/login/login'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
const Login = () => {
  return (
    <ReduxProvider>
      <main className='dark'>
        <div className="mx-auto max-w-[500px]">
          <LoginForm />
        </div>
      </main>
    </ReduxProvider>
  )
}

export default Login
