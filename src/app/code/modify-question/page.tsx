"use client"
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import ModifyQuestionForm from './modifyQuestion'

function ModifyQuestion() {
  return (
    <ReduxProvider>
        <ModifyQuestionForm/>
    </ReduxProvider>
  )
}

export default ModifyQuestion