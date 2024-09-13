'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'
import { deletingStorageValue, gettingStorageValue, settingStorageValue } from '@/utils/localStorageSaving'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [authenticate, setAuthenticate] = useState(false);
    const [user, setUser] = useState<{name: string, email: string, mobile: string, institute: string, avatarUrl?: string}>();
    const handleLogout = () => {
        deletingStorageValue('authenticated');
        deletingStorageValue('user');
        setAuthenticate(false);
        router.push('/login');
    }
    useEffect(() => {
      const authToken = gettingStorageValue('authenticated')
      if(authToken === 'true'){
        setAuthenticate(true)
      }
      const userDetail = gettingStorageValue('user');
      userDetail && setUser(JSON.parse(userDetail));
    }, [])    
    
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-lg">AptiTest</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
          {authenticate?
          (  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost"
                >
                  <Avatar className="dark">
                    <AvatarImage src={user && user.avatarUrl} alt={user && user.name} />
                    <AvatarFallback>{user && user.name.charAt(0).toUpperCase()}</AvatarFallback>
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
                    <AvatarImage src={user && user.avatarUrl} alt={user && user.name} />
                    <AvatarFallback>{user && user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{user && user.name}</h2>
                      <p className="text-sm text-gray-500">{user && user.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-2">
                      <Link href={"/profile"}>
                          <Button className="w-full justify-start" variant="ghost">
                              <User className="mr-2 h-4 w-4" />
                                  View Profile
                          </Button>
                      </Link>
                    <Button className="w-full justify-start" variant="ghost">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button className="w-full justify-start" onClick={handleLogout} variant="ghost">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>)
          :
          (
            <Link href={"/login"}>
              <Button variant="secondary" size="default" className='px-7'>Login</Button>
            </Link>
          )
          }
        </nav>
      </header>
  )
}

export default Header