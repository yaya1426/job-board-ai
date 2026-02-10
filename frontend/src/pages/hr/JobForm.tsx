import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/client';
import { HRLayout } from '../../layouts/HRLayout';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Select,
  Button,
  Breadcrumbs,
} from '../../components/ui';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

export function JobForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary_range: '',
    status: 'active' as 'active' | 'closed',
  });

  useEffect(() => {
    if (isEdit) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await jobsAPI.getById(Number(id));
      const job = response.data.job;
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salary_range: job.salary_range || '',
        status: job.status,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await jobsAPI.update(Number(id), formData);
        showSuccess('Job updated successfully');
      } else {
        await jobsAPI.create(formData);
        showSuccess('Job created successfully');
      }
      navigate('/hr/jobs');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} job`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <HRLayout>
        <Container size="lg">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
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
              { label: 'Jobs', href: '/hr/jobs' },
              { label: isEdit ? 'Edit Job' : 'New Job' },
            ]}
          />
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Job' : 'Create New Job'}
            </h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., San Francisco, CA or Remote"
              />

              <Input
                label="Salary Range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $120,000 - $180,000"
              />

              <Textarea
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              />

              <Textarea
                label="Requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
                rows={6}
                placeholder="List the required skills, experience, education, and qualifications..."
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </Select>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  disabled={submitting}
                >
                  {isEdit ? 'Update Job' : 'Create Job'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/hr/jobs')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Container>
    </HRLayout>
  );
}
