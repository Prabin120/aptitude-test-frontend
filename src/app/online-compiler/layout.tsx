"use client"

import Sidebar from './components/Sidebar';
import ReduxProvider from '@/redux/redux-provider';

export default function CompilerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReduxProvider>
            <div className="flex h-[100vh] overflow-hidden bg-black text-white">
                {/* Sidebar - Fixed width */}
                <Sidebar />

                {/* Main Content - Flex grow */}
                <div className="flex-1 flex flex-col min-w-0">
                    {children}
                </div>
            </div>
        </ReduxProvider>
    );
}
