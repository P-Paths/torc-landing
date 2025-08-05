import RTSIntakeForm from '../../../components/RTSIntakeForm';

export default function RTSIntakePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gaming Addiction Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete this assessment to help us understand the impact of gaming on your life or the life of someone you care about. 
            Our team will review your case and contact you within 24-48 hours.
          </p>
        </div>

        {/* Form */}
        <RTSIntakeForm />
      </div>
    </div>
  );
} 