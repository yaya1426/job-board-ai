import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hrAPI } from '../../api/client';
import { HRLayout } from '../../layouts/HRLayout';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Select,
  Breadcrumbs,
  ScoreDisplay,
  AIFeedback,
  Skeleton,
} from '../../components/ui';
import type { Application } from '../../types';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function HRApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<Application['status'] | ''>('');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      const response = await hrAPI.getApplicationById(Number(id));
      setApplication(response.data.application);
      setNewStatus(response.data.application.status);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !application) return;

    setUpdating(true);
    try {
      await hrAPI.updateApplicationStatus(application.id, { status: newStatus });
      showSuccess('Application status updated successfully');
      await loadApplication();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <HRLayout>
        <Container size="lg">
          <div className="space-y-6">
            <Skeleton height="40px" />
            <Skeleton height="200px" />
            <Skeleton height="300px" />
          </div>
        </Container>
      </HRLayout>
    );
  }

  if (!application) {
    return (
      <HRLayout>
        <Container size="lg">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <p className="text-gray-500">Application not found</p>
                <Button variant="primary" className="mt-4" onClick={() => navigate('/hr/applications')}>
                  Back to Applications
                </Button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Container size="lg">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/hr/dashboard' },
              { label: 'Applications', href: '/hr/applications' },
              { label: 'Details' },
            ]}
          />
        </div>

        <div className="space-y-6">
          {/* Candidate Header */}
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{application.full_name}</h1>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {application.email}
                    </p>
                    {application.phone && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {application.phone}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Applied on {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Job Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Position Applied For</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{application.job?.title}</h3>
                  <p className="text-gray-600">{application.job?.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-900 whitespace-pre-line">{application.job?.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Requirements</h4>
                  <p className="text-gray-900 whitespace-pre-line">{application.job?.requirements}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* AI Evaluation */}
          {(application.ai_score || application.ai_feedback) && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <h2 className="text-xl font-semibold">AI Evaluation</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  {application.ai_score && (
                    <div>
                      <ScoreDisplay score={application.ai_score} size="lg" />
                    </div>
                  )}
                  {application.ai_feedback && (
                    <div>
                      <AIFeedback feedback={application.ai_feedback} showDisclaimer={true} />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Status Update */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Update Status</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Select
                    label="Application Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Application['status'])}
                  >
                    <option value="pending">Pending</option>
                    <option value="evaluating">Evaluating</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === application.status || updating}
                  loading={updating}
                  variant="primary"
                >
                  Update Status
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Resume */}
          {application.resume_path && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Resume</h2>
              </CardHeader>
              <CardBody>
                <a
                  href={`${import.meta.env.VITE_API_URL}/${application.resume_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </Button>
                </a>
              </CardBody>
            </Card>
          )}
        </div>
      </Container>
    </HRLayout>
  );
}
