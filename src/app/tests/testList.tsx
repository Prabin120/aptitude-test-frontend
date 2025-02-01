import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListIcon as Category } from 'lucide-react'
import { handleGetMethod } from "@/utils/apiCall"
import { usePathname } from 'next/navigation'
import { getTestsEndpoint } from "@/consts"
import DialogMessage from "./dialogMessage"
import Loading from "../loading"

interface TestCard {
    slug: string
    title: string
    startDateTime: Date
    endDateTime: Date
    duration: number
    description: string
    type: "exam" | "practice"
}

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
                    <Link href={pathname + "/" + data.type + "/" + data.slug + "/score"}>View Score</Link>
                </Button>
                <Button variant={"outline"} onClick={() => setShowInstructions(true)} >Info</Button>
                <DialogMessage showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
            </CardFooter>
        </Card>
    )
}

function OngoingTestCardComponent({ data, pastTests, setOngoingTests, setPastTests }: Readonly<{ data: TestCard, pastTests: TestCard[]|undefined, setOngoingTests: (tests: TestCard[]) => void, setPastTests: (tests: TestCard[]) => void }>) {
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
                <Button asChild className="w-full">
                    <Link href={pathname + "/" + data.type + "/" + data.slug + "?time="+data.endDateTime}>Start Test</Link>
                </Button>
                <Button variant={"outline"} onClick={() => setShowInstructions(true)} >Info</Button>
                <DialogMessage showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
            </CardFooter>
        </Card>
    )
}

function UpcomingTestCardComponent({ data, upcomingTests, setOngoingTests, setUpcomingTests, ongoingTests }: Readonly<{ data: TestCard, upcomingTests: TestCard[]|undefined, setOngoingTests: (tests: TestCard[])=>void, setUpcomingTests: (tests: TestCard[])=>void, ongoingTests: TestCard[]|undefined }>) {
    const [timer, setTimer] = useState<string>("")
    const [showInstructions, setShowInstructions] = useState<boolean>(false)
    // const [showRegistration, setShowRegistration] = useState<boolean>(false)
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

            setTimer(`${days ? days + "d" : ""} ${hours ? hours + "h" : ""} ${minutes? minutes + "m" : ""} ${seconds}s`)
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
                {/* <TestRegistration showRegistration={showRegistration} setShowRegistration={setShowRegistration} /> */}
            </CardFooter>
        </Card>
    )
}

export default function AptitudeListingPage() {
    const [upcomingTests, setUpcomingTests] = useState<TestCard[]>([])
    const [pastTests, setPastTests] = useState<TestCard[]>([])
    const [ongoingTests, setOngoingTests] = useState<TestCard[]>([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        (async () => {
            setLoading(true)
            const response = await handleGetMethod(getTestsEndpoint)
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
    }, [])
    
    if(loading) {
        return <Loading />
    }

    if(upcomingTests.length === 0 && ongoingTests?.length === 0 && pastTests?.length === 0)
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Tests</h1>
                </div>
                <h2 className="text-lg mb-2">No tests found</h2>
            </div>
        )
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Tests</h1>
            </div>

            <h2 className="text-lg mb-2">Ongoing Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {ongoingTests?.map((test) => (
                    <OngoingTestCardComponent key={test.slug} data={test} pastTests={pastTests} setPastTests={setPastTests} setOngoingTests={setOngoingTests} />
                ))}
            </div>
            <h2 className="text-lg mb-2">Upcoming Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {upcomingTests?.map((test) => (
                    <UpcomingTestCardComponent key={test.slug} data={test} upcomingTests={upcomingTests} ongoingTests={ongoingTests} setUpcomingTests={setUpcomingTests} setOngoingTests={setOngoingTests} />
                ))}
            </div>
            <h2 className="text-lg mb-2">Past Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pastTests?.map((test) => (
                    <PastTestCardComponent key={test.slug} data={test} />
                ))}
            </div>
        </div>
    )
}
