'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Simple agent credentials (in production, use proper authentication)
const AGENT_CREDENTIALS: Record<string, { password: string; name: string; agentId: string }> = {
  'john': { password: 'agent123', name: 'John Smith', agentId: 'AHRPE5559' },
  'sarah': { password: 'agent456', name: 'Sarah Johnson', agentId: 'BHRPE6660' },
  'mike': { password: 'agent789', name: 'Mike Davis', agentId: 'CHRPE7771' },
  // Add more agents as needed
};

export default function AgentLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple authentication check
    if (AGENT_CREDENTIALS[username] && AGENT_CREDENTIALS[username].password === password) {
      // Store agent session
      localStorage.setItem('agentId', AGENT_CREDENTIALS[username].agentId);
      localStorage.setItem('agentName', AGENT_CREDENTIALS[username].name);
      localStorage.setItem('isAgentLoggedIn', 'true');
      
      // Redirect to agent dashboard
      router.push('/agent-dashboard');
    } else {
      setError('Invalid username or password');
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., john"
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
              <p><strong>Username:</strong> john | <strong>Password:</strong> agent123</p>
              <p><strong>Username:</strong> sarah | <strong>Password:</strong> agent456</p>
              <p><strong>Username:</strong> mike | <strong>Password:</strong> agent789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 