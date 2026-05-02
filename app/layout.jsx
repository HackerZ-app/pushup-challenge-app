import './globals.css';
import AuthProvider from '../src/components/AuthProvider';
import { PushupProvider } from '../src/context/PushupContext';
import Navigation from '../src/components/Navigation';
import AnimatedBackground from '../src/components/AnimatedBackground';

export const metadata = {
  title: '100-Day Push-up Challenge',
  description: 'Track your fitness journey and get AI-powered coaching.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 font-sans text-gray-100 antialiased">
        <AuthProvider>
          <PushupProvider>
            {/* The animated aurora background sits behind everything */}
            <AnimatedBackground />

            {/* The Navigation bar with the Login button */}
            <Navigation />

            {/* The main page content */}
            <main className="w-full relative z-10">
              {children}
            </main>
          </PushupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}