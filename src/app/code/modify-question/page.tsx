"use client"
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import ModifyQuestionForm from './modifyQuestion'
import { withAdminAuth } from '@/components/withAdminAuth'

function ModifyQuestion() {
  return (
    <ReduxProvider>
        <ModifyQuestionForm/>
    </ReduxProvider>
  )
}

export default withAdminAuth(ModifyQuestion)