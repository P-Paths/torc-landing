'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, QrCode, DollarSign, CheckCircle } from 'lucide-react';

interface AgentRegistrationForm {
  name: string;
  email: string;
  phone: string;
  agentId: string;
}

export default function AgentRegistrationPage() {
  const [formData, setFormData] = useState<AgentRegistrationForm>({
    name: '',
    email: '',
    phone: '',
    agentId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          commission_rate: 40.00,
          bonus_rate: 10.00,
          status: 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register agent');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">
            Welcome to the RTS Funnel team! You can now start earning commissions.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Your Commission Structure</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Per Valid Lead:</span>
                <span className="font-semibold">$40</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus per Eligible Lead:</span>
                <span className="font-semibold">$10</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.href = `/agent/${formData.agentId}`}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Your Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the RTS Funnel Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start earning commissions by helping gamers get the compensation they deserve. 
            Register as an agent and get your unique QR code for tracking.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Join RTS Funnel?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">High Commission Rates</h3>
                  <p className="text-gray-600">Earn $40 per valid lead + $10 bonus for eligible gamers</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <QrCode className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Unique Tracking QR Code</h3>
                  <p className="text-gray-600">Get your personalized QR code to track all your referrals</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserPlus className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Real-Time Dashboard</h3>
                  <p className="text-gray-600">Monitor your leads, commissions, and performance in real-time</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Bonus Eligibility Criteria</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Xbox platform gamer</li>
                <li>• Age 22 or younger</li>
                <li>• 1100+ hours played</li>
                <li>• Plays COD, GTA5, Fortnite, Minecraft, or Roblox</li>
              </ul>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Registration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="agentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Agent ID
                </label>
                <input
                  type="text"
                  id="agentId"
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your desired agent ID"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be your unique identifier (e.g., AHRPE5559)
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Registering...' : 'Register as Agent'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/admin" className="text-blue-600 hover:text-blue-700 font-medium">
                  Go to Admin Dashboard
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
