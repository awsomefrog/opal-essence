'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '../utils/authService';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verify = async () => {
      try {
        const success = await verifyEmail(token);
        if (success) {
          setStatus('success');
        } else {
          setStatus('error');
          setError('Invalid or expired verification link');
        }
      } catch (err) {
        setStatus('error');
        setError('An error occurred during verification');
      }
    };

    verify();
  }, [searchParams]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Verifying your email
          </h2>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p>Please wait while we verify your email address...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Verification Failed
          </h2>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-500"
              >
                Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Email Verified!
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Your email has been successfully verified.
            </p>
            <p className="mb-4">
              You can now log in to your account.
            </p>
            <a
              href="/login"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 