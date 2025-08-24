import React, { useState, useEffect, useRef } from 'react';

// Main App component for the push-up tracker dashboard.
const App = () => {
  // Use a constant for the total number of days in the challenge.
  const TOTAL_DAYS = 100;

  // Use a constant for the initial number of push-ups.
  const BASE_PUSHUPS = 20;

  // Use a constant for the daily increase.
  const DAILY_INCREASE = 1;

  // useState hook to manage the data for each day of the challenge.
  const [pushupData, setPushupData] = useState([]);

  // useState hook to manage the user's progress message.
  const [message, setMessage] = useState('Click a day to get started!');

  // useState hook for the motivational message from the LLM.
  const [motivation, setMotivation] = useState(null);

  // useState hook to manage the workout tip from the LLM.
  const [workoutTip, setWorkoutTip] = useState(null);

  // useState hook to store the dynamic plan from the LLM.
  const [dynamicPlan, setDynamicPlan] = useState(null);

  // useState hooks to track loading states for each API call.
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // useRef hook to store the AudioContext and audio source.
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);

  // useEffect hook to initialize the pushupData array when the component mounts.
  useEffect(() => {
    // Generate the push-up data for all 100 days.
    const initialData = Array.from({ length: TOTAL_DAYS }, (_, index) => {
      const day = index + 1;
      const targetPushups = BASE_PUSHUPS + (day - 1) * DAILY_INCREASE;
      return {
        day,
        target: targetPushups,
        isCompleted: false, // All days start as uncompleted.
      };
    });
    setPushupData(initialData);

    // Clean up AudioContext when the component unmounts.
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handler function to toggle a day's completion status.
  const handleDayClick = (dayToUpdate) => {
    const updatedData = pushupData.map(day => {
      if (day.day === dayToUpdate) {
        // Toggle the completion status for the clicked day.
        return { ...day, isCompleted: !day.isCompleted };
      }
      return day;
    });

    setPushupData(updatedData);
    updateMessage(updatedData);
  };

  // Function to update the motivational message based on progress.
  const updateMessage = (data) => {
    const completedDays = data.filter(day => day.isCompleted).length;
    if (completedDays === TOTAL_DAYS) {
      setMessage("🥳 Congratulations! You've completed the challenge!");
    } else if (completedDays > 0) {
      setMessage(`Way to go! You've completed ${completedDays} of ${TOTAL_DAYS} days.`);
    } else {
      setMessage('Click a day to get started!');
    }
  };

  // Async function to get a motivational message from the Gemini API.
  const getMotivationalBoost = async () => {
    setIsLoadingMotivation(true);
    setMotivation('Thinking of something great for you...');
    try {
      const completedDays = pushupData.filter(day => day.isCompleted).length;
      const progressPercent = Math.round((completedDays / TOTAL_DAYS) * 100);

      const prompt = `You are a personal fitness coach. The user is on a 100-day push-up challenge. They have completed ${completedDays} out of ${TOTAL_DAYS} days. Their progress is ${progressPercent}%. Give them a short, encouraging, and highly motivating message to keep them going. Keep the message to a single, concise paragraph.`;
      
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setMotivation(result.candidates[0].content.parts[0].text);
      } else {
        setMotivation('Oops! Could not get a motivational message right now. Try again later.');
      }
    } catch (error) {
      console.error("Error fetching motivation:", error);
      setMotivation('Oops! Something went wrong. Please check your connection and try again.');
    } finally {
      setIsLoadingMotivation(false);
    }
  };

  // Async function to get a workout tip from the Gemini API.
  const getWorkoutTip = async () => {
    setIsLoadingTip(true);
    setWorkoutTip('Generating a tip for you...');
    try {
      const prompt = `You are a fitness expert. Provide one single, concise, and helpful tip for improving push-up form or a related workout. Do not include any greetings or salutations.`;
      
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setWorkoutTip(result.candidates[0].content.parts[0].text);
      } else {
        setWorkoutTip('Could not retrieve a tip. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching tip:", error);
      setWorkoutTip('An error occurred. Please try again later.');
    } finally {
      setIsLoadingTip(false);
    }
  };

  // Async function to get a dynamic challenge plan from the Gemini API.
  const getDynamicPlan = async () => {
    setIsLoadingPlan(true);
    setDynamicPlan(null); // Clear previous plan
    try {
      const prompt = `Generate a 7-day push-up challenge plan. The plan should be a series of days with a different focus or exercise for each day. For each day, also include a 'visual_aid_search_term' field that is a concise, descriptive term for a good visual for the exercise (e.g., "proper push-up form" or "diamond push-up tutorial"). Ensure the total number of days is 7.`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { 
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                "day": { "type": "NUMBER" },
                "description": { "type": "STRING" },
                "visual_aid_search_term": { "type": "STRING" }
              },
              "propertyOrdering": ["day", "description", "visual_aid_search_term"]
            }
          }
        }
      };
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedPlan = JSON.parse(jsonText);
        setDynamicPlan(parsedPlan);
      } else {
        setDynamicPlan([{ day: 0, description: 'Could not generate a plan. Please try again.', visual_aid_search_term: null }]);
      }
    } catch (error) {
      console.error("Error fetching dynamic plan:", error);
      setDynamicPlan([{ day: 0, description: 'An error occurred. Please try again later.', visual_aid_search_term: null }]);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Helper function to convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Helper function to convert PCM audio data to WAV format
  const pcmToWav = (pcmData, sampleRate) => {
    const pcm16 = new Int16Array(pcmData);
    const wavData = new ArrayBuffer(44 + pcm16.length * 2);
    const view = new DataView(wavData);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // RIFF chunk length
    view.setUint32(4, 36 + pcm16.length * 2, true);
    // WAV format
    writeString(view, 8, 'WAVE');
    // fmt chunk
    writeString(view, 12, 'fmt ');
    // fmt chunk length
    view.setUint32(16, 16, true);
    // audio format (PCM)
    view.setUint16(20, 1, true);
    // number of channels
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate
    view.setUint32(28, sampleRate * 2, true);
    // block align
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, pcm16.length * 2, true);

    // Write PCM audio data
    for (let i = 0; i < pcm16.length; i++) {
      view.setInt16(44 + i * 2, pcm16[i], true);
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Async function to get and play an audio motivational message from the Gemini API.
  const getAudioMotivationalBoost = async () => {
    if (isAudioPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        setIsAudioPlaying(false);
      }
      return;
    }

    setIsLoadingAudio(true);
    setIsAudioPlaying(true);
    try {
      const completedDays = pushupData.filter(day => day.isCompleted).length;
      const promptText = completedDays > 0 
        ? `Say cheerfully: You've completed ${completedDays} days! Keep up the great work and follow your plan to reach your goal!`
        : `Say cheerfully: Welcome to the push-up challenge! Let's get started and crush your goals!`;

      const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }
          }
        },
        model: "gemini-2.5-flash-preview-tts"
      };

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
        const pcmData = base64ToArrayBuffer(audioData);
        const wavBlob = pcmToWav(pcmData, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error("Error playing audio:", e));
        
        audio.onended = () => {
          setIsAudioPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      } else {
        console.error('Audio data not found or format is incorrect:', result);
        setIsAudioPlaying(false);
      }
    } catch (error) {
      console.error("Error fetching audio:", error);
      setIsAudioPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // DayCard component to render each individual day in the grid.
  const DayCard = ({ day, target, isCompleted, onDayClick }) => (
    <div
      onClick={() => onDayClick(day)}
      className={`
        flex flex-col items-center justify-center p-4 m-1
        rounded-lg cursor-pointer transition-all duration-300
        shadow-lg hover:shadow-xl
        select-none
        ${isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}
        ${isCompleted ? 'hover:bg-green-600' : 'hover:bg-gray-100'}
      `}
    >
      <span className="text-xl md:text-2xl font-bold">Day {day}</span>
      <span className="text-sm md:text-base">Target: {target}</span>
      {isCompleted && (
        <svg
          className="w-6 h-6 mt-1 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-6xl p-6 bg-gray-900 text-white rounded-xl shadow-2xl mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2">
          100-Day Push-up Challenge
        </h1>
        <p className="text-center text-lg md:text-xl font-medium text-gray-300 mb-6">
          {message}
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {pushupData.map((day) => (
          <DayCard
            key={day.day}
            day={day.day}
            target={day.target}
            isCompleted={day.isCompleted}
            onDayClick={handleDayClick}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl mt-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button
          onClick={getMotivationalBoost}
          className="flex-1 py-4 px-6 bg-purple-600 text-white rounded-lg shadow-lg font-bold text-lg
          hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105"
          disabled={isLoadingMotivation}
        >
          {isLoadingMotivation ? 'Loading...' : 'Get a Motivational Boost ✨'}
        </button>
        <button
          onClick={getAudioMotivationalBoost}
          className="flex-1 py-4 px-6 bg-green-600 text-white rounded-lg shadow-lg font-bold text-lg
          hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
          disabled={isLoadingAudio}
        >
          {isLoadingAudio ? 'Loading Audio...' : (isAudioPlaying ? 'Stop Audio ⏸️' : 'Play Audio Boost 🔊')}
        </button>
        <button
          onClick={getWorkoutTip}
          className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-lg shadow-lg font-bold text-lg
          hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          disabled={isLoadingTip}
        >
          {isLoadingTip ? 'Loading...' : 'Get a Workout Tip 💪'}
        </button>
        <button
          onClick={getDynamicPlan}
          className="flex-1 py-4 px-6 bg-yellow-600 text-white rounded-lg shadow-lg font-bold text-lg
          hover:bg-yellow-700 transition-colors duration-300 transform hover:scale-105"
          disabled={isLoadingPlan}
        >
          {isLoadingPlan ? 'Loading...' : 'Get a Dynamic Plan 📅'}
        </button>
      </div>

      {motivation && (
        <div className="w-full max-w-6xl mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-700 text-center text-base md:text-lg italic">{motivation}</p>
        </div>
      )}

      {workoutTip && (
        <div className="w-full max-w-6xl mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-700 text-center text-base md:text-lg">{workoutTip}</p>
        </div>
      )}

      {dynamicPlan && (
        <div className="w-full max-w-6xl mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Your Dynamic 7-Day Plan</h3>
          <ul className="list-none space-y-4">
            {dynamicPlan.map((item, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-inner flex flex-col sm:flex-row sm:items-center">
                <span className="font-bold text-lg text-blue-600 mr-2 min-w-[100px]">Day {item.day}:</span>
                <span className="text-gray-700 mr-2 flex-1">{item.description}</span>
                {item.visual_aid_search_term && (
                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.visual_aid_search_term)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 sm:mt-0 italic text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-300"
                  >
                    Search for visual aid: {item.visual_aid_search_term}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;

