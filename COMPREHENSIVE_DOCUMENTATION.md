# GPTTextTools - Comprehensive Technical Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture](#architecture)
3. [Frontend Structure](#frontend-structure)
4. [Backend & Database](#backend--database)
5. [API Integration](#api-integration)
6. [Authentication Flow](#authentication-flow)
7. [Component Documentation](#component-documentation)
8. [Data Flow](#data-flow)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Production Deployment](#production-deployment)

## Application Overview

**GPTTextTools** is a comprehensive AI-powered text analysis and processing platform that provides:

- **AI Text Detection**: Analyzes text to determine if it's AI-generated
- **Text Humanization**: Converts AI-generated text to sound more human-like
- **Literature Review Generator**: Creates academic literature reviews
- **PDF Summarization**: Extracts and summarizes PDF documents
- **Text Processing Tools**: Various text manipulation utilities
- **Subscription Management**: Freemium model with Stripe integration

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Payments**: Stripe
- **AI Services**: OpenAI API
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Supabase       │    │  External APIs  │
│                 │    │                 │    │                 │
│ • Components    │◄──►│ • Database      │◄──►│ • OpenAI        │
│ • Hooks         │    │ • Auth          │    │ • Stripe        │
│ • Context       │    │ • Edge Functions│    │                 │
│ • Routes        │    │ • Storage       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Structure

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── sections/       # Page sections
│   ├── dashboard/      # Dashboard specific components
│   ├── pricing/        # Pricing page components
│   └── account/        # Account management components
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useSubscription.tsx # Subscription management
│   └── useTextOperations.tsx # Text processing operations
├── pages/              # Route components
├── lib/                # Utility libraries
├── utils/              # Helper functions
├── config/             # Configuration files
└── integrations/       # Third-party integrations
    └── supabase/       # Supabase client and types
```

### Key Components

#### Core Components
- **App.tsx**: Main application component with routing
- **Header.tsx**: Navigation and user authentication
- **Footer.tsx**: Site footer with links
- **ErrorBoundary.tsx**: Error handling boundary

#### Feature Components
- **HeroAIDetector.tsx**: Main AI detection interface
- **TextTools.tsx**: Text processing utilities
- **LiteratureReviewWriter.tsx**: Academic writing assistant
- **PDFSummary.tsx**: PDF processing interface

#### UI Components (shadcn/ui)
- Form components (Input, Textarea, Button)
- Layout components (Card, Sheet, Dialog)
- Feedback components (Toast, Alert)

## Backend & Database

### Supabase Configuration

#### Database Tables

**profiles**
```sql
- id: UUID (Primary Key, references auth.users)
- display_name: TEXT
- email: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**subscribers**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- email: TEXT
- stripe_customer_id: TEXT
- subscription_tier: TEXT
- subscription_end: TIMESTAMP
- subscribed: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**documents**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- title: TEXT
- file_name: TEXT
- file_path: TEXT
- mime_type: TEXT
- file_size: INTEGER
- page_count: INTEGER
- status: TEXT
- extracted_text: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**conversations**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- document_id: UUID (Foreign Key to documents)
- title: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**messages**
```sql
- id: UUID (Primary Key)
- conversation_id: UUID (Foreign Key to conversations)
- role: TEXT
- content: TEXT
- created_at: TIMESTAMP
```

### Row Level Security (RLS) Policies

All tables implement RLS to ensure users can only access their own data:

```sql
-- Example for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

### Edge Functions

Located in `supabase/functions/`:

1. **detect-ai-text**: Analyzes text for AI generation using OpenAI
2. **humanize-text**: Converts AI text to human-like text
3. **text-process**: Handles various text processing operations
4. **create-checkout**: Creates Stripe checkout sessions

### Storage
- **documents**: Private bucket for user-uploaded files
- Policies ensure users can only access their own files

## API Integration

### Supabase Client Setup
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

### API Endpoints Configuration
```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://jusuwufpgirouvyrmaxe.supabase.co/functions/v1';

export const API_ENDPOINTS = {
  DETECT_AI_TEXT: `${API_BASE_URL}/detect-ai-text`,
  HUMANIZE_TEXT: `${API_BASE_URL}/humanize-text`,
  LITERATURE_REVIEW: `${API_BASE_URL}/literature-review`,
  TEXT_PROCESS: `${API_BASE_URL}/text-process`,
  PDF_SUMMARY: `${API_BASE_URL}/pdf-summary`
};
```

## Authentication Flow

### User Authentication States
1. **Unauthenticated**: Limited access to features
2. **Authenticated**: Full access based on subscription
3. **Session Management**: Automatic token refresh

### Auth Context Implementation
```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication methods
  const signup = async (email, password, name) => { /* ... */ };
  const login = async (email, password) => { /* ... */ };
  const logout = async () => { /* ... */ };
  const resetPassword = async (email) => { /* ... */ };
};
```

## Component Documentation

### useTextOperations Hook
**Purpose**: Manages text processing operations

**State Management**:
```typescript
const [inputText, setInputText] = useState('');
const [resultText, setResultText] = useState('');
const [isDetecting, setIsDetecting] = useState(false);
const [detectionResult, setDetectionResult] = useState(null);
```

**Key Methods**:
- `detectAIText()`: Analyzes text for AI generation
- `humanizeText()`: Converts AI text to human-like
- `handleFileUpload()`: Processes uploaded text files
- `copyToClipboard()`: Copies results to clipboard

### useSubscription Hook
**Purpose**: Manages user subscription state and limits

**Features**:
- Fetches subscription data from backend
- Calculates remaining usage for free tier
- Provides subscription status and limits

### Error Handling
**Central Error Handler**: `src/utils/errorHandler.ts`
- Logs errors for monitoring
- Provides user-friendly error messages
- Handles API and network errors gracefully

## Data Flow

### AI Text Detection Flow
```
User Input → Validation → API Call → Processing → Results Display
    ↓
Subscription Check → Rate Limiting → OpenAI API → Response Format → UI Update
```

### Authentication Flow
```
Login Form → Supabase Auth → Session Management → UI State Update
    ↓
Profile Creation → RLS Policy Check → Database Access → Feature Access
```

### Subscription Flow
```
Pricing Page → Stripe Checkout → Webhook → Database Update → Feature Unlock
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Authentication Issues
**Symptoms**: Login failures, session expiry
**Check**: 
- Supabase URL configuration in Auth settings
- Site URL and Redirect URLs in Supabase dashboard
- Browser local storage for session data

**Fix**:
```typescript
// Check auth state
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);
```

#### 2. API Connection Issues
**Symptoms**: Failed API calls, timeout errors
**Check**: 
- Network connectivity
- Supabase Edge Function status
- API endpoint URLs in config

**Debug**:
```typescript
// Check API configuration
console.log('API Base URL:', API_BASE_URL);
console.log('Available endpoints:', API_ENDPOINTS);
```

#### 3. Subscription Issues
**Symptoms**: Feature access denied, incorrect usage limits
**Check**: 
- Database subscribers table
- Stripe webhook configuration
- RLS policies

**Debug**:
```sql
-- Check subscription status
SELECT * FROM subscribers WHERE user_id = 'user-uuid';
```

#### 4. Database Connection Issues
**Symptoms**: Data not loading, RLS policy errors
**Check**: 
- Supabase project status
- Database connection pooling
- RLS policies configuration

#### 5. File Upload Issues
**Symptoms**: PDF processing failures
**Check**: 
- Storage bucket permissions
- File size limits
- MIME type validation

### Logging and Monitoring

#### Console Logs (Development Only)
Production logs are handled by the centralized error handler:
```typescript
// src/utils/errorHandler.ts
errorHandler.logError(error, { context: 'additional-info' });
```

#### Supabase Monitoring
- **Database Logs**: Monitor query performance and errors
- **Edge Function Logs**: Track API calls and errors
- **Auth Logs**: Monitor authentication events

#### Error Tracking
Implement production error tracking:
```typescript
// In production, integrate with services like:
// - Sentry
// - LogRocket
// - Custom error endpoint
```

## Production Deployment

### Environment Variables Required
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Secrets Required
- `OPENAI_API_KEY`: For AI text processing
- `STRIPE_SECRET_KEY`: For payment processing

### Production Checklist
- [ ] Remove all console.log statements
- [ ] Enable proper error tracking
- [ ] Configure proper CORS headers
- [ ] Set up monitoring and alerts
- [ ] Configure CSP headers
- [ ] Enable HTTPS only
- [ ] Configure rate limiting
- [ ] Set up backup procedures
- [ ] Test all features end-to-end
- [ ] Configure domain and SSL

### Security Considerations
1. **RLS Policies**: Ensure all tables have proper row-level security
2. **API Rate Limiting**: Implement rate limiting on Edge Functions
3. **Input Validation**: Validate all user inputs
4. **CORS Configuration**: Properly configure allowed origins
5. **Secrets Management**: Never expose API keys in frontend code

### Performance Optimization
1. **Code Splitting**: Implement lazy loading for routes
2. **Caching**: Cache API responses where appropriate
3. **Image Optimization**: Optimize images and assets
4. **Bundle Analysis**: Monitor bundle size and optimize

### Monitoring and Alerts
Set up monitoring for:
- API response times
- Error rates
- User authentication events
- Subscription events
- Database performance

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor error logs and fix issues
- Update dependencies regularly
- Review and optimize database queries
- Monitor API usage and costs
- Update documentation

### Backup and Recovery
- Database backups: Automated via Supabase
- File storage backups: Configure as needed
- Configuration backups: Store in version control

### Scaling Considerations
- Database read replicas for high traffic
- CDN for static assets
- Edge function scaling
- Subscription tier adjustments based on usage

---

This documentation should be updated as the application evolves. For specific implementation details, refer to the codebase and inline comments.