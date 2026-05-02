"use server";

/**
 * Server Actions for interacting with the Gemini API.
 * This keeps the API key securely on the server.
 */

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const TEXT_MODEL = 'gemini-1.5-flash';
const TTS_MODEL = 'gemini-1.5-flash';

/**
 * Fetch a motivational boost message.
 */
export async function getMotivationAction(completedDays, totalDays) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

  const progressPercent = Math.round((completedDays / totalDays) * 100);
  const prompt = `You are a personal fitness coach. The user is on a 100-day push-up challenge. They have completed ${completedDays} out of ${totalDays} days. Their progress is ${progressPercent}%. Give them a short, encouraging, and highly motivating message to keep them going. Keep the message to a single, concise paragraph.`;
  
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error('Could not retrieve motivational boost.');
    return text;
  } catch (error) {
    console.error('Gemini Motivation Error:', error);
    throw error;
  }
}

/**
 * Fetch a workout tip.
 */
export async function getTipAction() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

  const prompt = `You are a fitness expert. Provide one single, concise, and helpful tip for improving push-up form or a related workout. Do not include any greetings or salutations.`;
  
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Could not retrieve workout tip.');
    return text;
  } catch (error) {
    console.error('Gemini Tip Error:', error);
    throw error;
  }
}

/**
 * Fetch a 7-day dynamic push-up plan.
 * Returns an array of 7 objects: { day, focus, reps, tip }
 */
export async function getPlanAction() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

  const prompt = `You are an elite fitness coach generating a personalised 7-day push-up training plan.

CRITICAL INSTRUCTIONS — follow exactly:
1. Return ONLY a raw JSON array. No markdown, no backticks, no explanatory text before or after.
2. The array must contain exactly 7 objects, one per day.
3. Each object must have these exact keys:
   - "day": integer 1 through 7
   - "focus": short string describing the training focus (e.g. "Wide-Grip Chest Blast")
   - "reps": integer — total push-up reps for that day (scale from ~20 for day 1 up to ~50 for day 7)
   - "tip": a single concise coaching cue or form tip (max 12 words)

Example of the exact format required:
[
  {"day":1,"focus":"Foundation Builder","reps":20,"tip":"Keep your core braced throughout the entire movement."},
  {"day":2,"focus":"Wide-Grip Power","reps":24,"tip":"Hands wider than shoulders to hit the chest harder."}
]

Generate the full 7-day plan now:`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            day:   { type: 'NUMBER' },
            focus: { type: 'STRING' },
            reps:  { type: 'NUMBER' },
            tip:   { type: 'STRING' },
          },
          required: ['day', 'focus', 'reps', 'tip'],
        },
      },
    },
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/${TEXT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const result = await response.json();
    let jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonText) throw new Error('Empty response from Gemini API.');

    // Safety net: strip any accidental markdown code fences
    jsonText = jsonText
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Gemini returned an invalid plan structure.');
    }

    return parsed;
  } catch (error) {
    console.error('Gemini Plan Error:', error);
    throw error;
  }
}

/**
 * Fetch audio motivation as a base64 string.
 */
export async function getAudioAction(completedDays) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

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
    model: TTS_MODEL
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${TTS_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const base64Audio = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!base64Audio || !mimeType || !mimeType.startsWith("audio/L16")) {
      throw new Error('Audio data not found or format is incorrect.');
    }

    const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);

    return { base64Audio, sampleRate };
  } catch (error) {
    console.error('Gemini Audio Error:', error);
    throw error;
  }
}
