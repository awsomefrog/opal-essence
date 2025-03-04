'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-primary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-accent-light rounded-lg shadow-sm border border-primary-200 overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-primary-900">My Account</h1>
              <Link
                href="/profile/settings"
                className="text-primary-600 hover:text-primary-900 transition-colors px-4 py-2 rounded-md border border-primary-200 hover:border-primary-300"
              >
                Settings
              </Link>
            </div>

            <div className="space-y-8">
              {/* Account Information */}
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Account Information</h2>
                <div className="bg-white p-4 rounded-md border border-primary-200">
                  <p className="text-primary-600">Email: {user.email}</p>
                </div>
              </section>

              {/* Quick Links */}
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/orders"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Order History</h3>
                    <p className="text-primary-600 text-sm mt-1">View your past orders</p>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Wishlist</h3>
                    <p className="text-primary-600 text-sm mt-1">View your saved items</p>
                  </Link>
                  <Link
                    href="/profile/settings/payment"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Payment Methods</h3>
                    <p className="text-primary-600 text-sm mt-1">Manage your payment options</p>
                  </Link>
                  <Link
                    href="/profile/settings/addresses"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Addresses</h3>
                    <p className="text-primary-600 text-sm mt-1">Manage your shipping addresses</p>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 