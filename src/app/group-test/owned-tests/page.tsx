"use client"

import ReduxProvider from "@/redux/redux-provider";
import { TestCard } from "../interfaces";
import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ListIcon as Category } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { getOwnedGroupTestsEndpoint } from "@/consts";
import { handleGetMethod } from "@/utils/apiCall";
import Loading from "@/app/loading";
import Link from "next/link";
import { format } from "date-fns";

function UpcomingTestCardComponent({ data }: Readonly<{ data: TestCard }>) {
    const startDate = new Date(data.startDateTime)
    const endDate = new Date(data.endDateTime)
    const formattedStartDate = format(startDate, 'MMMM d, yyyy h:mm a');
    const formattedEndDate = format(endDate, 'MMMM d, yyyy h:mm a');
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center space-x-3 my-4">
                    <Category className="h-6 w-6" />
                    <CardTitle className="">{data.title}</CardTitle>
                </div>
                <p className="text-md text-muted-foreground">
                    {`Starts at ${formattedStartDate}`}
                </p>
                <p className="text-md text-muted-foreground">
                    {`Ends at ${formattedEndDate}`}
                </p>
            </CardHeader>
            <CardFooter className="mt-auto gap-2">
                <Link className="w-full" href={`/group-test/owned-tests/${data._id}`}>
                    <Button variant={"secondary"} className="w-full">
                        Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

function BrowseTestButton() {
    return (
        <div className="flex justify-between pb-6">
            <h1 className="text-2xl font-bold">Group Tests created by Me</h1>
            <div className="flex gap-2">
                <Link href="/group-test/create">
                    <Button variant={"default"}>Create A Group Test</Button>
                </Link>
                <Link href={"/group-test"}>
                    <Button variant={"outline"}>Back</Button>
                </Link>
            </div>
        </div>
    )
}


export default function OwnedTestList() {
    const [loading, setLoading] = useState(false)
    const [tests, setTests] = useState<TestCard[]>([])

    useEffect(() => {
        setLoading(true);
        (async () => {
            const response = await handleGetMethod(getOwnedGroupTestsEndpoint)
            if (response instanceof Response) {
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    setTests(res.groupTests)
                } else {
                    alert("Error fetching question tags")
                }
            } else {
                alert("Error fetching question tags")
            }
        })()
        setLoading(false)
    }, [])

    if (loading) {
        return <Loading />
    }
    return (
        <ReduxProvider>
            <main className='dark container py-10'>
                <BrowseTestButton />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {tests.map((data, index) => <UpcomingTestCardComponent key={index} data={data} />)}
                </div>
                {tests.length === 0 && <h1 className="text-2xl font-bold text-center">No Group Tests created by you</h1>}
            </main>
        </ReduxProvider>
    )
}