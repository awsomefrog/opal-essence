'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
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
              <h1 className="text-3xl font-bold text-primary-900">Settings</h1>
              <Link
                href="/profile"
                className="text-primary-600 hover:text-primary-900 transition-colors px-4 py-2 rounded-md border border-primary-200 hover:border-primary-300"
              >
                Back to Profile
              </Link>
            </div>

            <div className="space-y-8">
              {/* Account Settings */}
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <Link
                    href="/profile/settings/account"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Personal Information</h3>
                    <p className="text-primary-600 text-sm mt-1">Update your name, email, and password</p>
                  </Link>
                  <Link
                    href="/profile/settings/notifications"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Notification Preferences</h3>
                    <p className="text-primary-600 text-sm mt-1">Manage your email and push notifications</p>
                  </Link>
                </div>
              </section>

              {/* Payment Settings */}
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Payment Settings</h2>
                <div className="space-y-4">
                  <Link
                    href="/profile/settings/payment"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Payment Methods</h3>
                    <p className="text-primary-600 text-sm mt-1">Add or remove payment methods</p>
                  </Link>
                  <Link
                    href="/profile/settings/billing"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Billing History</h3>
                    <p className="text-primary-600 text-sm mt-1">View your past transactions</p>
                  </Link>
                </div>
              </section>

              {/* Shipping Settings */}
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Shipping Settings</h2>
                <div className="space-y-4">
                  <Link
                    href="/profile/settings/addresses"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Shipping Addresses</h3>
                    <p className="text-primary-600 text-sm mt-1">Manage your shipping addresses</p>
                  </Link>
                  <Link
                    href="/profile/settings/preferences"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Shipping Preferences</h3>
                    <p className="text-primary-600 text-sm mt-1">Set your default shipping options</p>
                  </Link>
                </div>
              </section>

              {/* Privacy Settings */}
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Privacy & Security</h2>
                <div className="space-y-4">
                  <Link
                    href="/profile/settings/privacy"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Privacy Settings</h3>
                    <p className="text-primary-600 text-sm mt-1">Manage your privacy preferences</p>
                  </Link>
                  <Link
                    href="/profile/settings/security"
                    className="block p-4 rounded-md border border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary-900">Security Settings</h3>
                    <p className="text-primary-600 text-sm mt-1">Configure two-factor authentication and security options</p>
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