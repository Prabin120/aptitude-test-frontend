"use client"

import ReduxProvider from '@/redux/redux-provider';

export default function CompilerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReduxProvider>
            <div className="flex bg-black text-white">
                <div className="flex-1 flex flex-col min-w-0">
                    {children}
                </div>
            </div>
        </ReduxProvider>
    );
}
