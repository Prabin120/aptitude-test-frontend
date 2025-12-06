'use client'

import ResetPasswordComponent from '@/app/reset-password/password-reset'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

const ResetPassword = () => {
  return (
    <ReduxProvider>
        <menu>
            <ResetPasswordComponent />
        </menu>
    </ReduxProvider>
  )
}

export default ResetPassword