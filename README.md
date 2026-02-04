# AI Job Board

An AI-powered job board application with automated resume evaluation using OpenAI GPT-4o-mini.

## Features

- 🤖 AI-powered resume screening with GPT-4o-mini
- 📝 Job management system (HR dashboard)
- 📄 Application tracking with real-time status
- 🔐 Secure authentication (JWT)
- ⚡ Background processing for evaluations
- 📊 HR dashboard with statistics

## Tech Stack

- **Backend**: TypeScript, Express 5, SQLite
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer 2.x

## Quick Start

### Prerequisites

- **Node.js 18-22** (Node.js 23+ NOT supported)
- OpenAI API Key

### Installation

```bash
# 1. Install Node.js 20 (if needed)
nvm install 20
nvm use 20

# 2. Install dependencies
cd backend
npm install

# 3. Configure environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# 4. Seed database
npm run seed

# 5. Start server
npm run dev
```

Server runs at: http://localhost:5000

### Pre-seeded Credentials

**HR User:**
- Email: `hr@jobboard.com`
- Password: `12345678`

**Test Applicant:**
- Email: `john.doe@example.com`
- Password: `password123`

## How It Works

1. **Applicant** submits application with resume
2. **System** uploads resume to OpenAI Files API
3. **AI** evaluates resume against job requirements
4. **Auto-decision**: Score < 5 = reject, ≥ 5 = HR review
5. **HR** reviews qualified candidates

## API Endpoints

- `POST /api/auth/register` - Register applicant
- `POST /api/auth/login` - Login
- `GET /api/jobs` - List jobs
- `POST /api/applications` - Submit application
- `GET /api/hr/applications` - HR dashboard
- `GET /api/hr/stats` - Statistics

See [backend/README.md](backend/README.md) for complete API documentation.

## Project Structure

```
job-board-ai/
├── backend/           # Express + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── README.md
└── README.md
```

## Development

```bash
cd backend
npm run dev      # Start development server
npm run build    # Build for production
npm run seed     # Seed database
```

## For the YouTube Tutorial

This backend is ready for the React frontend tutorial demonstrating AI-assisted development with Cursor.

## License

MIT
