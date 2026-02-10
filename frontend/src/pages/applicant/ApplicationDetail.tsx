import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationsAPI } from '../../api/client';
import { ApplicantLayout } from '../../layouts/ApplicantLayout';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Breadcrumbs,
  ScoreDisplay,
  AIFeedback,
  Skeleton,
} from '../../components/ui';
import type { Application } from '../../types';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      const response = await applicationsAPI.getById(Number(id));
      setApplication(response.data.application);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load application');
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

  const getStatusSteps = (currentStatus: Application['status']) => {
    const steps = [
      { id: 'pending', label: 'Submitted' },
      { id: 'evaluating', label: 'AI Evaluation' },
      { id: 'under_review', label: 'HR Review' },
      { id: 'accepted', label: currentStatus === 'accepted' ? 'Accepted' : 'Decision' },
    ];

    const statusOrder = ['pending', 'evaluating', 'under_review', 'accepted', 'rejected'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index < currentIndex || (currentStatus === 'accepted' && index === 3),
      current: index === currentIndex || (currentStatus === 'rejected' && index === 3),
      rejected: currentStatus === 'rejected' && index === 3,
    }));
  };

  if (loading) {
    return (
      <ApplicantLayout>
        <Container size="lg">
          <div className="space-y-6">
            <Skeleton height="40px" />
            <Skeleton height="200px" />
            <Skeleton height="300px" />
          </div>
        </Container>
      </ApplicantLayout>
    );
  }

  if (!application) {
    return (
      <ApplicantLayout>
        <Container size="lg">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <p className="text-gray-500">Application not found</p>
                <Link to="/applicant/applications">
                  <Button variant="primary" className="mt-4">
                    Back to Applications
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Container>
      </ApplicantLayout>
    );
  }

  const statusSteps = getStatusSteps(application.status);

  return (
    <ApplicantLayout>
      <Container size="lg">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/applicant/dashboard' },
              { label: 'Applications', href: '/applicant/applications' },
              { label: 'Details' },
            ]}
          />
        </div>

        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {application.job?.title || 'Job Application'}
                  </h1>
                  <p className="text-gray-600 mt-1">{application.job?.location}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Applied on {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Application Progress</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${step.completed ? 'bg-green-500' : step.current ? (step.rejected ? 'bg-red-500' : 'bg-blue-500') : 'bg-gray-300'}
                          text-white
                        `}
                      >
                        {step.completed ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : step.rejected ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <p
                        className={`
                          text-sm mt-2 text-center
                          ${step.completed || step.current ? 'text-gray-900 font-medium' : 'text-gray-500'}
                        `}
                      >
                        {step.rejected ? 'Rejected' : step.label}
                      </p>
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`
                          h-1 flex-1 mx-2
                          ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                        `}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Job Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Description</h3>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {application.job?.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Requirements</h3>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {application.job?.requirements}
                  </p>
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
                      <ScoreDisplay score={application.ai_score} />
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

          {/* Resume */}
          {application.resume_path && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Your Resume</h2>
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
    </ApplicantLayout>
  );
}
