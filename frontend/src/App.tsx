import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { JobList } from './pages/JobList';
import { JobDetail } from './pages/JobDetail';

// Applicant pages
import { ApplicantDashboard } from './pages/applicant/ApplicantDashboard';
import { ApplicationsList } from './pages/applicant/ApplicationsList';
import { ApplicationDetail } from './pages/applicant/ApplicationDetail';

// HR pages
import { HRDashboard } from './pages/hr/HRDashboard';
import { HRApplications } from './pages/hr/HRApplications';
import { HRApplicationDetail } from './pages/hr/ApplicationDetail';
import { HRJobs } from './pages/hr/HRJobs';
import { JobForm } from './pages/hr/JobForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Applicant routes */}
            <Route
              path="/applicant/dashboard"
              element={
                <ProtectedRoute requiredRole="applicant">
                  <ApplicantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicant/applications"
              element={
                <ProtectedRoute requiredRole="applicant">
                  <ApplicationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicant/applications/:id"
              element={
                <ProtectedRoute requiredRole="applicant">
                  <ApplicationDetail />
                </ProtectedRoute>
              }
            />
            {/* Redirect old route to new route */}
            <Route
              path="/my-applications"
              element={<Navigate to="/applicant/applications" replace />}
            />

            {/* HR routes */}
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/applications"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/applications/:id"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRApplicationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs/new"
              element={
                <ProtectedRoute requiredRole="hr">
                  <JobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs/:id/edit"
              element={
                <ProtectedRoute requiredRole="hr">
                  <JobForm />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
