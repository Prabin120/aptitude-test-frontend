"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, startOfDay } from "date-fns"
import { ArrowLeft, Calendar as CalendarIcon, CreditCard } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingTimeSchema } from "@/app/test-registration/zod-schema"
import { Form, FormField, FormItem, FormLabel } from "../ui/form"
import { z } from "zod"
import { handlePostMethod } from "@/utils/apiCall"
import { testRegistrationEndpoint } from "@/consts"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState, userInitialState } from "@/redux/user/userSlice"

export default function TestSetupAndPayment() {
    const [step, setStep] = useState(1)
    const [startTime, setStartTime] = useState("")
    const [dateTime, setDateTime] = useState("")
    const [error, setError] = useState("")
    const router = useRouter();
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch();

    const dateTimeForm = useForm({
        resolver: zodResolver(bookingTimeSchema),
        defaultValues: { date: new Date(), time: '' }
    });

    const convertToAMPM = (time: string) => {
        const [hours, minutes] = time.split(':');
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        const convertedHours = (parseInt(hours) % 12) || 12;
        return `${convertedHours}:${minutes} ${ampm}`;
    }

    const handleNextStep = (values: z.infer<typeof bookingTimeSchema>) => {
        const year = values.date.getFullYear();
        const month = (values.date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for month
        const day = values.date.getDate().toString().padStart(2, '0'); // Ensure two digits for day
        const date = `${year}-${month}-${day}`;        
        const dateTimeStr = `${date}T${values.time}:00`; // Adding seconds for valid ISO string
        // console.log("Formatted DateTime String:", dateTimeStr);
        setDateTime(dateTimeStr); // Store the final date-time string
        setStep(step + 1); // Move to the next step
        setError("");
    }
    
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted");
        // const date = (dateTime.date as string).split('T')[0]
        const response = await handlePostMethod(testRegistrationEndpoint, {dateTime}, searchParams.toString());
        const responseData = await response.json();
        if(response.status === 401 || response.status === 403){
            dispatch(setAuthState(false));
            dispatch(setUserState(userInitialState));
            router.replace('/login')
        }
        if(response.ok){
            setTimeout(() => {
                router.push('/')
            }, 1000)
        }
        else{
            setError(responseData.message)
        }
    }
    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Test Setup and Payment</CardTitle>
                    <CardDescription>Choose your test start time and duration, then complete the payment to proceed.</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <Form {...dateTimeForm}>
                            <form onSubmit={dateTimeForm.handleSubmit(handleNextStep)} className="space-y-4">
                                <FormField
                                    control={dateTimeForm.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                                        {/* {startDate ? format(startDate, "PPP") : <span>Pick a date</span>} */}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={dateTimeForm.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <Input
                                                className="w-full block"
                                                placeholder="HH:MM"
                                                id="start-time"
                                                type="time"
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setStartTime(convertToAMPM(e.target.value));
                                                }}
                                                required
                                            />
                                            {startTime &&
                                                <small className="w-full block text-left">You have choosen: {startTime}</small>
                                            }
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Submit</Button>
                            </form>
                        </Form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input
                                        id="card-number"
                                        placeholder="1234 5678 9012 3456"
                                        // value={cardNumber}
                                        // onChange={(e) => setCardNumber(e.target.value)}
                                        // required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card-name">Name on Card</Label>
                                    <Input
                                        id="card-name"
                                        placeholder="John Doe"
                                        // value={cardName}
                                        // onChange={(e) => setCardName(e.target.value)}
                                        // required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-expiry">Expiry Date</Label>
                                        <Input
                                            id="card-expiry"
                                            placeholder="MM/YY"
                                            // value={cardExpiry}
                                            // onChange={(e) => setCardExpiry(e.target.value)}
                                            // required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="card-cvc">CVC</Label>
                                        <Input
                                            id="card-cvc"
                                            placeholder="123"
                                            // value={cardCVC}
                                            // onChange={(e) => setCardCVC(e.target.value)}
                                            // required
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex flex-row space-x-3">
                                    <Button onClick={() => setStep(1)} variant={"outline"}>
                                        <ArrowLeft size={20} />
                                        Back
                                    </Button>
                                    <Button className="" onClick={handleSubmit}>
                                        <CreditCard className="mr-2 h-4 w-4" /> Pay ${10} and Book Test
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter>
                    {error?
                        <div className="my-3 w-full text-center text-sm text-red-600">
                            <span>{error}</span>
                        </div>
                        :null
                    }
                </CardFooter>
            </Card>
        </div>
    )
}