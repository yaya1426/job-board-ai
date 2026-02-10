# Job Board AI - Frontend

A modern React + TypeScript frontend for the Job Board AI platform, built with Vite and Tailwind CSS v4.

## Features

### For Applicants
- Browse active job postings
- Apply to jobs with resume upload (PDF, DOC, DOCX)
- View application status and AI-generated feedback
- Track all applications in one place

### For HR
- Dashboard with application statistics
- Review and manage all applications
- Update application status
- Create, edit, and delete job postings
- View AI-generated scores and feedback for candidates

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on port 5001

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5001
```

## Project Structure

```
src/
├── api/              # API client and endpoint definitions
├── components/       # Reusable UI components
├── context/          # React context (Auth)
├── pages/            # Page components
│   ├── hr/          # HR-specific pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── JobList.tsx
│   ├── JobDetail.tsx
│   └── MyApplications.tsx
├── types/            # TypeScript type definitions
├── App.tsx           # Root component with routing
└── main.tsx          # Entry point
```

## Demo Credentials

**HR Account:**
- Email: `hr@jobboard.com`
- Password: `12345678`

**Applicant Account:**
- Email: `john.doe@example.com`
- Password: `password123`

## Key Features

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Auto-redirect on unauthorized access
- Role-based route protection

### Role-Based Access
- Public routes: Home, Jobs, Job Details, Login, Register
- Applicant routes: My Applications
- HR routes: Dashboard, Applications Management, Jobs Management

### File Upload
- Multipart form data for resume uploads
- Client-side file type validation
- Max file size: 5MB

## API Integration

All API endpoints are integrated through the centralized API client:

- **Auth**: `/api/auth/*`
- **Jobs**: `/api/jobs/*`
- **Applications**: `/api/applications/*`
- **HR**: `/api/hr/*`

See `src/api/client.ts` for complete API documentation.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`
4. Wrap with `<ProtectedRoute>` if auth required

## License

MIT
