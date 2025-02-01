// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { paymentCreateOrderEndpoint, verifyPaymentEndpoint } from '@/consts';
// import { toast } from '@/hooks/use-toast';
// import { useAppSelector } from '@/redux/store';
// import { handlePostMethod } from '@/utils/apiCall';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'

// interface RazorpayOptions {
//     razorpay_order_id: string,
//     razorpay_payment_id: string,
//     razorpay_signature: string
// }

// function TestRegistration({ showRegistration, setShowRegistration }: Readonly<{ showRegistration: boolean, setShowRegistration: (showInstructions: boolean) => void }>) {
//     const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);
//     const router = useRouter();
//     const userDetail = useAppSelector((state) => state.user)
//     const loadRazorpayScript = () => {
//         return new Promise<boolean>((resolve) => {
//             const script = document.createElement("script")
//             script.src = "https://checkout.razorpay.com/v1/checkout.js"
//             script.onload = () => resolve(true)
//             script.onerror = () => resolve(false)
//             document.body.appendChild(script)
//         })
//     }

//     useEffect(() => {
//         const loadScript = async () => {
//             const isScriptLoaded = await loadRazorpayScript()
//             if (isScriptLoaded) {
//                 setRazorpayScriptLoaded(true)
//             } else {
//                 console.error("Failed to load Razorpay script")
//             }
//         }
//         loadScript()
//     }, [loadRazorpayScript]) // Added loadRazorpayScript to dependencies

//     const handlePayment = async () => {
//         setLoading(true)
//         try {
//             if (!razorpayScriptLoaded) {
//                 alert("Razorpay SDK failed to load. Are you online?")
//                 return
//             }
//             const data = {
//                 amount: 2000 * 100, // Amount in paise
//                 name: "Test Product", // Add product name
//                 description: "Test Description", // Add description
//             }
//             const response = await handlePostMethod(paymentCreateOrderEndpoint, data)
//             if (response instanceof Response) {
//                 const order = await response.json()
//                 const options = {
//                     key: order.key_id,
//                     amount: order.amount,
//                     currency: "INR",
//                     name: "AptiCode",
//                     description: "Test Registration",
//                     order_id: order.order_id,
//                     handler: async (response: RazorpayOptions) => {
//                         const data = {
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                         }
//                         const result = await handlePostMethod(verifyPaymentEndpoint, data)
//                         if (result.status === 200) {
//                             toast({
//                                 title: "Payment Successful",
//                                 description: `Payment ID: ${response.razorpay_payment_id}`,
//                             })
//                             router.replace("/")
//                         } else {
//                             toast({
//                                 title: "Payment Failed",
//                                 description: "An error occurred while processing your payment.",
//                                 variant: "destructive",
//                             })
//                         }
//                     },
//                     prefill: {
//                         name: userDetail.name,
//                         email: userDetail.email,
//                         contact: userDetail.mobile,
//                     },
//                     theme: {
//                         color: "#09090a",
//                     },
//                 }
//                 const paymentObject = new window.Razorpay(options)
//                 paymentObject.open()
//             } else {
//                 throw new Error("Failed to create order")
//             }
//         } catch (error) {
//             console.error("Payment error:", error)
//             toast({
//                 title: "Payment Error",
//                 description: "An error occurred while processing your payment.",
//                 variant: "destructive",
//             })
//         } finally {
//             setLoading(false)
//         }
//     }
//     return (
//         <Dialog open={showRegistration}>
//             <DialogContent aria-describedby={undefined}>
//                 <DialogHeader>
//                     <DialogTitle>Test Registration</DialogTitle>
//                     <DialogDescription>
//                         Please pay the amount below to register for the test:
//                     </DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter>
//                     <button onClick={handlePayment} disabled={loading}>
//                         {loading ? "Processing..." : "Pay Now"}
//                     </button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default TestRegistration