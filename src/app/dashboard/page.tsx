'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FormSubmission {
  id: string;
  agentId: string;
  agentName: string;
  status: 'pending' | 'submitted' | 'failed';
  timestamp: string;
  message?: string;
}

const DashboardPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    // Load submissions from localStorage or API
    const savedSubmissions = localStorage.getItem('vga_submissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
    setLoading(false);
  }, []);

  const handleManualSubmit = async (submission: FormSubmission) => {
    try {
      setLoading(true);
      
      // Get the form data for this submission
      const formData = localStorage.getItem(`vga_form_${submission.id}`);
      if (!formData) {
        alert('Form data not found');
        return;
      }

      const parsedFormData = JSON.parse(formData);

      // Submit to our API
      const response = await fetch('/api/submit-vga-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedFormData),
      });

      const result = await response.json();

      if (result.success) {
        // Update submission status
        const updatedSubmissions = submissions.map(sub => 
          sub.id === submission.id 
            ? { ...sub, status: 'submitted' as const, message: result.message }
            : sub
        );
        setSubmissions(updatedSubmissions);
        localStorage.setItem('vga_submissions', JSON.stringify(updatedSubmissions));
        
        alert('Form submitted successfully to Formstack!');
      } else {
        alert(`Failed to submit form: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VGA Form Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your form submissions and automation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Submissions</h3>
            <p className="text-3xl font-bold text-blue-600">{submissions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Submitted</h3>
            <p className="text-3xl font-bold text-green-600">
                              {submissions.filter((s: any) => s.status === 'submitted').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
                              {submissions.filter((s: any) => s.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Failed</h3>
            <p className="text-3xl font-bold text-red-600">
                              {submissions.filter((s: any) => s.status === 'failed').length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            href="/vga-form"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Form
          </Link>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Form Submissions</h2>
          </div>
          
          {submissions.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new form submission.</p>
              <div className="mt-6">
                <Link
                  href="/vga-form"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create New Form
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.agentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.agentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(submission)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {submission.status === 'pending' && (
                            <button
                              onClick={() => handleManualSubmit(submission)}
                              disabled={loading}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Submission Details Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agent ID</label>
                    <p className="text-sm text-gray-900">{selectedSubmission.agentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agent Name</label>
                    <p className="text-sm text-gray-900">{selectedSubmission.agentName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm text-gray-900">{new Date(selectedSubmission.timestamp).toLocaleString()}</p>
                  </div>
                  {selectedSubmission.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.message}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 