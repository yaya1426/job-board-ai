import { useState, useEffect, useCallback } from 'react';
import { hrAPI, jobsAPI } from '../../api/client';
import { HRLayout } from '../../layouts/HRLayout';
import {
  Container,
  Card,
  CardBody,
  Badge,
  Button,
  Select,
  Drawer,
  ScoreDisplay,
  AIFeedback,
  SkeletonCard,
  EmptyState,
} from '../../components/ui';
import type { Application, Job } from '../../types';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function HRApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<Application['status'] | ''>('');
  const { showSuccess, showError } = useToast();

  const loadData = useCallback(async () => {
    try {
      const params: { status?: string; job_id?: number } = {};
      if (selectedStatus) params.status = selectedStatus;
      if (selectedJobId) params.job_id = Number(selectedJobId);

      const [appsRes, jobsRes] = await Promise.all([
        hrAPI.getApplications(params),
        jobsAPI.getAllList(),
      ]);

      setApplications(appsRes.data.applications);
      setJobs(jobsRes.data.jobs);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedJobId, showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedApp) return;

    setUpdating(true);
    try {
      await hrAPI.updateApplicationStatus(selectedApp.id, { status: newStatus });
      showSuccess('Application status updated successfully');
      await loadData();
      setSelectedApp(null);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openDrawer = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
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
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody>
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="space-y-4">
                  <Select
                    label="Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="evaluating">Evaluating</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </Select>

                  <Select
                    label="Job"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                  >
                    <option value="">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </Select>

                  {(selectedStatus || selectedJobId) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedStatus('');
                        setSelectedJobId('');
                      }}
                      className="w-full"
                      size="sm"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Applications List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
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
                    title="No applications found"
                    description={
                      selectedStatus || selectedJobId
                        ? 'Try adjusting your filters to see more results.'
                        : 'Applications will appear here once candidates start applying.'
                    }
                  />
                </CardBody>
              </Card>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {applications.length} {applications.length === 1 ? 'application' : 'applications'} found
                </div>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} hover>
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {app.full_name}
                              </h3>
                              <Badge variant={getStatusColor(app.status)}>
                                {app.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-1">{app.email}</p>
                            <p className="text-sm text-gray-500">
                              Applied to: {app.job?.title || 'Unknown Job'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(app.created_at).toLocaleDateString()}
                            </p>

                            {app.ai_score !== null && app.ai_score !== undefined && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-600">AI Score</p>
                                    <p className="text-lg font-bold text-blue-600">{app.ai_score}/10</p>
                                  </div>
                                </div>
                                {app.ai_feedback && (
                                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                    {app.ai_feedback.substring(0, 100)}...
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => openDrawer(app)}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>

      {/* Application Detail Drawer */}
      <Drawer
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Candidate Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{selectedApp.full_name}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {selectedApp.email}
                </p>
                {selectedApp.phone && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {selectedApp.phone}
                  </p>
                )}
                <p className="text-gray-500 mt-2">
                  Applied: {new Date(selectedApp.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Job Info */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Position</h4>
              <p className="text-gray-700">{selectedApp.job?.title}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedApp.job?.location}</p>
            </div>

            {/* AI Evaluation */}
            {(selectedApp.ai_score || selectedApp.ai_feedback) && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <h4 className="font-medium text-gray-900">AI Evaluation</h4>
                </div>
                {selectedApp.ai_score && (
                  <div className="mb-4">
                    <ScoreDisplay score={selectedApp.ai_score} size="sm" />
                  </div>
                )}
                {selectedApp.ai_feedback && (
                  <AIFeedback feedback={selectedApp.ai_feedback} showDisclaimer={false} />
                )}
              </div>
            )}

            {/* Status Update */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
              <div className="space-y-3">
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Application['status'])}
                >
                  <option value="pending">Pending</option>
                  <option value="evaluating">Evaluating</option>
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === selectedApp.status || updating}
                  loading={updating}
                  variant="primary"
                  className="w-full"
                >
                  Update Status
                </Button>
              </div>
            </div>

            {/* Resume */}
            {selectedApp.resume_path && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Resume</h4>
                <a
                  href={`${import.meta.env.VITE_API_URL}/${selectedApp.resume_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </Button>
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                AI suggestions assist HR decisions. Final decision is made by the hiring team.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </HRLayout>
  );
}
