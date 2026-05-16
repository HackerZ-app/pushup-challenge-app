# 🦾 PushUp100: The Ultimate 100-Day Challenge

A premium, gamified, full-stack Next.js web application designed to track, motivate, and guide athletes through a 100-Day Pushup Challenge. Featuring an interactive 3D UI, an AI-powered fitness coach, and a global community leaderboard.

## ✨ Key Features

*   **Premium 3D UI & Glassmorphism**: Built with Tailwind CSS and Framer Motion, featuring an animated ambient aurora background, 3D tilt cards, and staggered entrance animations.
*   **Intelligent AI Coach**: Powered by the Google Gemini API to provide real-time workout tips, personalized motivational boosts, and dynamically generated 7-Day workout plans based on user fatigue and progress.
*   **Global Community Leaderboard**: A real-time multiplayer ranking system that tracks global pushup volumes, current streaks, and highlights the top athletes on a responsive visual podium.
*   **Real-Time Analytics Dashboard**: Visual heatmaps, streak tracking, and completion rate calculations utilizing optimized React hooks (`useMemo`) for instant UI updates.
*   **Secure Authentication**: Seamless Google OAuth integration via NextAuth.js with interactive 3D login consoles.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Frontend**: React, Tailwind CSS
*   **Animations**: Framer Motion, Canvas Confetti
*   **Database**: MongoDB & Mongoose
*   **Authentication**: NextAuth.js (Google Provider)
*   **AI Integration**: Google Gemini API

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB database (e.g., MongoDB Atlas)
*   Google Cloud Console account (for OAuth credentials)
*   Google AI Studio account (for Gemini API Key)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/pushup-challenge-app.git
cd pushup-challenge-app
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

\`\`\`env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 4. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## 📂 Project Structure

\`\`\`text
├── app/
│   ├── actions/       # Server Actions (MongoDB queries, Gemini API calls)
│   ├── api/           # NextAuth API routes
│   ├── auth/          # 3D Login and Registration pages
│   ├── coach/         # AI Coach Command Console
│   ├── community/     # Global Leaderboard & Podium
│   ├── plan/          # Dynamic 7-Day Plan generator
│   ├── stats/         # Analytics Dashboard
│   ├── globals.css    # Global styles & Tailwind directives
│   ├── layout.jsx     # Root layout with Animated Aurora Background
│   └── page.jsx       # Smart routing (Landing Page vs. User Dashboard)
├── lib/               # Database adapters and connection utilities
├── models/            # Mongoose schemas (UserProgress)
├── public/            # Static assets and audio files
└── src/
    ├── components/    # Reusable UI components (DayCard, Navigation, etc.)
    ├── context/       # React Context providers
    └── hooks/         # Custom React hooks
\`\`\`

## 👨‍💻 Author

Built by **Tarun Karma**

## 📄 License

This project is licensed under the MIT License.
