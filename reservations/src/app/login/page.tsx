'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        {/* Back to home link */}
        <div className="flex items-center justify-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* VOIS Logo */}
        <div className="flex justify-center mb-8 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900">VOIS</h1>
              <p className="text-sm text-gray-500 -mt-1">Office Reservations</p>
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Welcome back
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Sign in to your account to manage your reservations
        </p>



      <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                socialButtonsBlockButtonText: 'font-normal',
                formFieldInput: 'border-gray-300 focus:border-red-500 focus:ring-red-500',
                footerActionLink: 'text-red-600 hover:text-red-700',
              },
            }}
            redirectUrl="/"
            signUpUrl="/signup"
          />
      </div>




    </div>
  );
}
