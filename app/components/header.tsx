"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - remains the same */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/menu" className="text-gray-700 hover:text-red-600 font-medium">
              Меню
            </Link>
            <Link href="/locations" className="text-gray-700 hover:text-red-600 font-medium">
              Рестораны
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium">
              О нас
            </Link>
          </nav>

          {/* Auth and Cart Section */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsCartModalOpen(true)} 
              className="p-2 relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity ${isCartUpdating ? 'opacity-0' : 'opacity-100'}`}>
                  {cartItemsCount}
                </span>
              )}
            </button>
            <SignedIn>
              <Link href="/profile" className="text-gray-700 hover:text-red-600 font-medium">
                Мой аккаунт
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                  Войти
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition-colors">
                  Регистрация
                </button>
              </SignUpButton>
            </SignedOut>
          </div>

          {/* Mobile Cart and Menu Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsCartModalOpen(true)} 
              className="p-2 relative"
              aria-label="Корзина"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity ${isCartUpdating ? 'opacity-0' : 'opacity-100'}`}>
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Меню"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - remove the cart button from here since it's now in the header */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pt-4 pb-2 border-t mt-3`}>
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/menu" 
              className="text-gray-700 hover:text-red-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Меню
            </Link>
            <Link 
              href="/locations" 
              className="text-gray-700 hover:text-red-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Рестораны
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-red-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              О нас
            </Link>
            <SignedIn>
              <Link 
                href="/profile" 
                className="text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Мой аккаунт
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  {user?.firstName || 'Пользователь'}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonTrigger: "focus:shadow-none"
                    }
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                  Войти
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition-colors">
                  Регистрация
                </button>
              </SignUpButton>
            </SignedOut>
          </nav>
        </div>
      </div>
      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </header>
  );
} 