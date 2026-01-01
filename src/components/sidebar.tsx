"use client"

import { useState, useEffect } from "react"
import {
    PanelLeftClose,
    PanelLeftOpen,
    Code,
    Brain,
    Terminal,
    User,
    FileText,
    CircleDollarSign,
    LogOut,
    Coins,
    Info,
    Phone,
    Trophy,
    Users,
    BookOpen
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState, userInitialState } from "@/redux/user/userSlice"
import { handleGetMethod, checkRefresh } from "@/utils/apiCall"
import { logoutEndpoint, codeCompileApiEntryPoint, checkTokenValidation } from "@/consts"
import { checkAuthorization } from "@/utils/authorization"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import LogoFull from "./logo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { LucideIcon } from "lucide-react"

interface NavItem {
    label: string
    href: string
    icon: LucideIcon
    color?: string
    badge?: string
}

const getAutheticationDetail = async () => {
    const response = await fetch(codeCompileApiEntryPoint + checkTokenValidation, {
        method: "GET",
        credentials: "include",
    })
    if (response.status === 401 || response.status === 403) {
        const refreshValid = await checkRefresh()
        if (refreshValid.status === 200) {
            return refreshValid
        }
    }
    return response
}

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const authenticate = useAppSelector((state) => state.auth.authState)
    const userDetail = useAppSelector((state) => state.user)

    useEffect(() => {
        setMounted(true)
        if (authenticate) {
            (async () => {
                const response = await getAutheticationDetail()
                await checkAuthorization(response, dispatch)
                if (response.status !== 200) {
                    dispatch(setUserState(userInitialState))
                    dispatch(setAuthState(false))
                }
            })()
        }
    }, [authenticate, dispatch])

    const handleLogout = async () => {
        dispatch(setUserState(userInitialState))
        dispatch(setAuthState(false))
        await handleGetMethod(logoutEndpoint)
        router.push("/login")
    }

    const mainNavItems: NavItem[] = [
        { label: "Earn by Contribution", href: "/contribute", icon: Coins, color: "text-orange-400" },
        { label: "CodeZone", href: "/coding/problems", icon: Code },
        { label: "AptiZone", href: "/aptitude", icon: Brain },
        { label: "CompilZone", href: "/online-compiler", icon: Terminal },
        { label: "Blogs", href: "/blogs", icon: BookOpen },
        { label: "Global Test", href: "/tests", icon: Trophy },
        { label: "Group Test", href: "/group-test", icon: Users },
    ]

    const secondaryNavItems: NavItem[] = [
        { label: "About", href: "/about-us", icon: Info },
        { label: "Contact", href: "/contact-us", icon: Phone },
    ]

    const userActions: NavItem[] = [
        { label: "View Profile", href: `/profile/${userDetail.username}/code`, icon: User },
        { label: "My Notes", href: "/notes", icon: FileText },
        { label: "Rewards", href: "/rewards", icon: CircleDollarSign },
    ]

    if (!mounted) return null

    const NavLink = ({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        const content = (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group mb-1",
                    isActive
                        ? "bg-muted text-foreground font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
            >
                <Icon className={cn("w-5 h-5 shrink-0", item.color)} />
                {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
            </Link>
        )

        if (isCollapsed) {
            return (
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {content}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }

        return content
    }

    return (
        <aside
            className={cn(
                "flex flex-col h-full bg-card transition-all duration-300 z-50",
                !isMobile ? "hidden md:flex sticky top-0 border-r h-screen" : "w-full",
                !isMobile && (collapsed ? "w-[70px]" : "w-[260px]")
            )}
        >
            {/* Header / Logo */}
            <div className={cn("p-4 flex items-center mb-4 transition-all duration-300", (collapsed && !isMobile) ? "flex-col gap-4" : "justify-between")}>
                {(!collapsed || isMobile) ? (
                    <Link href="/" className="flex items-center gap-2 overflow-hidden border-b-0">
                        <LogoFull />
                    </Link>
                ) : (
                    <Link href="/" className="flex items-center justify-center w-full">
                        <img src="/logo.svg" alt="AptiCode" className="w-8 h-8" />
                    </Link>
                )}
                {!isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300",
                            collapsed && "mt-2"
                        )}
                    >
                        {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 px-3">
                <div className="space-y-4">
                    {/* Main Nav */}
                    <div>
                        {!collapsed && <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase mb-2">Platform</p>}
                        {mainNavItems.map((item) => (
                            <NavLink key={item.href} item={item} isCollapsed={collapsed} />
                        ))}
                    </div>

                    {/* Secondary Nav */}
                    <div>
                        {!collapsed && <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase mb-2">AptiCode</p>}
                        {secondaryNavItems.map((item) => (
                            <NavLink key={item.href} item={item} isCollapsed={collapsed} />
                        ))}
                    </div>
                </div>
            </ScrollArea>

            {/* Footer / User Profile */}
            <div className="p-3 border-t bg-muted/20">
                {authenticate ? (
                    <div className="space-y-1">
                        {!collapsed && <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase mb-2">Account</p>}
                        {userActions.map((item) => (
                            <NavLink key={item.href} item={item} isCollapsed={collapsed} />
                        ))}

                        {/* Logout Button */}
                        {collapsed ? (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Log out</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm"
                            >
                                <LogOut className="w-5 h-5 shrink-0" />
                                <span>Log out</span>
                            </button>
                        )}

                        {!collapsed && (
                            <div className="flex items-center gap-3 mt-4 p-2 rounded-xl bg-card border shadow-sm">
                                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                                    <AvatarImage src={userDetail.image || "/placeholder.svg"} />
                                    <AvatarFallback>{userDetail.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold truncate text-foreground">{userDetail.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{userDetail.email}</p>
                                </div>
                            </div>
                        )}
                        {collapsed && (
                            <div className="mt-4 flex justify-center">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={userDetail.image || "/placeholder.svg"} />
                                    <AvatarFallback>{userDetail.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {collapsed ? (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href="/login"
                                            className="w-full flex items-center justify-center p-2 rounded-lg bg-primary text-primary-text hover:bg-primary/90 transition-colors"
                                        >
                                            <LogOut className="w-5 h-5 rotate-180" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Login</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <Link href="/login" className="block">
                                <Button className="w-full bg-primary text-primary-text hover:bg-primary/90">
                                    Login / Signup
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </aside>
    )
}
