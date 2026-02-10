import { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../api/client';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  FileUpload,
  Skeleton,
} from '../components/ui';
import type { Job } from '../types';
import type { AxiosError } from 'axios';
import { useToast } from '../context/ToastContext';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  
  // Application form state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadJob = useCallback(async () => {
    try {
      const response = await jobsAPI.getById(Number(id));
      setJob(response.data.job);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    if (!resume) {
      showError('Please upload your resume');
      return;
    }

    if (!user) {
      showError('Please log in to apply');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('job_id', id!);
      formData.append('full_name', user.full_name);
      formData.append('email', user.email);
      formData.append('phone', ''); // User can add phone to their profile later
      formData.append('resume', resume);

      await applicationsAPI.create(formData);
      showSuccess('Application submitted successfully! You can track it in your dashboard.');
      setTimeout(() => {
        navigate('/applicant/applications');
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      return; // Show login prompt
    }
    setShowApplyForm(true);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-12">
          <Container size="lg">
            <div className="space-y-6">
              <Skeleton height="200px" />
              <Skeleton height="400px" />
            </div>
          </Container>
        </div>
      </PublicLayout>
    );
  }

  if (!job) {
    return (
      <PublicLayout>
        <div className="py-12">
          <Container size="lg">
            <Card>
              <CardBody>
                <div className="text-center py-12">
                  <p className="text-gray-500">Job not found</p>
                  <Link to="/jobs">
                    <Button variant="primary" className="mt-4">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="py-12">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Job Description */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary_range}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Job Description</h2>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Requirements</h2>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar - Apply Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Apply for this position</h3>
                  </CardHeader>
                  <CardBody>
                    {!isAuthenticated ? (
                      <div className="space-y-4">
                        <p className="text-gray-600 text-sm">
                          Please log in to apply for this position
                        </p>
                        <div className="space-y-2">
                          <Link to="/login" className="block">
                            <Button variant="primary" className="w-full">
                              Log In
                            </Button>
                          </Link>
                          <Link to="/register" className="block">
                            <Button variant="outline" className="w-full">
                              Create Account
                            </Button>
                          </Link>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Why create an account?</span>
                            <br />
                            Track your applications and get AI-powered feedback on your resume match.
                          </p>
                        </div>
                      </div>
                    ) : !showApplyForm ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                              <p className="font-semibold mb-1">AI-Powered Evaluation</p>
                              <p>
                                Your application will be evaluated by our AI system to match your qualifications with job requirements.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={handleApplyClick}
                          variant="primary"
                          className="w-full"
                        >
                          Apply Now
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleApply} className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Application Details</p>
                          <div className="text-sm text-gray-600">
                            <p><span className="font-medium">Name:</span> {user?.full_name}</p>
                            <p><span className="font-medium">Email:</span> {user?.email}</p>
                          </div>
                        </div>

                        <FileUpload
                          label="Resume"
                          accept=".pdf,.doc,.docx"
                          maxSizeMB={5}
                          onFileChange={setResume}
                          required
                          helperText="Upload your resume (PDF, DOC, or DOCX, max 5MB)"
                        />

                        <div className="space-y-2">
                          <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                            disabled={submitting || !resume}
                            className="w-full"
                          >
                            Submit Application
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowApplyForm(false)}
                            disabled={submitting}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PublicLayout>
  );
}
