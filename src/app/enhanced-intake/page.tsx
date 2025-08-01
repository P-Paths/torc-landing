'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EnhancedIntakeForm from '../../../components/EnhancedIntakeForm';

function EnhancedIntakeContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') || 'AHRPE5559';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Gaming Addiction Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Complete this assessment to see if you qualify for gaming addiction treatment
          </p>
          <p className="text-sm text-gray-500">
            Agent ID: {agentId}
          </p>
        </div>

        {/* Enhanced Intake Form */}
        <EnhancedIntakeForm />
      </div>
    </div>
  );
}

export default function EnhancedIntakePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedIntakeContent />
    </Suspense>
  );
} 