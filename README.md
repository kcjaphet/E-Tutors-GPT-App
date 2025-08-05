
# e-tutors - AI-Powered Educational Platform

A comprehensive educational platform with AI-powered tools for text processing, content generation, and academic assistance. Built with React, TypeScript, and Supabase.

![e-tutors Banner](public/og-image.png)

## 🚀 Features

- **AI Text Detection**: Advanced AI content detection with confidence scores
- **Text Humanization**: Transform AI-generated text to sound more natural
- **Literature Review Generator**: Generate comprehensive academic literature reviews
- **PDF Summarization**: Extract and summarize content from PDF documents
- **Text Processing Tools**: Multiple text manipulation and enhancement tools
- **User Authentication**: Secure user accounts with Supabase Auth
- **Subscription Management**: Stripe-powered subscription system
- **Responsive Design**: Optimized for desktop and mobile devices

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [License](#license)

## 🏗️ Project Structure

```
e-tutors/
├── public/              # Public assets and uploads
├── src/                 # Frontend source code
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── account/    # Account management
│   │   ├── ai-detection/ # AI detection features
│   │   ├── dashboard/  # Dashboard components
│   │   ├── pricing/    # Pricing components
│   │   ├── sections/   # Page sections
│   │   └── text-tools/ # Text processing tools
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── lib/            # Utility libraries
│   ├── integrations/   # Supabase integration
│   ├── data/           # Static data configurations
│   └── utils/          # Helper utilities
├── supabase/           # Supabase configuration
│   ├── functions/      # Edge Functions
│   └── config.toml     # Supabase config
└── README.md           # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd e-tutors
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 💻 Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`.

## 🗄️ Supabase Setup

1. Create a new Supabase project
2. Configure authentication providers
3. Set up Row Level Security (RLS) policies
4. Deploy Edge Functions:
   ```bash
   supabase functions deploy
   ```
5. Configure Stripe integration in Supabase secrets

## 🚢 Deployment

### Frontend Deployment

The app can be deployed to Vercel, Netlify, or any static hosting service:

```bash
npm run build
```

### Supabase Edge Functions

Deploy serverless functions for AI processing:

```bash
supabase functions deploy detect-ai-text
supabase functions deploy humanize-text
supabase functions deploy text-process
supabase functions deploy create-checkout
supabase functions deploy check-subscription
```

## 🛠️ Technologies Used

**Frontend**:
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- React Router
- React Query
- Framer Motion

**Backend**:
- Supabase (Database, Auth, Edge Functions)
- OpenAI API
- Stripe (Payment processing)

**Development**:
- TypeScript
- ESLint
- Tailwind CSS

## 🔐 Security Features

- Row Level Security (RLS) policies
- Protected routes and authentication guards
- Rate limiting on API endpoints
- Input validation and sanitization
- Subscription-based access control

## 📄 License

[MIT License](LICENSE)
