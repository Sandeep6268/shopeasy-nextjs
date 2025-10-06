// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const forgotPasswordToast = toast.loading('Sending reset instructions...');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset instructions sent to your email!', { id: forgotPasswordToast });
        setIsSubmitted(true);
        
        // For testing - show reset link in console
        if (data.resetLink) {
          console.log('🔗 Reset Link:', data.resetLink);
        }
      } else {
        toast.error(data.error || 'Failed to send reset instructions', { id: forgotPasswordToast });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset instructions', { id: forgotPasswordToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">Check Your Email</h3>
            <p className="mt-4 text-sm text-gray-600">
              We've sent password reset instructions to:
            </p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{email}</p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                📧 If you don't see the email, check your spam folder or try again.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Back to Sign In
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Try Another Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>You must have access to this email account to reset your password.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}