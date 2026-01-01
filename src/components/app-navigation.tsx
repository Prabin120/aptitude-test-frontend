"use client"

import Sidebar from "@/components/sidebar"
import MobileHeader from "@/components/mobile-header"
import ReduxProvider from "@/redux/redux-provider"
import { usePathname } from "next/navigation"

const urls = ["/coding/*/*", "/aptitude/*/*/test", "/tests/exam/*", "/online-compiler/*"]

const matchesPattern = (pathname: string, pattern: string) => {
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
    return regex.test(pathname)
}

const isExcludedPath = (pathname: string) => {
    for (const url of urls) {
        if (matchesPattern(pathname, url)) {
            return true
        }
    }
    return false
}

export default function AppNavigation({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // We don't want the sidebar/header on certain pages (like the full-screen compiler)
    const hidden = isExcludedPath(pathname)

    return (
        <ReduxProvider>
            <div className="flex flex-col md:flex-row min-h-screen">
                {!hidden && <MobileHeader />}
                {!hidden && <Sidebar />}
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </ReduxProvider>
    )
}
