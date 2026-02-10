import { Link } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAuth } from '../context/AuthContext';
import { Container, Button, Card, CardBody } from '../components/ui';

export function Home() {
  const { isAuthenticated, isHR, isApplicant } = useAuth();

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center py-16">
        <Container size="xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job Board AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Smart recruitment powered by artificial intelligence. Find the perfect match faster with AI-driven candidate evaluation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                isHR ? (
                  <Link to="/hr/dashboard">
                    <Button variant="primary" size="lg">
                      Go to HR Dashboard
                    </Button>
                  </Link>
                ) : isApplicant ? (
                  <>
                    <Link to="/jobs">
                      <Button variant="primary" size="lg">
                        Browse Jobs
                      </Button>
                    </Link>
                    <Link to="/applicant/dashboard">
                      <Button variant="secondary" size="lg">
                        My Dashboard
                      </Button>
                    </Link>
                  </>
                ) : null
              ) : (
                <>
                  <Link to="/jobs">
                    <Button variant="primary" size="lg">
                      Browse Jobs
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="lg">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <CardBody>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Matching</h3>
                  <p className="text-gray-600">
                    Our AI evaluates candidate profiles against job requirements for intelligent, data-driven matches
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Hiring Process</h3>
                  <p className="text-gray-600">
                    Streamline recruitment with automated screening, instant AI feedback, and efficient workflows
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Candidate Insights</h3>
                  <p className="text-gray-600">
                    Get detailed AI-generated insights on every candidate's qualifications, strengths, and gaps
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Container>
      </div>
    </PublicLayout>
  );
}
