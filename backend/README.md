# AI Job Board Backend

An AI-powered job board backend with automated resume evaluation using OpenAI GPT-4o-mini.

## Features

- 🔐 JWT Authentication (Applicants & HR)
- 📝 Job CRUD Operations (HR only)
- 📄 Resume Upload & Processing
- 🤖 AI-Powered Resume Evaluation
- 📊 HR Dashboard with Statistics
- ⚡ Background Job Processing
- 🗄️ SQLite Database

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js + Express 5
- **Database**: SQLite with sqlite3
- **Authentication**: JWT tokens with bcrypt
- **File Upload**: Multer 2.x
- **AI Integration**: OpenAI SDK (GPT-4o-mini)
- **Validation**: express-validator

## Prerequisites

- **Node.js 18+**
- npm or yarn
- OpenAI API Key

## Quick Setup

### 1. Install Node.js (if needed)

Ensure you have Node.js 18 or higher:

```bash
node -v  # Should show v18.x.x or higher
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 4. Seed Database

```bash
npm run seed
```

This creates:
- HR user: `hr@jobboard.com` / `12345678`
- Test applicant: `john.doe@example.com` / `password123`
- 3 sample job postings

### 5. Start Server

```bash
npm run dev
```

Server runs at: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register applicant
- `POST /api/auth/login` - Login (applicants & HR)
- `GET /api/auth/me` - Get current user

### Jobs (Public)
- `GET /api/jobs` - List active jobs
- `GET /api/jobs/:id` - Get job details

### Jobs (HR Only)
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Submit application with resume
- `GET /api/applications/my-applications` - View own applications
- `GET /api/applications/:id` - View application details

### HR Dashboard
- `GET /api/hr/applications` - List all applications
- `GET /api/hr/applications/:id` - Get application details
- `PUT /api/hr/applications/:id/status` - Update status
- `GET /api/hr/stats` - Dashboard statistics

## Application Workflow

1. Applicant submits application with resume
2. File uploaded to local storage and OpenAI Files API
3. AI evaluates resume (score 1-10 + feedback)
4. Auto-decision: score < 5 = reject, ≥ 5 = HR review
5. HR reviews and makes final decision

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_ORG_ID` | No | OpenAI organization ID (optional) |
| `OPENAI_MODEL` | No | AI model (default: gpt-4o-mini) |
| `DATABASE_PATH` | No | Database file path |
| `UPLOAD_DIR` | No | Upload directory |
| `AI_SCORE_THRESHOLD` | No | Score threshold (default: 5) |

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Login as HR
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@jobboard.com","password":"12345678"}'

# Get all jobs
curl http://localhost:5000/api/jobs
```

## Security Notes

- HR users cannot self-register (pre-seeded only)
- JWT tokens expire after 7 days
- Passwords hashed with bcrypt
- File uploads validated (PDF/DOC/DOCX, max 5MB)

## Project Structure

```
backend/
├── src/
│   ├── config/        # Database, OpenAI, auth config
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Auth, upload, role check
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # OpenAI, queue services
│   ├── types/         # TypeScript types
│   ├── utils/         # Validation, errors
│   ├── scripts/       # Database seeding
│   └── server.ts      # Entry point
├── uploads/           # Resume files
├── database.sqlite    # SQLite database
└── package.json
```

## Troubleshooting

### Node.js Version Issues

If you get compilation errors, check your Node.js version:

```bash
node -v  # Must be 18 or higher
```

### Database Issues

Delete and recreate:

```bash
rm database.sqlite
npm run seed
```

### Port Already in Use

```bash
# Change PORT in .env or kill process
lsof -ti:5000 | xargs kill
```

### OpenAI API Errors

- Verify API key is correct
- Check account has credits
- Ensure organization ID is correct (if using)

## Development

```bash
npm run dev      # Development with auto-reload
npm run build    # Build for production
npm start        # Run production build
npm run seed     # Seed database
```

## License

MIT
