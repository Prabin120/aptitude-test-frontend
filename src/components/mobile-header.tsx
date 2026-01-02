"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import Sidebar from "./sidebar"
import LogoFull from "./logo"
import Link from "next/link"
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

export default function MobileHeader() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    if (isExcludedPath(pathname)) return null

    return (
        <div className="md:hidden flex items-center justify-between p-3 border-b bg-card sticky top-0 z-40">
            <Link href="/">
                <LogoFull />
            </Link>

            <div className="flex items-center gap-1">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-[280px] border-r-0">
                        <div className="h-full flex flex-col" onClick={() => setOpen(false)}>
                            <div className="flex-1 overflow-y-auto">
                                <Sidebar isMobile />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
