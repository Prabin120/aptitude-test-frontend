"use client"
import Loading from '@/app/loading'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getGroupTestEndpoint } from '@/consts'
import { handleGetMethod } from '@/utils/apiCall'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ListIcon as Category } from 'lucide-react'
import ReduxProvider from '@/redux/redux-provider'
import { TestCard } from './interfaces'
import DialogMessage from './dialogMessage'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/redux/store'

function PastTestCardComponent({ data }: Readonly<{ data: TestCard }>) {
    const pathname = usePathname()
    const [showInstructions, setShowInstructions] = useState<boolean>(false)
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center space-x-3 my-4">
                    <Category className="h-6 w-6" />
                    <CardTitle className="">{data.title}</CardTitle>
                </div>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto gap-2">
                <Button asChild className="w-full">
                    <Link href={pathname + "/"  + data._id + "/score"}>View Score</Link>
                </Button>
                <Button variant={"outline"} onClick={() => setShowInstructions(true)} >Info</Button>
                <DialogMessage showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
            </CardFooter>
        </Card>
    )
}

function OngoingTestCardComponent({ data, pastTests, setOngoingTests, setPastTests }: 
        Readonly<{ data: TestCard, pastTests: TestCard[] | undefined, setOngoingTests: (tests: TestCard[]) => void, 
        setPastTests: (tests: TestCard[]) => void }>) {
    const [timer, setTimer] = useState<string>("")
    const pathname = usePathname()
    const [showInstructions, setShowInstructions] = useState<boolean>(false)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const testTime = new Date(data.endDateTime)
            const timeLeft = testTime.getTime() - now.getTime()
            if (timeLeft <= 0) {
                setTimer("End")
                setOngoingTests((pastTests || []).filter((test) => test.slug !== data.slug))
                setPastTests([...pastTests!, data])
                return
            }
            const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((timeLeft / (1000 * 60)) % 60)
            const seconds = Math.floor((timeLeft / 1000) % 60)

            setTimer(`${hours}h ${minutes}m ${seconds}s`)
        }
        calculateTimeLeft()
        const interval = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [data.startDateTime, data, pastTests, setOngoingTests, setPastTests])
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center space-x-3 my-4">
                    <Category className="h-6 w-6" />
                    <CardTitle className="">{data.title}</CardTitle>
                </div>
                <CardDescription>{data.description}</CardDescription>
                <p className="text-2xl text-muted-foreground">
                    End in: {timer}
                </p>
            </CardHeader>
            <CardFooter className="mt-auto gap-2">
                {data.attempted?
                    <Button disabled className="w-full">
                        Test Already Attempted
                    </Button>
                    :
                    <Button asChild className="w-full">
                        <Link href={pathname + "/" + data._id}>Start Test</Link>
                    </Button>
                }
                <Button variant={"outline"} onClick={() => setShowInstructions(true)} >Info</Button>
                <DialogMessage showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
            </CardFooter>
        </Card>
    )
}

function UpcomingTestCardComponent({ data, upcomingTests, setOngoingTests, setUpcomingTests, ongoingTests }: Readonly<{ data: TestCard, upcomingTests: TestCard[] | undefined, setOngoingTests: (tests: TestCard[]) => void, setUpcomingTests: (tests: TestCard[]) => void, ongoingTests: TestCard[] | undefined }>) {
    const [timer, setTimer] = useState<string>("")
    const [showInstructions, setShowInstructions] = useState<boolean>(false)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const testTime = new Date(data.startDateTime)
            const timeLeft = testTime.getTime() - now.getTime()
            if (timeLeft <= 0) {
                setTimer("End")
                setUpcomingTests((upcomingTests || [])?.filter((test) => test.slug !== data.slug))
                setOngoingTests([...ongoingTests!, data])
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
    }, [data.startDateTime, data, ongoingTests, setUpcomingTests, setOngoingTests, upcomingTests])

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
                <Button variant={"secondary"} disabled className="w-full">
                    Start Test
                </Button>
                <Button variant={"outline"} onClick={() => setShowInstructions(true)} >Info</Button>
                <DialogMessage showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
            </CardFooter>
        </Card>
    )
}

function BrowseTestButton() {
    return (
        <div className="flex justify-between pb-6">
            <h1 className="text-2xl font-bold">All Upcoming Tests</h1>
            <div className='flex gap-2'>
                <Link href={"/group-test/owned-tests"}>
                    <Button variant={"outline"}>Owned Tests</Button>
                </Link>
                <Link href="/group-test/create">
                    <Button variant={"default"}>Create A Group Test</Button>
                </Link>
            </div>
        </div>
    )
}

function GroupTests() {
    const [upcomingTests, setUpcomingTests] = useState<TestCard[]>([])
    const [pastTests, setPastTests] = useState<TestCard[]>([])
    const [ongoingTests, setOngoingTests] = useState<TestCard[]>([])
    const [loading, setLoading] = useState(true)
    const user = useAppSelector((state) => state.user)
    useEffect(() => {
        user._id && (async () => {
            setLoading(true)
            const response = await handleGetMethod(getGroupTestEndpoint)
            if (response instanceof Response) {
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    const { pastTests, upcomingTests, ongoingTests } = res
                    setPastTests(pastTests)
                    setUpcomingTests(upcomingTests)
                    setOngoingTests(ongoingTests)
                } else {
                    alert("Error fetching question tags")
                }
            } else {
                alert("Error fetching question tags")
            }
            setLoading(false)
        })()
        setLoading(false)
    }, [])

    if (loading) {
        return <Loading />
    }

    if (!user._id) {
        return (
            <div className="container mx-auto py-8">
                {/* <BrowseTestButton /> */}
                <h2 className="text-lg mb-2">You are not logged in</h2>
                <p className="text-lg mb-2">Please login to see your group tests or to create a group test</p>
            </div>
        )
    }

    if (upcomingTests.length === 0 && ongoingTests?.length === 0 && pastTests?.length === 0)
        return (
            <div className="container mx-auto py-8">
                <BrowseTestButton />
                <h2 className="text-lg mb-2">No tests found</h2>
            </div>
        )
    return (
        <ReduxProvider>
            <div className="container mx-auto py-8 min-h-[80vh]">
                <BrowseTestButton />
                {ongoingTests?.length > 0 &&
                    <h2 className="text-lg mb-2">Ongoing Tests</h2>
                }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {ongoingTests?.map((test) => (
                        <OngoingTestCardComponent key={test.slug} data={test} pastTests={pastTests} setPastTests={setPastTests} setOngoingTests={setOngoingTests} />
                    ))}
                </div>
                {upcomingTests?.length > 0 &&
                    <h2 className="text-lg mb-2">Upcoming Tests</h2>
                }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {upcomingTests?.map((test) => (
                        <UpcomingTestCardComponent key={test.slug} data={test} upcomingTests={upcomingTests} ongoingTests={ongoingTests} setUpcomingTests={setUpcomingTests} setOngoingTests={setOngoingTests} />
                    ))}
                </div>
                {pastTests?.length > 0 &&
                    <h2 className="text-lg mb-2">Past Tests</h2>
                }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {pastTests?.map((test) => (
                        <PastTestCardComponent key={test.slug} data={test} />
                    ))}
                </div>
            </div>
        </ReduxProvider>
    )
}

export default GroupTests