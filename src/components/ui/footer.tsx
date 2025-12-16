"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Twitter, Linkedin, Heart } from 'lucide-react'
import LogoFull from '../logo'

const Footer = () => {

  const matchesPattern = (pathname: string, pattern: string) => {
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
    return regex.test(pathname)
  }

  const urls = ["/coding/*/*", "/aptitude/*/*/test", "/tests/exam/*", "/online-compiler/*"]

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
    return null
  }

  return (
    <footer className="w-full border-t border-zinc-800 bg-black text-zinc-400">
      <div className="container px-4 md:px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <LogoFull />
            </Link>
            <p className="text-sm leading-relaxed">
              The ultimate platform for developers to practice, compete, and grow. Join our community of passionate coders today.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* <Link href="https://github.com/apticode" className="hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link> */}
              <Link href="https://twitter.com/apticode" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com/company/apticode" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Platform</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/coding/problems" className="hover:text-primary transition-colors">Problems</Link>
              <Link href="/online-compiler" className="hover:text-primary transition-colors">Compiler</Link>
              <Link href="/aptitude" className="hover:text-primary transition-colors">Aptitude Tests</Link>
              <Link href="/group-test" className="hover:text-primary transition-colors">Contests</Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Company</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact-us" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/rewards" className="hover:text-primary transition-colors">Rewards</Link>
              <Link href="/contribute" className="hover:text-primary transition-colors">Contribute</Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Legal</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
              <Link href="/cancelation-and-refunds" className="hover:text-primary transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} AptiCode. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-xs text-zinc-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for developers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer