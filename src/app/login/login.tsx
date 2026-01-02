"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import Link from "next/link"

import { useAppDispatch } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState } from "@/redux/user/userSlice"
import { apiEntryPoint, GET_VERIFY_GOOGLE_USER, getProfile, loginEndpoint } from "@/consts"
import { handleGetMethod } from "@/utils/apiCall"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CircleLoading from "@/components/ui/circleLoading"
import { loginFormSchema } from "./zod_schema"


const postingData = async (data: object, endPoint: string) => {
    const response = await fetch(apiEntryPoint + endPoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    })
    return response
}

import posthog from "posthog-js"

export function LoginForm() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof loginFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "" },
    })

    const handleLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
        setLoading(true)
        const response = await postingData(values, loginEndpoint)
        const responseData = await response.json()
        if (response.status === 200 || response.status === 201) {
            dispatch(setUserState(responseData.data))
            dispatch(setAuthState(true))
            // Track successful login
            posthog.capture('user_login', {
                method: 'email',
                email: responseData.data.email
            })
            posthog.identify(responseData.data.username, {
                email: responseData.data.email,
                name: responseData.data.name
            })
            router.back()
        } else {
            setError(responseData.message)
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            const width = 500
            const height = 600
            const left = (window.innerWidth - width) / 2
            const top = (window.innerHeight - height) / 2
            const popup = window.open(
                apiEntryPoint + GET_VERIFY_GOOGLE_USER,
                "GoogleAuthPopup",
                `width=${width},height=${height},top=${top},left=${left}`,
            )
            if (!popup) {
                console.error("Popup blocked by the browser")
                return
            }
            const handleMessage = async (event: MessageEvent) => {
                if (event.origin !== apiEntryPoint) {
                    console.warn("Received message from unknown origin:", event.origin)
                    return
                }
                if (event.data.success) {
                    const response = await handleGetMethod(getProfile)
                    if (response instanceof Response && response.status === 200) {
                        const responseData = await response.json()
                        dispatch(setAuthState(true))
                        dispatch(setUserState(responseData.data))
                        // Track successful Google login
                        posthog.capture('user_login', {
                            method: 'google',
                            email: responseData.data.email
                        })
                        posthog.identify(responseData.data.username, {
                            email: responseData.data.email,
                            name: responseData.data.name
                        })
                        router.push("/")
                    } else {
                        alert("Some error occurs")
                    }
                } else {
                    console.error("Authentication failed")
                }
                window.removeEventListener("message", handleMessage)
            }
            window.addEventListener("message", handleMessage)
            const popupInterval = setInterval(() => {
                if (popup.closed) {
                    clearInterval(popupInterval)
                }
            }, 500)
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="md:py-16 md:px-10 my-5">
            <Button className="w-full mb-4" variant={"secondary"} onClick={handleGoogleLogin}>
                <svg
                    className="mr-2 -ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                </svg>
                Sign in with Google
            </Button>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email and password to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@gmail.com" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="*********" {...field} required type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {loading ? (
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-text" disabled>
                                <CircleLoading color="bg-neutral-50" />
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-text">
                                Login
                            </Button>
                        )}
                    </form>
                    {error && (
                        <div className="my-3 text-center text-sm text-red-600">
                            <span>{error}</span>
                        </div>
                    )}
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Link
                    href="/forgot-password"
                    className="text-sm text-end w-full font-medium hover:underline underline-offset-4"
                >
                    Forgot Password
                </Link>
                <div className="text-sm text-center w-full">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-medium text-primary hover:underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

