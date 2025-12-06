"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {

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

  const pathname = usePathname()
  if (isExcludedPath(pathname)) {
    return null // Render nothing if the pathname matches the excluded URLs
  }

  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} AptiCode. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4" href="/terms-and-conditions">
          Terms and Conditions
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/privacy-policy">
          Privacy Policy
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/shipping-policy">
          Shipping Policy
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/contact-us">
          Contact Us
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/cancelation-and-refunds">
          Cancelation and Refunds
        </Link>
      </nav>
    </footer>
  )
}

export default Footer