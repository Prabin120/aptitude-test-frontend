'use client'
import { Button } from '@/components/ui/button'
import CircleLoading from '@/components/ui/circleLoading'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/consts'
import { setAuthState } from '@/redux/auth/authSlice'
import { useAppDispatch } from '@/redux/store'
import { setUserState } from '@/redux/user/userSlice'
import { handlePostMethod } from '@/utils/apiCall'
import { resetPasswordSchema } from '@/utils/zod_schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ResetPasswordComponent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const editPasswordForm = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    })

    const handlePasswordChange = async (value: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true)
        const response = await handlePostMethod(resetPassword, value, searchParams.toString())
        if(response instanceof Response){
            const responseData = await response.json()
            if (response.status === 200 || response.status === 201) {
                dispatch(setUserState(responseData.data))
                dispatch(setAuthState(true))
                router.push('/')
            } else {
                setError(responseData.message)
            }
        } else {
            setError(response.message)
        }
        setIsLoading(false)
    }
    return (
        <div className='mx-auto max-w-[600px] space-y-6 py-12 md:py-24'>
            <h1 className='text-3xl mb-6'>Type New Password</h1>
            <Form {...editPasswordForm}>
                <form onSubmit={editPasswordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                    <FormField
                        control={editPasswordForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" {...field} type="password" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={editPasswordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" {...field} type="password" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {
                        isLoading ?
                            <Button type="submit" className="w-full" disabled>
                                <CircleLoading color="bg-neutral-50" />
                            </Button>
                            :
                            <Button type="submit" className="w-full">
                                Change Password
                            </Button>
                    }
                </form>
                {error && (
                    <div className="my-3 text-center text-sm text-red-600">
                        <span>{error}</span>
                    </div>
                )}
            </Form>
        </div>
    )
}

export default ResetPasswordComponent