'use client'
import UserProfile from '@/components/component/profile'
import Footer from '@/components/ui/footer'
import Header from '@/components/ui/header'
import { gettingStorageValue } from '@/utils/localStorageSaving'
import React, { useEffect } from 'react'
import { useState } from 'react'
import {IUser} from './userSchema'
import Loading from '../loading'
import { handleGetMethod } from '@/utils/apiCall'

const page = () => {
    const [user, setUser] = useState<IUser>();
    useEffect(() => {
        const user = gettingStorageValue('user');
        setUser(user ? JSON.parse(user) : null);
        // const response = handleGetMethod('/api/v1/user/test')
    },[])
    const testAttempts = [
        {
            id: 1,
            rank: 45,
            score: 80,
            date: '2022-01-01',
        },
        {
            id: 2,
            rank: 10,
            score: 90,
            date: '2022-01-02',
        },
    ]
  return (
    <>
        <Header/>
        <main className='dark'>
            <UserProfile user={user} testAttempts={testAttempts}/>
        </main>
        <Footer/>
    </>
  )
}

export default page;