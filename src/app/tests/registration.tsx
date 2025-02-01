// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { paymentCreateOrderEndpoint, verifyPaymentEndpoint } from '@/consts';
// import { handlePostMethod } from '@/utils/apiCall';
// import { useAppSelector } from '@/redux/store';

// export default function TestRegistration({ showRegistration, setShowRegistration }: Readonly<{ showRegistration: boolean, setShowRegistration: (showInstructions: boolean) => void }>) {
//   const [orderDetails, setOrderDetails] = useState({
//     orderId: '',
//     currency: 'INR',
//     amount: 0
//   });

//   const userDetail = useAppSelector((state) => state.user);

//   const handleCreateOrder = async (amount: number, currency: string) => {
//     try {
//       const response = await handlePostMethod(paymentCreateOrderEndpoint, {
//         amount: amount * 100, // Convert to paise (Razorpay expects the smallest unit)
//         currency,
//         name: 'AptiCode',
//         description: 'Test Registration'
//       });
//       if (response instanceof Response) {
//         if (response.status === 403 || response.status === 401) {
//           alert('Please login first!');
//           return;
//         }
//         const order = await response.json();
//         setOrderDetails({
//           orderId: order.order_id,
//           currency: order.currency,
//           amount: order.amount
//         });
//         handleRazorpayPayment(order.order_id, order.amount, order.currency);
//       }
//     } catch (error) {
//       console.error('Error creating order:', error);
//     }
//   };

//   const handleRazorpayPayment = async (orderId: string, amount: number, currency: string) => {
//     const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
//     if (!res) {
//       alert('Razorpay SDK failed to load. Please check your internet connection.');
//       return;
//     }

//     const options = {
//       key: process.env.REACT_APP_RAZORPAY_KEY_ID as string,
//       amount: amount,
//       currency: currency,
//       name: 'AptiCode',
//       order_id: orderId,
//       handler: async (response: any) => {
//         try {
//           const verifyResponse = await handlePostMethod(verifyPaymentEndpoint, {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature
//           });

//           if (verifyResponse.status === 200) {
//             alert('Payment verified successfully');
//           } else {
//             alert('Payment verification failed');
//           }
//         } catch (error) {
//           console.error('Error verifying payment:', error);
//         }
//       },
//       prefill: {
//         name: userDetail.name || 'Test User',
//         email: userDetail.email || 'test@example.com',
//         contact: userDetail.mobile || '9876543210'
//       },
//       theme: {
//         color: '#09090a'
//       }
//     };

//     const rzp1 = new (window as any).Razorpay(options);

//     rzp1.on('payment.failed', (response: any) => {
//       alert(`Payment failed: ${response.error.description}`);
//       console.error('Payment Error:', response.error);
//     });

//     rzp1.open();
//   };

//   const loadRazorpayScript = (src: string) => {
//     return new Promise((resolve) => {
//       if (document.querySelector(`script[src="${src}"]`)) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   return (
//     <Dialog open={showRegistration}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Test Registration</DialogTitle>
//           <DialogDescription>
//             Please pay the amount below to register for the test:
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => setShowRegistration(false)}>
//             Cancel
//           </Button>
//           <Button onClick={() => handleCreateOrder(100, 'INR')}>
//             Place Order
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
