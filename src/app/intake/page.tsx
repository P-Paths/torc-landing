'use client';

import EnhancedIntakeForm from '../../../components/EnhancedIntakeForm';

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gaming Addiction Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take the first step toward recovery with our comprehensive gaming addiction assessment. 
            This detailed evaluation helps us provide personalized treatment recommendations.
          </p>
        </div>
        
        <EnhancedIntakeForm />
      </div>
    </div>
  );
} 