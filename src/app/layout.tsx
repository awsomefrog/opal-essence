'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { CartProvider } from './context/CartContext';
import CartCount from './components/CartCount';
import Link from 'next/link';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Opal Essence - Elegant Jewelry Store</title>
        <meta name="description" content="Discover beautiful, handcrafted jewelry pieces for any occasion" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Opal Essence
                </Link>
                <Link href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/cart">
                  <CartCount />
                </Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="bg-gray-50 border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © 2024 Opal Essence. All rights reserved.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
} 