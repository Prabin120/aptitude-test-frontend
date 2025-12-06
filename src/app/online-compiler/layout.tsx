import type { Metadata } from 'next';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
    title: 'Online Compiler',
    description: 'Run code online',
};

export default function CompilerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[100vh] overflow-hidden bg-black text-white">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content - Flex grow */}
            <div className="flex-1 flex flex-col min-w-0">
                {children}
            </div>
        </div>
    );
}
