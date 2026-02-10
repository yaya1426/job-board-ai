import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { TopNav } from '../components/ui/TopNav';
import { Button } from '../components/ui/Button';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { isAuthenticated, isHR, isApplicant, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav>
        <nav className="flex items-center gap-6">
          <Link to="/jobs" className="text-gray-700 hover:text-gray-900 transition-colors">
            Browse Jobs
          </Link>
          {isAuthenticated ? (
            <>
              {isApplicant && (
                <>
                  <Link to="/applicant/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/applicant/applications" className="text-gray-700 hover:text-gray-900 transition-colors">
                    My Applications
                  </Link>
                </>
              )}
              {isHR && (
                <>
                  <Link to="/hr/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/hr/applications" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Applications
                  </Link>
                  <Link to="/hr/jobs" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Jobs
                  </Link>
                </>
              )}
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </TopNav>
      <main>{children}</main>
    </div>
  );
}
