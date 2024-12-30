"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, startOfDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingTimeSchema } from "@/app/test-registration/zod-schema"
import { Form, FormField, FormItem, FormLabel } from "../../components/ui/form"
import { z } from "zod"
import { handlePostMethod } from "@/utils/apiCall"
import { paymentCreateOrderEndpoint, verifyPaymentEndpoint } from "@/consts"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState, userInitialState } from "@/redux/user/userSlice"
import { useToast } from "@/hooks/use-toast"
import { useAppSelector } from "@/redux/store"
import CircleLoading from "../../components/ui/circleLoading"

interface RazorpayOptions {
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
}

export default function TestSetupAndPayment() {
    const [step, setStep] = useState(1)
    const [startTime, setStartTime] = useState("")
    const [dateTime, setDateTime] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState<boolean>(false);
    const { toast } = useToast()
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

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
        const dateTime = new Date(dateTimeStr);
        setDateTime(dateTime.toISOString()); // Store the final date-time string
        setStep(step + 1); // Move to the next step
        setError("");
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        const loadScript = async () => {
            const isScriptLoaded = await loadRazorpayScript();
            if (isScriptLoaded) {
                setRazorpayScriptLoaded(true);
            } else {
                console.error("Failed to load Razorpay script");
            }
        };
        loadScript();
    }, [user]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (!razorpayScriptLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }
            const data = {
                amount: 2000 * 100,
                dateTime: dateTime
            }
            const response = await handlePostMethod(paymentCreateOrderEndpoint, data);
            if (response instanceof Response) {
                if (response.status === 401 || response.status === 403) {
                    dispatch(setAuthState(false));
                    dispatch(setUserState(userInitialState));
                    router.replace('/login')
                }
                if (!response.ok) {
                    throw new Error('Failed to create order')
                }

                const order = await response.json()
                const options = {
                    key: order.key_id,
                    amount: order.amount,
                    currency: "INR",
                    name: "AptiCode",
                    description: "Test Registration",
                    order_id: order.id,
                    handler: async function (response: RazorpayOptions) {
                        const data = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        const result = await handlePostMethod(verifyPaymentEndpoint, data)
                        if (result instanceof Response) {
                            if (result.ok) {
                                toast({
                                    title: "Payment Successful",
                                    description: `Payment ID: ${response.razorpay_payment_id}`,
                                })
                                router.replace('/')
                            } else {
                                toast({
                                    title: "Payment Failed",
                                    description: "An error occurred while processing your payment.",
                                    variant: "destructive",
                                })
                            }
                        } else {
                            throw new Error('Payment verification failed')
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.mobile
                    },
                    theme: {
                        color: "#09090a"
                    }
                }
                const paymentObject = new window.Razorpay(options)
                paymentObject.open()
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast({
                title: "Payment Error",
                description: "An error occurred while processing your payment.",
                variant: "destructive",
            })
        } finally {
            setLoading(false);
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
                        <>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-4">
                                        <Label htmlFor="amount">Amount (in INR)</Label>
                                        <Input
                                            id="amount"
                                            placeholder="Enter amount"
                                            type="number"
                                            value={2000}
                                            disabled
                                        // onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handlePayment} className="w-full" disabled={loading}>
                                    {loading ?
                                        <CircleLoading />
                                        :
                                        "Pay Now"
                                    }
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    {error ?
                        <div className="my-3 w-full text-center text-sm text-red-600">
                            <span>{error}</span>
                        </div>
                        : null
                    }
                </CardFooter>
            </Card>
        </div>
    )
}