"use client"
import { verifyMail } from '@/consts';
import { handlePostMethod } from '@/utils/apiCall';
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function Verification() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const token = searchParams.get('token');
    const [message, setMessage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        setLoading(true);
        try{
            (async()=>{
                const response = await handlePostMethod(verifyMail, {token});
                if(response instanceof Response){
                    if(response.status === 200 || response.status === 201){
                        setMessage("Verification successful");
                    } else{
                        const res = await response.json();
                        setMessage(res.message);
                    }
                } else{
                    setMessage("Something went wrong. Please try again later.");
                }
            })()
        } catch(err){
            setMessage(err as string)
        } finally{
            setLoading(false);
        }
    },[token])

    if (loading) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <h1>Loading...</h1>
            </div>
        )
    }
  return (
    <div className='flex items-center flex-col justify-center'>
        <h1>{type} Verification</h1>
        <p>{message}</p>
    </div>
  )
}

export default Verification
