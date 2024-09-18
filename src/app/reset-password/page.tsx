'use client'

import ResetPasswordComponent from '@/components/component/password-reset'
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