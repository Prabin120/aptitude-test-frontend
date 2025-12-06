'use client'
import Loading from '@/app/loading'
import { Button } from '@/components/ui/button'
import { groupTestaddPaticipantsEndpoint } from '@/consts'
import ReduxProvider from '@/redux/redux-provider'
import { handleGetMethod } from '@/utils/apiCall'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function AddMe() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const searchParams = useSearchParams()
    const testId = searchParams.get("testId")
    const acceptChallenge = async () => {
        setLoading(true)
        const response = await handleGetMethod(groupTestaddPaticipantsEndpoint,`testId=${testId}`)
        if (response instanceof Response) {
            const res = await response.json()
            if (response.status === 200 || response.status === 201) {
                setMessage("Thank you for confirmation")
            } else {
                setMessage(res.message)
            }
        }
        setLoading(false)
    }
    if(loading){
        <Loading/>
    }
    return (
        <ReduxProvider>
            <main className='dark flex items-center justify-center min-h-[80vh]'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-4xl font-bold'>Press the accept button to accept the challenge</h1>
                    <div className='my-4'>
                    { message 
                        ? 
                        <h1 className='text-2xl font-bold'>{message}</h1>
                        :
                        <Button className='m-4 px-10' onClick={acceptChallenge}>Accept</Button>
                    }
                    </div>
                </div>  
            </main>
        </ReduxProvider>
    )
}