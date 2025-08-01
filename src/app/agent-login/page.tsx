'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Simple agent credentials (in production, use proper authentication)
const AGENT_CREDENTIALS: Record<string, { password: string; name: string }> = {
  'AHRPE5559': { password: 'agent123', name: 'Agent AHRPE5559' },
  'BHRPE6660': { password: 'agent456', name: 'Agent BHRPE6660' },
  'CHRPE7771': { password: 'agent789', name: 'Agent CHRPE7771' },
  // Add more agents as needed
};

export default function AgentLoginPage() {
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple authentication check
    if (AGENT_CREDENTIALS[agentId] && AGENT_CREDENTIALS[agentId].password === password) {
      // Store agent session
      localStorage.setItem('agentId', agentId);
      localStorage.setItem('agentName', AGENT_CREDENTIALS[agentId].name);
      localStorage.setItem('isAgentLoggedIn', 'true');
      
      // Redirect to admin dashboard
      router.push('/admin');
    } else {
      setError('Invalid agent ID or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Agent Login
          </h2>
          <p className="text-gray-600">
            Access your agent dashboard and QR code generator
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="agentId" className="block text-sm font-medium text-gray-700">
                Agent ID
              </label>
              <div className="mt-1">
                <input
                  id="agentId"
                  name="agentId"
                  type="text"
                  required
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value.toUpperCase())}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., AHRPE5559"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p><strong>Agent ID:</strong> AHRPE5559 | <strong>Password:</strong> agent123</p>
              <p><strong>Agent ID:</strong> BHRPE6660 | <strong>Password:</strong> agent456</p>
              <p><strong>Agent ID:</strong> CHRPE7771 | <strong>Password:</strong> agent789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 