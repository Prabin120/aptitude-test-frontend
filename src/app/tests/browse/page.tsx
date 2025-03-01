"use client"
import Loading from '@/app/loading'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getTestsEndpoint } from '@/consts'
import { handleGetMethod } from '@/utils/apiCall'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ListIcon as Category } from 'lucide-react'
import DialogMessage from '../dialogMessage'
import TestRegistration from '../registration'
import { TestCard } from '../interfaces'
import ReduxProvider from '@/redux/redux-provider'
import { useAppSelector } from '@/redux/store'

interface ButtonLinkProps {
    userId: string | undefined;
    setShowRegistration: (showInstructions: boolean) => void;
    registered: boolean | undefined;
  }

function BrowseTestButton() {
    return (
        <div className="flex justify-between pb-6">
            <h1 className="text-2xl font-bold">All Upcoming Tests</h1>
            <Link href="/tests">
                <Button variant={"outline"}>My Tests</Button>
            </Link>
        </div>
    )
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ userId, setShowRegistration, registered }) => {
    if (!userId) {
        return (
            <Button variant={"default"} className="w-full">
                <Link href={"/login"}>Login to Register</Link>
            </Button>
        )
    } else if (registered) {
        return (
            <Button variant={"secondary"} disabled className="w-full">
                Registered
            </Button>
        )
    } else {
        return (
            <Button variant={"default"} onClick={() => setShowRegistration(true)} className="w-full">
                Register
            </Button>
        )
    }
}

function TestCardComponent({ data }: Readonly<{ data: TestCard }>) {
    const [timer, setTimer] = useState<string>("")
    const [showInstructions, setShowInstructions] = useState<boolean>(false)
    const [showRegistration, setShowRegistration] = useState<boolean>(false)
    const user = useAppSelector((state) => state.user)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const testTime = new Date(data.startDateTime)
            const timeLeft = testTime.getTime() - now.getTime()
            if (timeLeft <= 0) {
                setTimer("End")
                return
            }
            const days = Math.floor((timeLeft / (1000 * 60 * 60 * 24)))
            const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((timeLeft / (1000 * 60)) % 60)
            const seconds = Math.floor((timeLeft / 1000) % 60)

            setTimer(`${days ? days + "d" : ""} ${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""} ${seconds}s`)
        }

        calculateTimeLeft()
        const interval = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [data.startDateTime, data])

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center space-x-3 my-4">
                    <Category className="h-6 w-6" />
                    <CardTitle className="">{data.title}</CardTitle>
                </div>
                <CardDescription>{data.description}</CardDescription>
                <p className="text-2xl text-muted-foreground">
                    Starts in: {timer}
                </p>
            </CardHeader>
            <CardFooter className="mt-auto gap-2">
                <ButtonLink userId={user._id} setShowRegistration={setShowRegistration} registered={data.registered} />
                {/* {data.registered ?
                    <Button variant={"secondary"} disabled className="w-full">
                        Registered
                    </Button>
                    :
                    <Button variant={"default"} onClick={() => setShowRegistration(true)} className="w-full">
                        Register
                    </Button>
                } */}
                <Button variant={"outline"} onClick={() => setShowInstructions(true)} >Info</Button>
                <DialogMessage showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
                <TestRegistration showRegistration={showRegistration} setShowRegistration={setShowRegistration} id={data._id} amount={data.amount} type={data.type} />
            </CardFooter>
        </Card>
    )
}

function TestBrowse() {
    const [loading, setLoading] = useState(true)
    const [test, setTests] = useState([])
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const response = await handleGetMethod(getTestsEndpoint)
                if (response instanceof Response) {
                    const res = await response.json()
                    if (response.status === 200 || response.status === 201) {
                        setTests(res.tests)
                    } else {
                        alert("Error fetching question tags")
                    }
                } else {
                    alert("Error fetching question tags")
                }
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return <Loading />
    }

    if (test.length === 0)
        return (
            <div className="container mx-auto py-8">
                <BrowseTestButton />
                <h2 className="text-lg mb-2">No tests found</h2>
            </div>
        )
    return (
        <ReduxProvider>
            <div className="container mx-auto py-8">
                <BrowseTestButton />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {test.map((data: TestCard) => (
                        <TestCardComponent key={data._id} data={data} />
                    ))}
                </div>
            </div>
        </ReduxProvider>
    )
}

export default TestBrowse