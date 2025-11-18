# MindMend - AI-Powered Mental Health & Wellness Platform

Link - https://mind-mend-two.vercel.app/

> **Final Year Major Project**  
> Developed by **Kritika Rathore**, **Kishika Chouhan**, **Ena Luhadia Jain** and **Kshipra Navin**

## 🌟 Overview

MindMend is a comprehensive AI-powered mental health and wellness platform designed to support individuals on their journey to emotional clarity and mental well-being. The platform offers a range of interactive tools, including mood tracking, sentiment-aware journaling, AI therapist chat, and engaging wellness activities.

## ✨ Features

### Core Features

- **🧘 Breathing Exercises** - Interactive breathing wave guide for stress relief and calm
- **📝 Gratitude Journal** - Express gratitude and boost positive thinking
- **🧩 Mood Puzzle Game** - Memory matching game to build emotional awareness
- **🎨 Calm Colors** - Art therapy tool for emotional expression through colors
- **📊 Mood Assessment** - Comprehensive mental health questionnaire with scoring
- **✍️ Sentiment-Aware Journaling** - AI-powered sentiment analysis of journal entries
- **💬 AI Therapist Chat** - GPT-powered virtual therapist for 24/7 support
- **📈 Emotional Insights** - Visual analytics and patterns of your emotional journey
- **🧘‍♀️ Guided Meditations** - Curated meditation sessions for mental wellness
- **📚 Self-Help Library** - Resources, breathing exercises, and wellness materials
- **🚨 Emergency Detection** - Intelligent detection and guidance for crisis situations
- **👥 Support Resources** - Access to mental health resources and helplines
- **📧 Contact Form** - Get in touch for support and inquiries

### Interactive Activities

1. **Breathing Wave** - Follow animated wave patterns for guided breathing exercises
2. **Gratitude Spark** - List three things you're grateful for each day
3. **Mood Puzzle** - Match emotion pairs in an engaging memory game
4. **Calm Colors** - Express feelings through color selection and art therapy

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service (Authentication, Database)
- **PostgreSQL** - Database (via Supabase)
- **Row Level Security (RLS)** - Data security

### Additional Libraries
- **React Query** - Server state management
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **date-fns** - Date utility functions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soul-sync-scribe-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run database migrations** (if using Supabase CLI)
   ```bash
   # Migrations are located in supabase/migrations/
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080` (or the port shown in terminal)

## 🏗️ Project Structure

```
soul-sync-scribe-main/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media files
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── Activities.tsx
│   │   ├── BreathingWave.tsx
│   │   ├── CalmColors.tsx
│   │   ├── Chat.tsx
│   │   ├── Contact.tsx
│   │   ├── EmergencyDetection.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── GratitudeSpark.tsx
│   │   ├── Hero.tsx
│   │   ├── Insights.tsx
│   │   ├── Journal.tsx
│   │   ├── Meditations.tsx
│   │   ├── MoodPuzzle.tsx
│   │   ├── MoodTest.tsx
│   │   ├── Navbar.tsx
│   │   ├── SelfHelpLibrary.tsx
│   │   └── Support.tsx
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── supabase/
│   └── migrations/        # Database migrations
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 📝 Usage

### For Users

1. **Visit the website** - Navigate to the platform URL
2. **Explore features** - Use the navigation to access different sections
3. **Take mood test** - Complete the assessment to understand your mental state
4. **Journal your thoughts** - Write entries and get sentiment feedback
5. **Try activities** - Engage with interactive wellness activities
6. **Chat with AI therapist** - Get support through the AI chat interface
7. **Track progress** - View insights and analytics of your wellness journey

### For Developers

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Design System

The platform uses a calming **Ocean Blue & Teal Wellness** theme designed to promote tranquility and mental peace:

- **Primary Colors**: Ocean blue and teal gradients
- **Typography**: Poppins font family
- **Components**: Custom design system with Tailwind CSS
- **Animations**: Smooth transitions using Framer Motion

## 🔐 Authentication

The platform supports:
- **User Registration** - Create an account with email/password
- **User Login** - Sign in to access personalized features
- **Anonymous Access** - Explore features without registration
- **Session Management** - Persistent login sessions

## 📊 Database Schema

Key tables:
- `profiles` - User profile information
- `mood_test_results` - Mood assessment scores and answers
- `user_roles` - Role-based access control

## 🤝 Contributing

This is a final year major project by **Kritika Rathore**, **Kishika**, and **Kshipra**.

## 📄 License

This project is developed as part of a final year major project.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **shadcn/ui** - Component library
- **OpenAI** - AI capabilities (if applicable)
- All open-source contributors whose libraries made this project possible

## 📧 Contact

For questions, support, or inquiries about this project, please reach out through the contact form on the platform or contact the developers.

---

**Note**: This project is developed as a final year major project and is intended for educational and demonstration purposes. For actual mental health support, please consult licensed professionals.
