import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getLeaderboardData } from '../actions/communityActions';
import LeaderboardClient from '../../src/components/LeaderboardClient';

export const metadata = {
  title: 'Community Leaderboard | PushUp100',
  description: 'See how you rank against the entire PushUp100 community.',
};

export const revalidate = 300;

export default async function CommunityPage() {
  const [users, session] = await Promise.all([
    getLeaderboardData(),
    getServerSession(authOptions).catch(() => null),
  ]);

  const currentUserId = session?.user?.email ?? null;

  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-12 relative">
          {/* Background decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-yellow-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6 backdrop-blur-xl">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Live Rankings</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight relative">
            Community{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500">
                Leaderboard
              </span>
            </span>
          </h1>
          <p className="mt-4 text-gray-400 font-medium text-sm md:text-base max-w-lg mx-auto">
            The top {users.length} athletes ranked by total reps completed. Keep pushing!
          </p>

          {/* Global stats */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <span className="text-2xl">🌍</span>
              <div className="text-left">
                <p className="text-white font-black text-lg">{users.length}</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Athletes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <span className="text-2xl">💪</span>
              <div className="text-left">
                <p className="text-purple-400 font-black text-lg">
                  {users.reduce((s, u) => s + u.totalReps, 0).toLocaleString()}
                </p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Total Reps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Glass Container */}
        <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '32px 32px' 
            }} 
          />
          
          {/* Leaderboard */}
          <LeaderboardClient users={users} currentUserId={currentUserId} />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8 font-medium">
          Rankings refresh every 5 minutes | Sorted by total push-ups completed
        </p>
      </div>
    </div>
  );
}
