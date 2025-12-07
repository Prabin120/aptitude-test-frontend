"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { AlignLeft, CircleDollarSign, Coins, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { usePathname, useRouter } from "next/navigation"
import { setAuthState } from "@/redux/auth/authSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import Loading from "@/app/loading"
import { setUserState, userInitialState } from "@/redux/user/userSlice"
import { checkRefresh, handleGetMethod } from "@/utils/apiCall"
import { checkTokenValidation, codeCompileApiEntryPoint, logoutEndpoint } from "@/consts"
import { checkAuthorization } from "@/utils/authorization"
import styles from "@/styles/header.module.css"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

const matchesPattern = (pathname: string, pattern: string) => {
  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
  return regex.test(pathname)
}

const urls = ["/code/*/*", "/apti-zone/*/*/test", "/tests/exam/*", "/online-compiler/*"]

const isExcludedPath = (pathname: string) => {
  for (const url of urls) {
    if (matchesPattern(pathname, url)) {
      return true
    }
  }
  return false
}

const useMobileCheck = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is Tailwind's md breakpoint
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

const Header = () => {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const authenticate = useAppSelector((state) => state.auth.authState)
  const userDetail = useAppSelector((state) => state.user)
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [testMenuOpen, setTestMenuOpen] = useState(false)
  const isMobile = useMobileCheck()

  useEffect(() => {
    authenticate &&
      (async () => {
        const response = await getAutheticationDetail()
        await checkAuthorization(response, dispatch)
        if (response.status !== 200) {
          dispatch(setUserState(userInitialState))
          dispatch(setAuthState(false))
        }
      })()
    setIsClient(true)
  }, [authenticate, dispatch])

  // Close test menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (testMenuOpen && !target.closest("[data-test-menu]")) {
        setTestMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [testMenuOpen])

  // Close test menu when navigating to a new page
  useEffect(() => {
    setTestMenuOpen(false)
  }, [pathname])

  if (isExcludedPath(pathname)) {
    return null // Render nothing if the pathname matches the excluded URLs
  }

  if (!isClient) {
    return <Loading />
  }

  const handleLogout = async () => {
    dispatch(setUserState(userInitialState))
    dispatch(setAuthState(false))
    await handleGetMethod(logoutEndpoint)
    router.push("/login")
  }

  return (
    <header className="container lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <span className="font-bold text-lg">
          <span className="font-serif font-thin">&lt;AptiCode/&gt;</span>.
        </span>
      </Link>
      {!isMobile && (
        <nav className={styles.desktopNav}>
          <Link
            className="text-md font-medium hover:underline underline-offset-4 animate-pulse text-orange-400"
            href="/contribute"
            onClick={() => setIsSheetOpen(false)}
          >
            Earn by Contribution💰
          </Link>

          <Popover open={testMenuOpen} onOpenChange={setTestMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                className="text-sm font-medium hover:underline underline-offset-4 hover:bg-transparent"
                type="button"
                variant="ghost"
                data-test-menu
              >
                TestZone
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0" data-test-menu>
              <div className="py-1">
                <Link
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  href="/group-test"
                  onClick={() => setTestMenuOpen(false)}
                >
                  Group Test
                </Link>
                <Link
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  href="/tests"
                  onClick={() => setTestMenuOpen(false)}
                >
                  Global Test
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/code/problems"
            onClick={() => setIsSheetOpen(false)}
          >
            CodeZone
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/apti-zone"
            onClick={() => setIsSheetOpen(false)}
          >
            AptiZone
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/online-compiler"
            onClick={() => setIsSheetOpen(false)}
          >
            CompilZone
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/about-us"
            onClick={() => setIsSheetOpen(false)}
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/contact-us"
            onClick={() => setIsSheetOpen(false)}
          >
            Contact
          </Link>

          {authenticate ? (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost"
                >
                  <Avatar className="dark">
                    <AvatarImage src={userDetail.image || "/placeholder.svg"} alt={userDetail.name} />
                    <AvatarFallback>{userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Open profile</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Profile</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="dark w-14 h-14">
                      <AvatarImage src={userDetail.image || "/placeholder.svg"} alt={userDetail.name} />
                      <AvatarFallback>{userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{userDetail.name}</h2>
                      <p className="text-sm text-gray-500">{userDetail.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-2">
                    <Link href={"/profile/" + userDetail.username + "/code"} onClick={() => setIsSheetOpen(false)}>
                      <Button className="w-full justify-start" variant="ghost">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
                    <Link href={"/rewards"} onClick={() => setIsSheetOpen(false)}>
                      <Button className="w-full justify-start" variant="ghost">
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        Rewards
                      </Button>
                    </Link>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setIsSheetOpen(false)
                        handleLogout()
                      }}
                      variant="ghost"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Link href={"/login"} onClick={() => setIsSheetOpen(false)}>
              <Button variant="secondary" size="default" className="px-7">
                Login
              </Button>
            </Link>
          )}
        </nav>
      )}
      {isMobile && (
        <nav className="md:hidden ml-auto flex gap-4 sm:gap-6 items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full" size="icon" variant="ghost">
                <AlignLeft />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              {authenticate ? (
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="dark w-14 h-14">
                    <AvatarImage src={userDetail.image || "/placeholder.svg"} alt={userDetail.name} />
                    <AvatarFallback>{userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{userDetail.name}</h2>
                    <p className="text-sm text-gray-500">{userDetail.email}</p>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                  <Button variant="secondary" className="w-full mt-3">
                    Login / SignUp
                  </Button>
                </Link>
              )}
              <div className="p-4 flex flex-col gap-1">
                <Link href="/contribute" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start text-orange-400" variant="ghost">
                    <Coins className="mr-2 h-4 w-4" />
                    Earn by Contribution💰
                  </Button>
                </Link>
                <Link href="/tests" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    Global Test
                  </Button>
                </Link>
                <Link href="/group-test" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    Group Test
                  </Button>
                </Link>
                <Link href="/code/problems" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    CodeZone
                  </Button>
                </Link>
                <Link href="/apti-zone" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    AptiZone
                  </Button>
                </Link>
                <Link href="/online-compiler" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    CompilZone
                  </Button>
                </Link>
                <Link href="/about-us" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    About
                  </Button>
                </Link>
                <Link href="/contact-us" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    Contact
                  </Button>
                </Link>
                {authenticate && (
                  <>
                    <div className="h-px bg-gray-800 my-2"></div>
                    <Link href={"/profile/" + userDetail.username + "/code"} onClick={() => setIsSheetOpen(false)}>
                      <Button className="w-full justify-start" variant="ghost">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
                    <Link href={"/rewards"} onClick={() => setIsSheetOpen(false)}>
                      <Button className="w-full justify-start" variant="ghost">
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        Rewards
                      </Button>
                    </Link>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setIsSheetOpen(false)
                        handleLogout()
                      }}
                      variant="ghost"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      )}
    </header>
  )
}

export default Header
