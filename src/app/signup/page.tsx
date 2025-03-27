'use client'
import ReduxProvider from "@/redux/redux-provider";
import { SignupForm } from "./signup";


export default function SignupPage() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <div className="container mx-auto px-4 py-12 md:py-24">
                    <div className="mx-auto max-w-[700px]">
                        <SignupForm />
                    </div>
                </div>
            </main>
        </ReduxProvider>
    )
}

