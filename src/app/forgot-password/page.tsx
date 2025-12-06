'use client'
import { Button } from '@/components/ui/button'
import CircleLoading from '@/components/ui/circleLoading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPassword } from '@/consts'
import { handlePostMethod } from '@/utils/apiCall'
import React, { FormEvent, useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null | "">(null)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const response = await handlePostMethod(forgotPassword, { email })
        if(response instanceof Response){
            const responseData = await response.json()
            if (response.status === 200 || response.status === 201) {
                setError("")
            }
            else {
                setError(responseData.message)
            }
        }
        setIsLoading(false)
    }
    return (
        <div className='mx-auto max-w-[600px] space-y-6 py-12 md:py-24'>
            <h1 className='text-3xl mb-6'>Reset Password</h1>
            <form onSubmit={handleSubmit} className="min-w- border-neutral-600 rounded-lg border-2 px-4 py-8 space-y-6">
                <div className="space-y-2 w-full">
                    <Label htmlFor="card-name">Email</Label>
                    <Input
                        id="card-name"
                        placeholder="test@gmail.com"
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {isLoading ?
                    <Button type="submit" className="w-full" disabled>
                        <CircleLoading color="bg-neutral-50" />
                    </Button>
                    :
                    <Button type='submit' className='w-full' variant={'secondary'}>Submit</Button>
                }
                {error === "" ?
                    <p className='text-green-600'>
                        Password reset link sent to your email.
                        The link will be expire in 30 minutes.
                    </p>
                    :
                    <p className='text-red-600 text-center'>{error}</p>
                }
            </form>
        </div>
    )
}

export default ForgotPassword