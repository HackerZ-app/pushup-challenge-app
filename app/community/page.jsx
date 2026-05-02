import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getLeaderboardData } from '../actions/communityActions';
import LeaderboardClient from '../../src/components/LeaderboardClient';

export const metadata = {
  title: 'Community Leaderboard · PushUp100',
  description: 'See how you rank against the entire PushUp100 community.',
};

// Revalidate every 5 minutes so data stays fresh without blocking every request.
export const revalidate = 300;

export default async function CommunityPage() {
  // Fetch leaderboard data and current user session in parallel.
  const [users, session] = await Promise.all([
    getLeaderboardData(),
    getServerSession(authOptions).catch(() => null),
  ]);

  const currentUserId = session?.user?.email ?? null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 md:py-14">
      <div className="max-w-3xl mx-auto">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Live Rankings</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500" />
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Community{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Leaderboard
            </span>
          </h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base max-w-md mx-auto">
            The top {users.length} athletes ranked by total reps completed. Keep pushing!
          </p>
        </div>

        {/* ── Glass Card Container ── */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/60 rounded-3xl p-6 md:p-8 shadow-2xl">

          {/* Summary bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/60">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="text-white font-black text-sm">{users.length} Athletes</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">on the board</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-400 font-black text-sm">
                {users.reduce((s, u) => s + u.totalReps, 0).toLocaleString()}
              </p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">total reps logged</p>
            </div>
          </div>

          {/* Leaderboard (client-animated) */}
          <LeaderboardClient users={users} currentUserId={currentUserId} />
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-xs mt-6 font-medium">
          Rankings refresh every 5 minutes · Sorted by total push-ups completed
        </p>
      </div>
    </div>
  );
}
