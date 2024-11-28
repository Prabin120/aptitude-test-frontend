'use client'
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { handleGetMethod } from "@/utils/apiCall"
import { upComingTestEndpoint } from "@/consts"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState, userInitialState } from "@/redux/user/userSlice"

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
const initialCountdown: Countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
}

export default function HomePage() {
    const dispatch = useAppDispatch();
    const [testStarted, setTestStarted] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [countDown, setCountDown] = useState<Countdown>(initialCountdown);
    const [attempted, setAttempted] = useState(false);
    const [testId, setTestId] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const authenticate = useAppSelector((state) => state.auth.authState)

    useEffect(() => {
        setAuthenticated(authenticate);
        (async () => {
            const response = await handleGetMethod(upComingTestEndpoint);
            // Check if the response is an ErrorResponse
            if (response.status === 401 || response.status === 403) {
                dispatch(setAuthState(false));
                dispatch(setUserState(userInitialState));
                setAuthenticated(false);
                return;
            } else if (response.status === 500) {
                console.error("Server Error");
                return;
            }

            if (response instanceof Response) {
                if (response.status === 401 || response.status === 403) {
                    dispatch(setAuthState(false));
                    dispatch(setUserState(userInitialState));
                    setAuthenticated(false);
                    return;
                }
                const responseData = await response.json();

                if (responseData.registered) {
                    setRegistered(true);
                    setTestId(responseData.data.test);
                    if (responseData.attemptedTest) {
                        setAttempted(true);
                        return;
                    }
                    const bookedTime = new Date(responseData.data.bookedTime);
                    if (responseData.data.paid && bookedTime < new Date()) {
                        setTestStarted(true);
                    }
                    else {
                        const calculateCountdown = () => {
                            const now = new Date().getTime();
                            const timeDifference = bookedTime.getTime() - now;
                            if (timeDifference <= 0) {
                                clearInterval(interval);
                                setCountDown(initialCountdown); // Time has passed, stop the countdown
                                setTestStarted(true);
                                return;
                            }

                            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                            setCountDown({
                                days,
                                hours,
                                minutes,
                                seconds,
                            });
                        };

                        calculateCountdown(); // Initial call to set the countdown immediately
                        const interval = setInterval(calculateCountdown, 1000); // Update countdown every second
                        return () => clearInterval(interval); // Clear interval on unmount
                    }
                }
            }
        }
        )();
    }, [authenticate, dispatch]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Welcome to AptiTest
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    Discover your potential with our comprehensive aptitude tests. Challenge yourself and unlock new
                                    opportunities.
                                </p>
                            </div>
                            <div className="space-x-4">
                                {authenticated ?
                                    (attempted ?
                                        (<Link href={`/score?testId=${testId}`}>
                                            <Button variant="secondary" className="h-11 px-8 animate-pulse" size="lg">
                                                View Score
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>)
                                        :
                                        (registered ?
                                            (testStarted ?
                                                (<Link href={`/test?testId=${testId}`}>
                                                    <Button variant="secondary" className="h-11 px-8 animate-pulse" size="lg">
                                                        Start Test
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Button>
                                                </Link>)
                                                :
                                                (<Button variant="secondary" className="h-11 px-8 animate-pulse" size="lg" disabled>
                                                    {countDown.days}d {countDown.hours}h {countDown.minutes}m {countDown.seconds}s left to start
                                                </Button>))
                                            :
                                            (<Link href={`/test-registration?testId=${testId}`}>
                                                <Button variant="secondary" className="h-11 px-8 animate-pulse" size="lg">
                                                    Register for a Test
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            </Link>))
                                    )
                                    :
                                    (<Link href={`/login`}>
                                        <Button variant="secondary" className="h-11 px-8 animate-pulse" size="lg">
                                            Let&apos;s Enter
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>)
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-900">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                <div className="p-2 bg-black bg-opacity-50 rounded-full">
                                    <svg
                                        className=" text-white h-6 w-6"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">Accurate Results</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Our tests are designed by experts to provide precise insights into your abilities.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                <div className="p-2 bg-black bg-opacity-50 rounded-full">
                                    <svg
                                        className=" text-white h-6 w-6"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">Secure Platform</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Your data and test results are protected with state-of-the-art security measures.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                <div className="p-2 bg-black bg-opacity-50 rounded-full">
                                    <svg
                                        className=" text-white h-6 w-6"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">Instant Feedback</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Get immediate results and personalized insights after completing your test.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}