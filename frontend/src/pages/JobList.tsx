import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../api/client';
import { PublicLayout } from '../layouts/PublicLayout';
import { Container, Card, CardBody, Badge, Button, Input, SkeletonCard, EmptyState } from '../components/ui';
import type { Job } from '../types';
import type { AxiosError } from 'axios';
import { useToast } from '../context/ToastContext';

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showError } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(term) ||
            job.location.toLowerCase().includes(term) ||
            job.description.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, jobs]);

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data.jobs);
      setFilteredJobs(response.data.jobs);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="py-12">
        <Container size="xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
            <p className="text-gray-600 mb-6">
              Discover your next opportunity from our curated job listings
            </p>

            <div className="max-w-2xl">
              <Input
                placeholder="Search jobs by title, location, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon={
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  title={searchTerm ? 'No jobs found' : 'No jobs available'}
                  description={
                    searchTerm
                      ? 'Try adjusting your search terms or browse all jobs.'
                      : 'Check back later for new opportunities.'
                  }
                  action={
                    searchTerm ? (
                      <Button onClick={() => setSearchTerm('')} variant="outline">
                        Clear Search
                      </Button>
                    ) : undefined
                  }
                />
              </CardBody>
            </Card>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <Link key={job.id} to={`/jobs/${job.id}`}>
                    <Card hover>
                      <CardBody>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </div>
                          </div>
                          <Badge variant="success">
                            Active
                          </Badge>
                        </div>

                        {job.salary_range && (
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary_range}
                          </div>
                        )}

                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {job.description}
                        </p>

                        <div className="pt-3 border-t border-gray-100">
                          <span className="text-blue-600 font-medium hover:text-blue-700 text-sm">
                            View Details →
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </Container>
      </div>
    </PublicLayout>
  );
}
