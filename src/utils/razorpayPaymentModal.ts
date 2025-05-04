import { RazorpaySuccessResponse } from "@/razorpay/interface";
import { handlePostMethod } from "./apiCall";

export const handleRazorpayPayment = async (amount: number, orderId: string, verifyEndPoint: string, name: string,
    email: string, data: object) => {        
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
        return false;
    }
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: amount * 100,
        currency: 'INR',
        name: 'Test Registration',
        order_id: orderId,
        handler: async (response: RazorpaySuccessResponse) => {
            try {
                const verifyResponse = await handlePostMethod(verifyEndPoint, {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    ...data
                });

                if (verifyResponse.status === 200) { 
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                return false;
            }
        },
        prefill: {
            name: name || 'Test User',
            email: email || 'test@example.com',
        },
        theme: {
            color: '#09090a'
        }
    };
    const rzp1 = new window.Razorpay(options)
    rzp1.on('payment.failed', () => {
        console.error('Payment Error:');
        return false
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