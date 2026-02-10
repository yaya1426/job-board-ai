import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../api/client';
import { ApplicantLayout } from '../../layouts/ApplicantLayout';
import { Container, Card, CardBody, Badge, Button, SkeletonCard, EmptyState } from '../../components/ui';
import type { Application } from '../../types';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data.applications);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    const colors = {
      pending: 'warning' as const,
      evaluating: 'info' as const,
      under_review: 'warning' as const,
      accepted: 'success' as const,
      rejected: 'danger' as const,
    };
    return colors[status];
  };

  return (
    <ApplicantLayout>
      <Container size="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track and manage your job applications</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                title="No applications yet"
                description="You haven't applied to any jobs yet. Start browsing available positions and submit your application."
                action={
                  <Link to="/jobs">
                    <Button variant="primary">
                      Browse Jobs
                    </Button>
                  </Link>
                }
              />
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <Link key={app.id} to={`/applicant/applications/${app.id}`}>
                <Card hover>
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {app.job?.title || 'Job Title'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {app.job?.location}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(app.status)}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </p>

                      {app.ai_score !== null && app.ai_score !== undefined && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">AI Score:</span>
                          <span className="text-lg font-bold text-blue-600">{app.ai_score}/10</span>
                        </div>
                      )}

                      {app.ai_feedback && !app.ai_score && (
                        <p className="text-xs text-gray-500 italic pt-2 border-t border-gray-100">
                          AI evaluation available
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        View Details →
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </ApplicantLayout>
  );
}
