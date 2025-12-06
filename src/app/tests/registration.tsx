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
import { handleRazorpayPayment } from '@/utils/razorpayPaymentModal';

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
                    handleRazorpayPayment(amount, order.order_id, verifyPaymentEndpoint, userDetail.name, userDetail.email
                        , {testId: id})
                }
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
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
