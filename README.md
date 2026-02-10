# Job Board AI - Complete Platform

An AI-powered job board platform that automatically evaluates job applications using OpenAI's GPT models. The platform serves both HR teams and job applicants with intelligent resume screening and matching.

## Features

### 🤖 AI-Powered Resume Evaluation
- Automatic resume analysis using GPT-4o-mini
- Intelligent scoring (1-10) based on job requirements
- Detailed AI feedback for each application
- Auto-classification of applications (accept/review/reject)

### 👥 For Applicants
- Browse and search active job postings
- Apply with resume upload (PDF, DOC, DOCX)
- Real-time application status tracking
- View AI-generated feedback and scores
- Track all applications in one dashboard

### 💼 For HR Teams
- Comprehensive dashboard with statistics
- Review all applications with AI insights
- Filter by status and job posting
- Manage application workflow
- Create, edit, and manage job postings
- Download applicant resumes

## Tech Stack

### Backend
- **Node.js 18+** with TypeScript
- **Express 5** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **OpenAI SDK** - AI evaluation
- **Multer** - File uploads
- **bcrypt** - Password hashing

### Frontend
- **React 19** with TypeScript
- **Vite 7** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## Project Structure

```
job-board-ai-complete/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Database, OpenAI, auth config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, role checks, uploads
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # OpenAI service, queue
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Validation, errors
│   ├── uploads/            # Uploaded resumes (auto-created)
│   └── database.sqlite     # SQLite database (auto-created)
│
└── frontend/               # React SPA
    ├── src/
    │   ├── api/           # API client
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   └── types/         # TypeScript types
    └── dist/              # Production build
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-board-ai-complete
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# PORT=5001
# OPENAI_API_KEY=your-api-key-here
# FRONTEND_URL=http://localhost:5173

# Start the backend
npm run dev
```

Backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api

## Demo Credentials

The database is pre-seeded with demo accounts:

**HR Account:**
- Email: `hr@jobboard.com`
- Password: `12345678`

**Applicant Account:**
- Email: `john.doe@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new applicant
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs (Public)
- `GET /api/jobs` - List active jobs
- `GET /api/jobs/:id` - Get job details

### Jobs (HR Only)
- `GET /api/jobs/all/list` - List all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications (Applicants)
- `POST /api/applications` - Submit application
- `GET /api/applications/my-applications` - Get own applications
- `GET /api/applications/:id` - Get application details

### Applications (HR Only)
- `GET /api/hr/applications` - List all applications
- `GET /api/hr/applications/:id` - Get application details
- `PUT /api/hr/applications/:id/status` - Update status
- `GET /api/hr/stats` - Dashboard statistics

## How It Works

### Application Flow

1. **Application Submission**
   - Applicant submits application with resume
   - File uploaded and validated (PDF, DOC, DOCX, max 5MB)
   - Application created with status `pending`

2. **AI Evaluation** (Background Process)
   - Resume uploaded to OpenAI Files API
   - Application queued for evaluation
   - Status changes to `evaluating`
   - GPT-4o-mini analyzes resume against job requirements
   - AI returns score (1-10) and detailed feedback

3. **Auto-Classification**
   - Score < 5: Status → `rejected`
   - Score ≥ 5: Status → `under_review` (requires HR review)

4. **HR Review**
   - HR views applications with AI scores and feedback
   - HR can update status to: `pending`, `evaluating`, `rejected`, `under_review`, `accepted`

## Environment Variables

### Backend (.env)

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
DATABASE_PATH=./database.sqlite
UPLOAD_DIR=./uploads
AI_SCORE_THRESHOLD=5
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001
```

## Development

### Backend Commands

```bash
npm run dev          # Start with nodemon (auto-reload)
npm run build        # Compile TypeScript
npm start            # Start production server
npm run seed         # Seed database with test data
```

### Frontend Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Production Deployment

### Backend

1. Set `NODE_ENV=production`
2. Update `JWT_SECRET` with a secure random string
3. Configure database path and upload directory
4. Set up proper CORS with production frontend URL
5. Use a process manager (PM2, systemd)

### Frontend

1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Serve `dist/` folder with nginx, Apache, or CDN

## Security Notes

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt (10 rounds)
- CORS configured for specific origins
- File upload validation (type and size)
- SQL injection protection (parameterized queries)
- **IMPORTANT**: Change `JWT_SECRET` in production
- **IMPORTANT**: Secure OpenAI API key (never commit to git)

## Troubleshooting

### Backend won't start
- Check if port 5001 is available
- Verify OpenAI API key is set
- Check database permissions

### Frontend can't connect to backend
- Verify backend is running on port 5001
- Check `VITE_API_URL` in frontend/.env
- Verify CORS settings in backend

### AI evaluation not working
- Verify OpenAI API key is valid
- Check API quota and billing
- Review backend logs for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
