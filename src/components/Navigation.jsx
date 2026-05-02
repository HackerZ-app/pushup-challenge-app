"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import AuthInterface from './AuthInterface';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/stats', label: 'Analytics', icon: '📈' },
  { href: '/community', label: 'Community', icon: '🌍' },
  { href: '/plan', label: 'Dynamic Plan', icon: '📅' },
  { href: '/coach', label: 'AI Coach', icon: '🤖' },
];

const Navigation = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Only show navigation for authenticated users.
  // This keeps the Landing Page and 3D Auth pages clean.
  if (status !== 'authenticated') return null;

  return (
    <nav className="w-full bg-gray-900 shadow-2xl sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">💪</span>
            <span className="text-xl font-extrabold text-white tracking-wide">
              PushUp<span className="text-purple-400">100</span>
            </span>
          </div>

          {/* Nav Links & Auth Cluster */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="flex items-center border-l border-gray-700 pl-4 py-2 relative">
              <AuthInterface />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
