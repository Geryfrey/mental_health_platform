"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              SWAP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-teal-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors">
              How It Works
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">
              Contact
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="outline" className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-teal-100">
              <Link
                href="#features"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full bg-white text-teal-600 border-teal-200">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-600">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
