'use client'

import ReduxProvider from "@/redux/redux-provider";
import OwnedTestMainPage from "./mainPage";

export default function OwnedTestDetail() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <OwnedTestMainPage/>
            </main>
        </ReduxProvider>
    )
}