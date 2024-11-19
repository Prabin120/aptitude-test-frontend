// src/@types/global.d.ts
declare global {
    interface Window {
        Razorpay: any; // You can replace 'any' with a more specific type if you have one
    }
}

// This line is necessary to make the file a module
export {};