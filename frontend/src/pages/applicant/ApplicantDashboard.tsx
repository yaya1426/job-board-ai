import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../api/client';
import { ApplicantLayout } from '../../layouts/ApplicantLayout';
import { Container, Card, CardBody, Badge, Button, SkeletonStat, SkeletonCard } from '../../components/ui';
import type { Application } from '../../types';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function ApplicantDashboard() {
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

  const stats = {
    total: applications.length,
    underReview: applications.filter(a => a.status === 'under_review' || a.status === 'evaluating').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const recentApplications = applications.slice(0, 5);

  return (
    <ApplicantLayout>
      <Container size="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your job applications</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
            </>
          ) : (
            <>
              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Applications</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Under Review</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.underReview}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Accepted</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.accepted}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rejected</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.rejected}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <Link to="/applicant/applications">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start by browsing available jobs</p>
                <div className="mt-6">
                  <Link to="/jobs">
                    <Button variant="primary">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    to={`/applicant/applications/${app.id}`}
                    className="block"
                  >
                    <Card hover>
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {app.job?.title || 'Job Title'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Applied on {new Date(app.created_at).toLocaleDateString()}
                            </p>
                            {app.ai_score !== null && app.ai_score !== undefined && (
                              <p className="text-sm text-gray-700 mt-2">
                                <span className="font-medium">AI Score:</span>{' '}
                                <span className="text-blue-600 font-bold">{app.ai_score}/10</span>
                              </p>
                            )}
                          </div>
                          <Badge variant={getStatusColor(app.status)}>
                            {app.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </ApplicantLayout>
  );
}
