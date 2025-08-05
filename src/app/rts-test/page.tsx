import RTSIntakeFormTest from '../../../components/RTSIntakeFormTest';

export default function RTSTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 RTS Funnel Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the RTS Funnel system without submitting real data to law firms. 
            This will simulate the routing logic and bonus eligibility checks.
          </p>
        </div>

        {/* Form */}
        <RTSIntakeFormTest />
      </div>
    </div>
  );
} 