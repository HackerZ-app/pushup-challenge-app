import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getMotivationAction, 
  getTipAction, 
  getPlanAction, 
  getAudioAction 
} from '../../app/actions/geminiActions';

/**
 * Hook for fetching motivational text using Server Actions.
 */
export const useMotivationalBoost = () => {
  const [motivation, setMotivation] = useState(null);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);

  const getBoost = useCallback(async (completedDays, totalDays) => {
    setIsLoadingMotivation(true);
    setMotivation('Thinking of something great for you...');
    try {
      const text = await getMotivationAction(completedDays, totalDays);
      setMotivation(text);
    } catch (error) {
      console.error(error);
      setMotivation('Oops! Could not get a motivational message right now.');
    } finally {
      setIsLoadingMotivation(false);
    }
  }, []);

  return { motivation, isLoadingMotivation, getBoost };
};

/**
 * Hook for fetching workout tips using Server Actions.
 */
export const useWorkoutTip = () => {
  const [workoutTip, setWorkoutTip] = useState(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const getTip = useCallback(async () => {
    setIsLoadingTip(true);
    setWorkoutTip('Generating a tip for you...');
    try {
      const text = await getTipAction();
      setWorkoutTip(text);
    } catch (error) {
      console.error(error);
      setWorkoutTip('Could not retrieve a tip. Please try again.');
    } finally {
      setIsLoadingTip(false);
    }
  }, []);

  return { workoutTip, isLoadingTip, getTip };
};

/**
 * Hook for fetching the dynamic plan using Server Actions.
 */
export const useDynamicPlan = () => {
  const [dynamicPlan, setDynamicPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);

  const getPlan = useCallback(async () => {
    setIsLoadingPlan(true);
    setDynamicPlan(null);
    setPlanError(null);
    try {
      const plan = await getPlanAction();
      setDynamicPlan(plan);
    } catch (error) {
      console.error(error);
      setPlanError('Could not generate the plan. Please check your API key or try again.');
    } finally {
      setIsLoadingPlan(false);
    }
  }, []);

  return { dynamicPlan, isLoadingPlan, planError, getPlan };
};

/**
 * Hook for managing audio motivation using Server Actions and client-side processing.
 */
export const useAudioMotivation = () => {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsAudioPlaying(false);
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const playAudio = useCallback(async (completedDays) => {
    if (isAudioPlaying) {
      cleanup();
      return;
    }

    setIsLoadingAudio(true);
    setIsAudioPlaying(true);

    try {
      const { base64Audio, sampleRate } = await getAudioAction(completedDays);
      
      const pcmData = base64ToArrayBuffer(base64Audio);
      const wavBlob = pcmToWav(pcmData, sampleRate);
      
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      
      const audioUrl = URL.createObjectURL(wavBlob);
      audioUrlRef.current = audioUrl;
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsAudioPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioUrlRef.current = null;
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error(error);
      setIsAudioPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [isAudioPlaying, cleanup]);

  return { isAudioPlaying, isLoadingAudio, playAudio };
};

// --- Audio Helper Functions (Client-side) ---

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function pcmToWav(pcmData, sampleRate) {
  const pcm16 = new Int16Array(pcmData);
  const wavData = new ArrayBuffer(44 + pcm16.length * 2);
  const view = new DataView(wavData);
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcm16.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, pcm16.length * 2, true);

  for (let i = 0; i < pcm16.length; i++) {
    view.setInt16(44 + i * 2, pcm16[i], true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
