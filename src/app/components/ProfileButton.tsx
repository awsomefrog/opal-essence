'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function ProfileButton() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-primary-600 hover:text-primary-900 transition-colors px-4 py-2 rounded-md border border-primary-200 hover:border-primary-300"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-900 transition-colors px-4 py-2 rounded-md border border-primary-200 hover:border-primary-300"
      >
        <span>{user.name}</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-accent-light border border-primary-200">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/profile/settings"
              className="block px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 