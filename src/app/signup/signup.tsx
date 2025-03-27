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
import { apiEntryPoint, GET_VERIFY_GOOGLE_USER, getProfile, signupEndpoint } from "@/consts"
import { handleGetMethod } from "@/utils/apiCall"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CircleLoading from "@/components/ui/circleLoading"
import { signupFormSchema } from "./schema"
import { CountryCodeSelect } from "./countryCodeSelect"
import { countryCodes } from "@/lib/countryCodes"

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

export function SignupForm() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("basic")

    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        mode: "onChange", // Validate on change
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            countryCode: "+91", // Default to India's country code
            mobile: "",
            institute: "",
            bio: "",
            location: "",
            company: "",
            github: "",
            twitter: "",
            website: "",
        },
    })

    const handleSignupSubmit = async (values: z.infer<typeof signupFormSchema>) => {
        setLoading(true)
        const response = await postingData(values, signupEndpoint)
        const responseData = await response.json()
        if (response.status === 200 || response.status === 201) {
            dispatch(setAuthState(true))
            dispatch(setUserState(responseData.data))
            router.push("/")
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

    const nextTab = async () => {
        if (activeTab === "basic") {
            // Validate required fields before proceeding
            const result = await form.trigger([
                "username",
                "email",
                "password",
                "confirmPassword",
                "name",
                "countryCode",
                "mobile",
            ])
            if (!result) {
                return // Don't proceed if validation fails
            }
            setActiveTab("additional")
        } else if (activeTab === "additional") {
            setActiveTab("social")
        }
    }

    const prevTab = () => {
        if (activeTab === "additional") {
            setActiveTab("basic")
        } else if (activeTab === "social") {
            setActiveTab("additional")
        }
    }

    return (
        <Card className="md:py-12 md:px-8">
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
                Sign up with Google
            </Button>
            <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Fill in your details to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignupSubmit)} className="space-y-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="additional">Additional Info</TabsTrigger>
                                <TabsTrigger value="social">Social Links</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john123" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" {...field} required type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 gap-4">
                                    <FormItem>
                                        <FormLabel>Mobile Number*</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="countryCode"
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <CountryCodeSelect
                                                            countryCodes={countryCodes}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mobile"
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <Input placeholder="1234567890" {...field} required className="flex-1" />
                                                    </FormControl>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            {form.formState.errors.countryCode && (
                                                <p className="text-sm font-medium text-destructive">
                                                    {form.formState.errors.countryCode.message}
                                                </p>
                                            )}
                                            {form.formState.errors.mobile && (
                                                <p className="text-sm font-medium text-destructive">{form.formState.errors.mobile.message}</p>
                                            )}
                                        </div>
                                    </FormItem>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="********" {...field} type="password" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="********" {...field} type="password" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button type="button" onClick={nextTab}>
                                        Next
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="additional" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="institute"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Institute</FormLabel>
                                            <FormControl>
                                                <Input placeholder="University or School" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tell us about yourself" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City, Country" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Where you work" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevTab}>
                                        Back
                                    </Button>
                                    <Button type="button" onClick={nextTab}>
                                        Next
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="social" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="github"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub</FormLabel>
                                            <FormControl>
                                                <Input placeholder="github.com/username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="twitter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Twitter</FormLabel>
                                            <FormControl>
                                                <Input placeholder="twitter.com/username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://yourwebsite.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-4 flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevTab}>
                                        Back
                                    </Button>
                                    {loading ? (
                                        <Button type="submit" disabled>
                                            <CircleLoading color="bg-neutral-50" />
                                        </Button>
                                    ) : (
                                        <Button type="submit">Create Account</Button>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {error && (
                            <div className="my-3 text-center text-sm text-red-600">
                                <span>{error}</span>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-center w-full">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

