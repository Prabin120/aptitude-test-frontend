'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { loginFormSchema, signupFormSchema } from "@/utils/zod_schema"
import { useState } from "react"
import CircleLoading from "../../components/ui/circleLoading"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState } from "@/redux/user/userSlice"
import { apiEntryPoint, GET_VERIFY_GOOGLE_USER, getProfile, loginEndpoint, signupEndpoint } from "@/consts"
import Link from "next/link"
import { handleGetMethod } from "@/utils/apiCall"

const postingData = async (data: object, endPoint: string) => {
    const response = await fetch(apiEntryPoint + endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data), // Send form data as JSON
    });
    return response;
}

export function LoginComponent() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
        setLoading(true);
        const response = await postingData(values, loginEndpoint);
        const responseData = await response.json();
        if (response.status === 200 || response.status === 201) {
            dispatch(setUserState(responseData.data));
            dispatch(setAuthState(true));
            router.back();
        } else {
            setError(responseData.message);
        }
        setLoading(false);
    };

    const handleSignupSubmit = async (values: z.infer<typeof signupFormSchema>) => {
        setLoading(true);
        const response = await postingData(values, signupEndpoint);
        const responseData = await response.json();
        if (response.status === 200 || response.status === 201) {
            dispatch(setAuthState(true));
            dispatch(setUserState(responseData.data));
            router.push('/');
        } else {
            setError(responseData.message);
        }
        setLoading(false);
    };

    const loginForm = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' }
    });

    // Signup form
    const signupForm = useForm({
        resolver: zodResolver(signupFormSchema),
        defaultValues: { email: '', password: '', confirmPassword: '', name: '', mobile: "", institute: '' }
    });

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const width = 500;
            const height = 600;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;
            const popup = window.open(
                apiEntryPoint+GET_VERIFY_GOOGLE_USER,
                "GoogleAuthPopup",
                `width=${width},height=${height},top=${top},left=${left}`
            );
            if (!popup) {
                console.error("Popup blocked by the browser");
                return;
            }
            const handleMessage = async (event: MessageEvent) => {
                if (event.origin !== apiEntryPoint) {
                    console.warn("Received message from unknown origin:", event.origin);
                    return;
                }
                if (event.data.success) {
                    const response = await handleGetMethod(getProfile);
                    if (response instanceof Response && response.status === 200) {
                        const responseData = await response.json();
                        dispatch(setAuthState(true));
                        dispatch(setUserState({id: responseData.data._id, ...responseData.data}));
                        router.push('/');
                    } else {
                        alert("Some error occurs")
                    }
                } else {
                    console.error("Authentication failed");
                }
                window.removeEventListener("message", handleMessage);
            };
            window.addEventListener("message", handleMessage);
            const popupInterval = setInterval(() => {
                if (popup.closed) {
                    clearInterval(popupInterval);
                }
            }, 500);
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    };

    function googleButton() {
        return (
            <Button className="w-full mb-4" variant={"secondary"} onClick={handleGoogleLogin}>
                <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign up with Google
            </Button>
        )
    }

    return (
        <div className="mx-auto px-2 max-w-[600px] space-y-6 py-12 md:py-24">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted p-1">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card className="md:py-16 md:px-10">
                        {googleButton()}
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Enter your email and password to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                                    <FormField
                                        control={loginForm.control}
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
                                        control={loginForm.control}
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
                                    {
                                        loading ?
                                            <Button type="submit" className="w-full" disabled>
                                                <CircleLoading color="bg-neutral-50" />
                                            </Button>
                                            :
                                            <Button type="submit" className="w-full">
                                                Login
                                            </Button>
                                    }
                                </form>
                                {error && (
                                    <div className="my-3 text-center text-sm text-red-600">
                                        <span>{error}</span>
                                    </div>
                                )}
                            </Form>
                        </CardContent>
                        <CardFooter>
                            <Link href="forgot-password" className="text-sm text-end w-full font-medium hover:underline underline-offset-4">
                                Forgot Password
                            </Link>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card className="md:py-16 md:px-10">
                        {googleButton()}
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>Create a new account by entering your details below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Form {...signupForm}>
                                <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                                    <FormField
                                        control={signupForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
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
                                        control={signupForm.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1234567890" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
                                        name="institute"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Institute Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jolonda University" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
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
                                        control={signupForm.control}
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
                                        loading ?
                                            <Button type="submit" className="w-full" disabled>
                                                <CircleLoading color="bg-neutral-50" />
                                            </Button>
                                            :
                                            <Button type="submit" className="w-full">
                                                Sign Up
                                            </Button>
                                    }
                                </form>
                                {error && (
                                    <div className="my-3 text-center text-sm text-red-600">
                                        <span>{error}</span>
                                    </div>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
