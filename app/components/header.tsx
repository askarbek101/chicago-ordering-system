"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import logo from "../images/logo.png"; // You'll need to add your logo image
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cartService } from "../utils/cartService";
import { CartModal } from "./CartModal";

export function Header() {
  const { user } = useUser();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isCartUpdating, setIsCartUpdating] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      setIsCartUpdating(true);
      setCartItemsCount(cartService.getItemCount());
      // Add a small delay to show the transition
      setTimeout(() => setIsCartUpdating(false), 300);
    };

    // Initial count
    updateCartCount();

    // Subscribe to cart changes
    cartService.addListener(updateCartCount);

    return () => {
      cartService.removeListener(updateCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src={logo} 
            alt="ChicagoGO Logo" 
            width={50} 
            height={50} 
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-red-600">ChicagoGO</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
            Menu
          </Link>
          <Link href="/locations" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
            Locations
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
            About Us
          </Link>
        </nav>

        {/* Auth and Cart Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/profile" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              My Account
            </Link>
          </SignedIn>
          
          {/* Cart Button with Animation */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsCartModalOpen(true);
            }}
            className="relative p-2 text-gray-700 hover:text-red-600 transition-colors group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 transition-transform duration-200 ${isCartUpdating ? 'scale-110' : 'scale-100'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <span 
              className={`
                absolute top-0 right-0 
                inline-flex items-center justify-center 
                min-w-[20px] h-5 px-1.5 
                text-xs font-bold leading-none text-white 
                transform translate-x-1/2 -translate-y-1/2 
                bg-red-600 rounded-full
                transition-all duration-300
                ${isCartUpdating ? 'scale-110 bg-red-500' : 'scale-100'}
                ${cartItemsCount === 0 ? 'opacity-0 scale-0' : 'opacity-100'}
              `}
            >
              {cartItemsCount}
            </span>
          </button>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </header>
  );
} 