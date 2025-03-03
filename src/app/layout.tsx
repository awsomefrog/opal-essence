'use client';

import React, { useEffect, useState } from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from './context/CartContext';
import CartCount from './components/CartCount';
import { isAuthenticated, logout, getCurrentUser } from './utils/authService';
import { useRouter } from 'next/navigation';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elegant Jewelry Store",
  description: "Find beautiful, handcrafted jewelry pieces for any occasion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-xl font-bold text-gray-900">
                  Elegant Jewelry
                </a>
                <a href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </a>
                <a href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
                <a href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </a>
              </div>
              
              <div className="flex items-center space-x-6">
                {isLoggedIn ? (
                  <>
                    <span className="text-sm text-gray-600">
                      Welcome, {user?.name}
                    </span>
                    <a href="/orders" className="text-gray-600 hover:text-gray-900">
                      Orders
                    </a>
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <a href="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </a>
                )}
                <CartCount />
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="bg-gray-50 border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © 2024 Elegant Jewelry. All rights reserved.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
} 