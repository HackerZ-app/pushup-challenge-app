"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LandingPage from '../src/components/LandingPage';

/**
 * Main Page Entry: Shows Landing Page for unauthenticated users,
 * redirects to Dashboard for authenticated users.
 */
const Page = () => {
  const { status } = useSession();
  const router = useRouter();

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
        </div>
        <p className="mt-4 text-purple-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // Authenticated: Redirect to Dashboard
  if (status === 'authenticated') {
    router.push('/dashboard');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
        </div>
        <p className="mt-4 text-purple-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  // Unauthenticated: Show Landing Page
  return <LandingPage />;
};

export default Page;
