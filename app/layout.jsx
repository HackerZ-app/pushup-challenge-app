import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../src/components/AuthProvider';
import { PushupProvider } from '../src/context/PushupContext';
import Navigation from '../src/components/Navigation';
import AnimatedBackground from '../src/components/AnimatedBackground';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'PushUp100 | 100-Day Push-up Challenge',
  description: 'Transform your fitness with our AI-powered 100-day push-up challenge. Track progress, compete on leaderboards, and get personalized coaching.',
  keywords: 'pushup, fitness, challenge, workout, AI coach, exercise tracker',
};

export const viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#050508]`}>
      <body className="min-h-screen bg-[#050508] font-sans text-gray-100 antialiased">
        <AuthProvider>
          <PushupProvider>
            {/* Premium animated background */}
            <AnimatedBackground />

            {/* Navigation bar */}
            <Navigation />

            {/* Main content */}
            <main className="w-full relative z-10">
              {children}
            </main>
          </PushupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
