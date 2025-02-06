import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { paymentCreateOrderEndpoint, verifyPaymentEndpoint } from '@/consts';
import { handlePostMethod } from '@/utils/apiCall';
import { useAppSelector } from '@/redux/store';
import { RazorpaySuccessResponse } from '@/razorpay/interface';

interface TestRegistrationProps {
    showRegistration: boolean
    setShowRegistration: (showInstructions: boolean) => void
    id: string
    amount: number
    type: string
}

export default function TestRegistration({ showRegistration, setShowRegistration, id, amount, type }: Readonly<TestRegistrationProps>) {
    const userDetail = useAppSelector((state) => state.user);
    const handleCreateOrder = async () => {
        try {
            setShowRegistration(false);
            const response = await handlePostMethod(paymentCreateOrderEndpoint, {
                testId: id
            });
            if (response instanceof Response) {
                if (response.status === 403 || response.status === 401) {
                    alert('Please login first!');
                    return;
                }
                const order = await response.json();
                if (type === "practice") {
                    alert(order.msg);
                } else {
                    handleRazorpayPayment(order.order_id);
                }
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleRazorpayPayment = async (orderId: string) => {
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Razorpay SDK failed to load. Please check your internet connection.');
            return;
        }

        const options = {
            key: process.env.RAZORPAY_KEY_ID || '',
            amount: amount * 100, // amount in the smallest currency unit
            currency: 'INR',
            name: 'Test Registration',
            order_id: orderId,
            handler: async (response: RazorpaySuccessResponse) => {
                try {
                    const verifyResponse = await handlePostMethod(verifyPaymentEndpoint, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        testId: id
                    });

                    if (verifyResponse.status === 200) {
                        alert('Payment verified successfully');
                    } else {
                        alert('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Error verifying payment:', error);
                }
            },
            prefill: {
                name: userDetail.name || 'Test User',
                email: userDetail.email || 'test@example.com',
                contact: userDetail.mobile || '9876543210'
            },
            theme: {
                color: '#09090a'
            }
        };

        const rzp1 = new window.Razorpay(options)

    rzp1.on('payment.failed', () => {
      alert(`Payment failed`);
      console.error('Payment Error:');
    });

        rzp1.open();
    };

    const loadRazorpayScript = (src: string) => {
        return new Promise((resolve) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    return (
        <Dialog open={showRegistration}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Test Registration</DialogTitle>
                    <DialogDescription>
                        Please pay the amount below to register for the test:
                        <h1 className='text-2xl font-bold mt-2'>₹{amount}</h1>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRegistration(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateOrder}>
                        Place Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
