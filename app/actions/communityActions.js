"use server";

import connectToDatabase from '../../lib/mongodb';
import UserProgress from '../../models/UserProgress';

/**
 * Calculates the sequential streak (consecutive completed days from day 1).
 */
function calcStreak(pushupData) {
  const sorted = [...pushupData].sort((a, b) => a.day - b.day);
  let streak = 0;
  for (const day of sorted) {
    if (day.isCompleted) streak++;
    else break;
  }
  return streak;
}

/**
 * Calculates total push-up reps across all completed days.
 */
function calcTotalReps(pushupData) {
  return pushupData.reduce((acc, day) => {
    return day.isCompleted ? acc + (day.target || 0) : acc;
  }, 0);
}

/**
 * Fetches and ranks the top 50 users by totalReps (then streak as tiebreaker).
 * Returns plain, serializable objects safe to pass to Client Components.
 */
export async function getLeaderboardData() {
  try {
    await connectToDatabase();

    // Fetch all user records. Select only needed fields to minimise data transfer.
    const records = await UserProgress.find({}, 'userId pushupData').lean();

    const leaderboard = records.map((record) => {
      const pushupData = record.pushupData || [];

      // userId is stored as the user's Google email (e.g. "john@gmail.com")
      // Derive a friendly display name from the email local-part.
      const email = String(record.userId || '');
      const localPart = email.includes('@') ? email.split('@')[0] : email;
      // Capitalise first letter and replace dots/underscores with spaces
      const displayName = localPart
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Athlete';

      const totalReps = calcTotalReps(pushupData);
      const currentStreak = calcStreak(pushupData);
      const daysCompleted = pushupData.filter((d) => d.isCompleted).length;

      return {
        id: email,           // used to highlight current user's row
        name: displayName,
        image: null,         // Google avatar URL is only in the active session, not UserProgress
        totalReps,
        currentStreak,
        daysCompleted,
      };
    });

    // Sort: primaryby totalReps desc, secondary by currentStreak desc
    leaderboard.sort((a, b) => {
      if (b.totalReps !== a.totalReps) return b.totalReps - a.totalReps;
      return b.currentStreak - a.currentStreak;
    });

    // Return top 50, strictly plain JSON
    return JSON.parse(JSON.stringify(leaderboard.slice(0, 50)));
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
}
