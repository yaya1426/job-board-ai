import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hrAPI, applicationsAPI } from '../../api/client';
import { HRLayout } from '../../layouts/HRLayout';
import {
  Container,
  Card,
  CardBody,
  Button,
  Badge,
  SkeletonStat,
  SkeletonCard,
} from '../../components/ui';
import type { HRStats, Application } from '../../types';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function HRDashboard() {
  const [stats, setStats] = useState<HRStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        hrAPI.getStats(),
        hrAPI.getApplications({}),
      ]);
      setStats(statsRes.data.stats);
      // Get applications with AI scores, sorted by evaluated date
      const evaluatedApps = appsRes.data.applications
        .filter((app: Application) => app.ai_score !== null && app.ai_score !== undefined)
        .sort((a: Application, b: Application) => {
          const dateA = a.evaluated_at ? new Date(a.evaluated_at).getTime() : 0;
          const dateB = b.evaluated_at ? new Date(b.evaluated_at).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentApplications(evaluatedApps);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load dashboard data');
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
    <HRLayout>
      <Container size="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of applications and job postings</p>
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
          ) : stats ? (
            <>
              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Applications</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_applications}</p>
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
                      <p className="text-sm text-gray-600">Pending Review</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending_applications}</p>
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
                      <p className="text-sm text-gray-600">Under Review</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.under_review_applications}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.accepted_applications}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </>
          ) : null}
        </div>

        {/* Secondary Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardBody>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_jobs}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active_jobs}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-gray-600">Avg AI Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.average_ai_score ? stats.average_ai_score.toFixed(1) : 'N/A'}
                </p>
              </CardBody>
            </Card>
          </div>
        ) : null}

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Evaluations</h2>
            <Link to="/hr/applications">
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No evaluated applications</h3>
                <p className="mt-1 text-sm text-gray-500">Applications will appear here once AI evaluation is complete</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    to={`/hr/applications/${app.id}`}
                    className="block"
                  >
                    <Card hover>
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {app.full_name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {app.job?.title || 'Job Title'}
                            </p>
                            {app.evaluated_at && (
                              <p className="text-xs text-gray-500 mt-1">
                                Evaluated {new Date(app.evaluated_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {app.ai_score && (
                              <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">{app.ai_score}</p>
                                <p className="text-xs text-gray-500">AI Score</p>
                              </div>
                            )}
                            <Badge variant={getStatusColor(app.status)}>
                              {app.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link to="/hr/applications">
            <Card hover>
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Applications</h3>
                    <p className="text-sm text-gray-600">Review and update application statuses</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/hr/jobs/new">
            <Card hover>
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Job</h3>
                    <p className="text-sm text-gray-600">Post a new job opening</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </Container>
    </HRLayout>
  );
}
