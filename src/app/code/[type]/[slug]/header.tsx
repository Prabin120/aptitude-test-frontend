"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import CircleLoading from '@/components/ui/circleLoading'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { logoutEndpoint } from '@/consts'
import { setAuthState } from '@/redux/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setUserState, userInitialState } from '@/redux/user/userSlice'
import { handleGetMethod } from '@/utils/apiCall'
import { LogOut, Play, Send, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface HeaderProps {
    runCode: () => void;
    submitCode: () => void;
    loading: boolean;
    type: string;
    time: string
}

function CodeHeader({ runCode, submitCode, loading, type, time }: Readonly<HeaderProps>) {
    const dispatch = useAppDispatch();
    const authenticate = useAppSelector((state) => state.auth.authState);
    const userDetail = useAppSelector((state) => state.user)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState("")

    const handleLogout = async () => {
        dispatch(setUserState(userInitialState));
        dispatch(setAuthState(false));
        await handleGetMethod(logoutEndpoint);
        router.push('/login');
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.ctrlKey && event.key === 'r') {
            event.preventDefault()
            if (authenticate) {
              runCode()
            } else {
              alert("Please login first")
            }
          } else if (event.ctrlKey && event.key === 's') {
            event.preventDefault()
            if (authenticate) {
              submitCode()
            } else {
              alert("Please login first")
            }
          }
        }
    
        window.addEventListener('keydown', handleKeyDown)
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown)
        }
      }, [authenticate, runCode, submitCode])

    useEffect(() => {
        if (type === "exam") {
            let animationFrame: number;
            const calculateTimeLeft = () => {
                const now = new Date().getTime();
                const test = new Date(time).getTime();
                const testTime = test - now;
                if (testTime <= 0) {
                    router.back()
                }
                const hours = Math.floor((testTime / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((testTime / (1000 * 60)) % 60);
                const seconds = Math.floor((testTime / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                animationFrame = requestAnimationFrame(calculateTimeLeft);
            };
            calculateTimeLeft(); // Start the loop
            return () => cancelAnimationFrame(animationFrame); // Clean up on unmount
        }
    }, [router, time, type, timeLeft]);

    const isProfile = () => {
        return authenticate ?
            (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                            size="icon"
                            variant="ghost"
                        >
                            <Avatar className="dark">
                                <AvatarImage src={userDetail.image} alt={userDetail.name} />
                                <AvatarFallback>{userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Open profile</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Profile</SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="dark w-14 h-14">
                                    <AvatarImage src={userDetail.image} alt={userDetail.name} />
                                    <AvatarFallback>{userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold">{userDetail.name}</h2>
                                    <p className="text-sm text-gray-500">{userDetail.email}</p>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                <Link href={"/profile"}>
                                    <Button className="w-full justify-start" variant="ghost">
                                        <User className="mr-2 h-4 w-4" />
                                        View Profile
                                    </Button>
                                </Link>
                                <Button className="w-full justify-start" variant="ghost">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                                <Button className="w-full justify-start" onClick={handleLogout} variant="ghost">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Button>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
            )
            :
            (
                <Link href={"/login"}>
                    <Button variant="secondary" size="default" className='px-7'>Login</Button>
                </Link>
            )
    }
    return (
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
                {type === "exam" ?
                    <div className="text-lg font-semibold">Time Left: {timeLeft}</div>
                    :
                    <Link className="flex items-center justify-center" href="/">
                        <span className="font-bold text-lg"><span className='font-serif font-thin'>&lt;AptiCode/&gt;</span>.</span>
                    </Link>
                }
            </div>
            <TooltipProvider>
                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={() => authenticate ? runCode() : alert("Please login first")} disabled={loading} size="sm">
                                {loading ? <CircleLoading color="bg-neutral-50" /> : <><Play className="mr-2 h-4 w-4" />Run</>}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Run code (Ctrl + R)</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={() => authenticate ? submitCode() : alert("Please login first")} disabled={loading} size="sm" variant="secondary">
                                {loading ? <CircleLoading color="bg-neutral-50" /> :
                                    <><Send className="mr-2 h-4 w-4" /> Submit</>
                                }
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Submit code (Ctrl + S)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
            {type === "exam" ?
                <div className="flex items-center space-x-2">
                    <Button className='px-6' onClick={() => router.back()}>Back</Button>
                </div>
                :
                isProfile()
            }
        </header >
    )
}

export default CodeHeader