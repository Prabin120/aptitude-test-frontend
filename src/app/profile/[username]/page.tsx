'use client'

import { redirect, usePathname } from 'next/navigation'

function Profile() {
    const pathname = usePathname()
    redirect(pathname+"/code")
}

export default Profile
