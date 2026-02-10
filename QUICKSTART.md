# Quick Start Guide

Get the Job Board AI platform running in 5 minutes!

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment (IMPORTANT!)
cp .env.example .env

# Edit .env file and add your OpenAI API key:
# OPENAI_API_KEY=sk-your-key-here

# Start backend server
npm run dev
```

✅ Backend should be running on `http://localhost:5001`

You should see:
```
🚀 Server is running!
📡 Port: 5001
🌍 Environment: development
📝 API: http://localhost:5001/api
```

## Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

## Step 3: Access the Application (1 minute)

Open your browser and go to: **http://localhost:5173**

### Login with Demo Account

**For HR Dashboard:**
- Email: `hr@jobboard.com`
- Password: `12345678`

**For Applicant View:**
- Email: `john.doe@example.com`
- Password: `password123`

Or create a new applicant account by clicking "Sign Up"!

## What to Try

### As an Applicant:
1. Browse available jobs
2. Click on a job to view details
3. Apply by uploading your resume (PDF/DOC/DOCX)
4. Check "My Applications" to see AI feedback and scores

### As HR:
1. View dashboard statistics
2. Go to "Applications" to review candidates
3. Filter by status or job
4. Update application statuses
5. Create new job postings in "Jobs"

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in backend/.env to a different number
PORT=5002
```

**OpenAI API errors:**
- Verify your API key is correct in `backend/.env`
- Check your OpenAI account has credits
- Test with: `curl http://localhost:5001/api/test/openai`

### Frontend Issues

**Can't connect to backend:**
1. Verify backend is running on port 5001
2. Check `VITE_API_URL` in `frontend/.env`
3. Make sure it's set to `http://localhost:5001`

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the API endpoints documentation
- Explore the codebase structure
- Try modifying the AI evaluation prompts in `backend/src/services/openai.service.ts`

## Need Help?

- Check the main README.md
- Review the backend/README.md and frontend/README.md
- Open an issue on GitHub
