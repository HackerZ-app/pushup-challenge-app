"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getProgress, saveProgress, resetProgressAction } from '../../app/actions/progressActions';

// Constants for the challenge configuration.
const TOTAL_DAYS = 100;
const BASE_PUSHUPS = 20;
const DAILY_INCREASE = 1;

// Create the context.
const PushupContext = createContext(null);

// Helper: Generate the default 100-day data array.
const generateDefaultData = () =>
  Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const day = index + 1;
    return {
      day,
      target: BASE_PUSHUPS + (day - 1) * DAILY_INCREASE,
      isCompleted: false,
    };
  });

// Compute the progress message from the data.
const computeMessage = (data) => {
  if (!data) return 'Loading progress...';
  const completedDays = data.filter((d) => d.isCompleted).length;
  if (completedDays === TOTAL_DAYS) {
    return "🥳 Congratulations! You've completed the challenge!";
  }
  if (completedDays > 0) {
    return `Way to go! You've completed ${completedDays} of ${TOTAL_DAYS} days.`;
  }
  return 'Click a day to get started!';
};

// Provider component that wraps the app and supplies pushup state globally.
export const PushupProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [pushupData, setPushupData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [message, setMessage] = useState('Loading...');
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch data from MongoDB when authenticated.
  useEffect(() => {
    const initData = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        setPushupData(generateDefaultData());
        setBadges([]);
        setMessage('Sign in to save your progress!');
        setIsLoaded(true);
        return;
      }

      if (status === 'authenticated' && session?.user?.email) {
        setIsLoaded(false);
        setMessage('Fetching your progress...');
        try {
          const result = await getProgress(session.user.email);
          if (result) {
            const { pushupData: data, badges: userBadges } = result;
            // Ensure target exists for legacy records
            const normalizedData = data.map((d) => ({
              ...d,
              target: d.target || (BASE_PUSHUPS + (d.day - 1) * DAILY_INCREASE)
            }));
            setPushupData(normalizedData);
            setBadges(userBadges || []);
            setMessage(computeMessage(normalizedData));
          } else {
            // New user: Generate defaults and save to DB
            const defaultData = generateDefaultData();
            setPushupData(defaultData);
            setBadges([]);
            setMessage(computeMessage(defaultData));
            await saveProgress(session.user.email, defaultData);
          }
        } catch (err) {
          console.error('Failed to initialize pushup data:', err);
          setMessage('Error loading progress. Please try again.');
        } finally {
          setIsLoaded(true);
        }
      }
    };
    initData();
  }, [status, session]);

  // Handler function to toggle a day's completion status.
  const handleDayClick = useCallback(async (dayToUpdate) => {
    if (status !== 'authenticated' || !session?.user?.email) {
      alert('Please sign in with Google to save your progress!');
      return;
    }

    if (!pushupData) return;

    // Optimistic Update: Update React state immediately
    const updatedData = pushupData.map((day) =>
      day.day === dayToUpdate ? { ...day, isCompleted: !day.isCompleted } : day
    );
    
    setPushupData(updatedData);
    setMessage(computeMessage(updatedData));

    // Sync with MongoDB in the background
    try {
      await saveProgress(session.user.email, updatedData);
      
      // Re-fetch progress to update badges if a milestone was reached
      const result = await getProgress(session.user.email);
      if (result?.badges) {
        setBadges(result.badges);
      }
    } catch (err) {
      console.error('Failed to sync progress to database:', err);
    }
  }, [pushupData, session, status]);

  // Reset progress logic
  const resetProgress = useCallback(async () => {
    if (!session?.user?.email) return;
    if (!window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) return;

    try {
      await resetProgressAction(session.user.email);
      const defaultData = generateDefaultData();
      setPushupData(defaultData);
      setBadges([]);
      setMessage(computeMessage(defaultData));
      await saveProgress(session.user.email, defaultData);
    } catch (err) {
      console.error('Failed to reset progress:', err);
    }
  }, [session]);

  const value = {
    pushupData: pushupData || [], 
    badges,
    message,
    handleDayClick,
    resetProgress,
    TOTAL_DAYS,
    isLoaded,
  };

  return (
    <PushupContext.Provider value={value}>
      {children}
    </PushupContext.Provider>
  );
};

// Custom hook for consuming the context with a safety check.
export const usePushup = () => {
  const context = useContext(PushupContext);
  if (!context) {
    throw new Error('usePushup must be used within a PushupProvider');
  }
  return context;
};

export default PushupContext;
