
# GPTTextTools

A modern web application that detects AI-generated text and helps humanize it for a more natural tone. Built with React (frontend) and Express.js (backend).

![GPTTextTools Banner](public/og-image.png)

## 🚀 Features

- **AI Text Detection**: Analyze text to determine if it was likely written by AI.
- **Text Humanization**: Transform AI-generated content to sound more natural and human-like.
- **User Dashboard**: Track your detection and humanization history.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Backend](#running-the-backend)
  - [Testing](#testing)
- [Deployment](#deployment)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Backend Deployment (AWS)](#backend-deployment-aws)
- [Technologies Used](#technologies-used)
- [License](#license)

## 🏗️ Project Structure

```
gpt-text-tools/
├── public/              # Public assets
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── config/          # Configuration files
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   └── pages/           # Page components
├── server/              # Backend source code
│   ├── config/          # Server configuration
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── __tests__/       # Backend tests
└── README.md            # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gpt-text-tools
   ```

2. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

### Environment Variables

1. **Frontend**: Create a `.env` file in the project root:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. **Backend**: Create a `.env` file in the `server` directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gpt-text-tools
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

## 💻 Development

### Running the Frontend

```bash
# From the project root
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Running the Backend

```bash
# From the server directory
cd server
npm run dev
```

The API will be available at `http://localhost:5000`.

### Testing

```bash
# From the server directory
cd server
npm test
```

This will run the Jest test suite for the backend.

## 🚢 Deployment

### Frontend Deployment (Vercel)

See [FRONTEND_DEPLOYMENT.md](FRONTEND_DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

### Backend Deployment (AWS)

See [server/DEPLOYMENT.md](server/DEPLOYMENT.md) for detailed instructions on deploying to AWS Elastic Beanstalk.

## 🛠️ Technologies Used

**Frontend**:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- Tanstack React Query

**Backend**:
- Express.js
- MongoDB & Mongoose
- OpenAI API
- Jest & Supertest (testing)

## 📄 License

[MIT License](LICENSE)
