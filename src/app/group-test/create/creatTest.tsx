"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { checkAuthorization } from "@/utils/authorization"
import { handlePostMethod } from "@/utils/apiCall"
import { groupTestCreateOrderEndpoint } from "@/consts"
import { Textarea } from "@/components/ui/textarea"
import { SearchableQuestions } from "@/components/searchQuestion"
import DateAndTime from "@/components/dateAndTime"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setUserState } from "@/redux/user/userSlice"

const formSchema = z.object({
    title: z.string().min(5, "title must be more than 5 words"),
    description: z.string().min(10, "description of the test must be more than 10 words"),
    apti_list: z.array(z.object({ _id: z.string(), slug: z.string(), title: z.string(), marks: z.number() })),
    code_list: z.array(z.object({ _id: z.string(), slug: z.string(), title: z.string(), marks: z.number() })),
    type: z.enum(["exam", "practice"]),
    startDateTime: z.date(),
    duration: z.string().min(1, "duration has be there"),
    totalParticipants: z.string().min(1, "At least one participant is required"),
    participants: z.string().min(1, "Add at least one participant"),
})

export default function CreateTestsPage() {
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [requiredCoins, setRequiredCoins] = useState(0)
    const userDetail = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            apti_list: [],
            code_list: [],
            type: "exam",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const availableCoins = Number(userDetail.coins);
            const participants = values.participants.split(",").map((id: string) => id.trim());
            const totalParticipants = Number(values.totalParticipants);
            const amount = totalParticipants * 20;
            if(3 > totalParticipants|| totalParticipants > 50){
                return alert("Number of Participants should be between 3 and 50")
            }
            if(participants.length > totalParticipants){
                return alert("Number of Participants entered should be equal or less than Participants No")
            }
            setRequiredCoins(amount);
            if (availableCoins < amount) {
                setIsModalOpen(true);
                return
            }
            const response = await handlePostMethod(groupTestCreateOrderEndpoint, { ...values, participants: participants })
            if (response instanceof Response) {
                await checkAuthorization(response, dispatch);
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    dispatch(setUserState({ ...userDetail, coins: userDetail.coins - amount }))
                    router.push("/group-test/owned-tests");
                } else {
                    alert(res.message);
                }
            } else {
                alert("Server error")
            }
        } catch (error) {
            console.error("Error submitting test cases:", error)
            alert("An error occurred while submitting test cases. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Add a Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-col gap-3">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter title of the Test" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Enter description of the Test" ></Textarea>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="startDateTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date and Time</FormLabel>
                                            <DateAndTime field={field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Duration of Test (in Minutes)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="60" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="apti_list"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Aptitude Questions</FormLabel>
                                            <FormControl>
                                                <SearchableQuestions
                                                    selectedQuestions={field.value}
                                                    onQuestionsChange={field.onChange}
                                                    questionType="aptitude"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="code_list"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Coding Questions</FormLabel>
                                            <FormControl>
                                                <SearchableQuestions
                                                    selectedQuestions={field.value}
                                                    onQuestionsChange={field.onChange}
                                                    questionType="coding"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="totalParticipants"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Number of Participants:</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} placeholder="5" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="participants"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Add Participants (Comma Separated)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Example: user@example.com, user2@example.com" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Search className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            Submit
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Insert Table"
                    >
                        {/* <Table className="h-4 w-4" /> */}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>You Do not have enough coins to create this test</DialogTitle>
                        <DialogDescription>You have {userDetail.coins} coins and required {requiredCoins} coins to create this test. Please add coins to your wallet</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Link href="/rewards">
                                <Button type="button">Add Coins</Button>
                            </Link>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

