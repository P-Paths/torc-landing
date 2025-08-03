'use client';

import React, { useState, useEffect } from 'react';

interface Lead {
  id: string;
  agentId: string;
  agentName: string;
  gamerFirstName: string;
  gamerLastName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: Date;
  hasEmergencyIndicators: boolean;
  totalSymptoms: number;
}

interface DashboardStats {
  totalLeads: number;
  recentLeads: number;
  emergencyLeads: number;
  totalAgents: number;
}

interface Agent {
  id: string;
  name: string;
  agentId: string;
  password: string;
  qrCodeUrl?: string;
  createdAt: Date;
  isActive: boolean;
}

interface GamingLookupResult {
  platform: string;
  username: string;
  totalHours?: number;
  totalGames?: number;
  qualificationStatus?: string;
  qualificationReason?: string;
  topGames?: any[];
  player?: {
    gamerTag?: string;
    profilePicture?: string;
  };
}

export default function SimpleAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    recentLeads: 0,
    emergencyLeads: 0,
    totalAgents: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAgentManagement, setShowAgentManagement] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    agentId: '',
    password: ''
  });
  
  // Gaming Lookup State
  const [gamingLookup, setGamingLookup] = useState({
    platform: 'steam',
    username: '',
    result: null as GamingLookupResult | null,
    isLoading: false
  });

  // Check for agent authentication on component mount
  useEffect(() => {
    const savedAgentId = localStorage.getItem('agentId');
    if (savedAgentId) {
      setIsAuthenticated(true);
      setAgentId(savedAgentId);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'agent123' && agentId) {
      localStorage.setItem('agentId', agentId);
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      alert('Invalid credentials. Use agent123 as password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agentId');
    setIsAuthenticated(false);
    setPassword('');
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load leads
      const leadsResponse = await fetch('/api/admin/leads');
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.leads || []);
      }

      // Load agents
      const agentsResponse = await fetch('/api/admin/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData.agents || []);
      }

      // Load stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalLeads: statsData.totalLeads || 0,
          recentLeads: statsData.recentLeads || 0,
          emergencyLeads: statsData.emergencyLeads || 0,
          totalAgents: statsData.totalAgents || 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAgent = async () => {
    if (!newAgent.name || !newAgent.agentId || !newAgent.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });

      if (response.ok) {
        alert('Agent created successfully!');
        setNewAgent({ name: '', agentId: '', password: '' });
        loadDashboardData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create agent');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent');
    }
  };

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/agents?id=${agentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Agent deleted successfully!');
        loadDashboardData();
      } else {
        alert('Failed to delete agent');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent');
    }
  };

  const generateQRCode = () => {
    // Use production URL when deployed, fallback to localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://torc-landing.vercel.app' // Update this with your actual Vercel domain
      : 'http://localhost:3001';
    const url = `${baseUrl}?agent=${agentId}`;
    
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrApiUrl);
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-agent-${agentId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGamingLookup = async () => {
    if (!gamingLookup.username) {
      alert('Please enter a username/gamertag');
      return;
    }

    setGamingLookup(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`/api/gamer-lookup?platform=${gamingLookup.platform}&username=${gamingLookup.username}`);
      const data = await response.json();
      setGamingLookup(prev => ({ 
        ...prev, 
        result: data, 
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error looking up gaming profile:', error);
      setGamingLookup(prev => ({ ...prev, isLoading: false }));
      alert('Error looking up gaming profile. Please try again.');
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 TORC Admin Dashboard
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent ID
              </label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo Credentials:</strong><br/>
              Agent ID: AHRPE5559<br/>
              Password: agent123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                🎯 TORC Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Agent: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{agentId}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🆕</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recent Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🚨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Emergency</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emergencyLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Generator */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📱 QR Code Generator</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent ID for QR Code
              </label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent ID"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateQRCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Generate QR Code
              </button>
              
              {qrCodeUrl && (
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Download QR Code
                </button>
              )}
            </div>

            {qrCodeUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated QR Code</h3>
                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt={`QR Code for Agent ${agentId}`}
                    className="mx-auto border border-gray-300 rounded-lg"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    This QR code links to: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NODE_ENV === 'production' ? 'https://torc-landing.vercel.app' : 'http://localhost:3000'}/agent/{agentId}</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gaming Lookup */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎮 Gaming Profile Lookup</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={gamingLookup.platform}
                  onChange={(e) => setGamingLookup(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="steam" className="text-gray-900">Steam</option>
                  <option value="xbox" className="text-gray-900">Xbox</option>
                  <option value="playstation" className="text-gray-900">PlayStation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username/Gamertag
                </label>
                <input
                  type="text"
                  value={gamingLookup.username}
                  onChange={(e) => setGamingLookup(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleGamingLookup}
                  disabled={gamingLookup.isLoading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {gamingLookup.isLoading ? 'Looking up...' : 'Lookup Profile'}
                </button>
              </div>
            </div>

            {gamingLookup.result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-6">
                  {gamingLookup.result.player?.profilePicture && (
                    <img 
                      src={gamingLookup.result.player.profilePicture} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {gamingLookup.result.player?.gamerTag || gamingLookup.username}
                    </h3>
                    <p className="text-gray-600 capitalize">
                      {gamingLookup.result.platform} Platform
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      gamingLookup.result.qualificationStatus === 'qualified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gamingLookup.result.qualificationStatus === 'qualified' ? '✅ Qualified' : '❌ Not Qualified'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-blue-600 font-bold">⏰</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">Total Hours</p>
                        <p className="text-2xl font-bold text-blue-900">{gamingLookup.result.totalHours?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <span className="text-green-600 font-bold">🎮</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-600">Games Owned</p>
                        <p className="text-2xl font-bold text-green-900">{gamingLookup.result.totalGames || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <span className="text-purple-600 font-bold">📊</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-600">Avg Hours/Day</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {gamingLookup.result && gamingLookup.result.totalHours ? Math.round(gamingLookup.result.totalHours / 365) : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {gamingLookup.result.qualificationReason && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-yellow-600 font-bold">💡</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">Qualification Reason</h4>
                        <p className="text-sm text-yellow-700 mt-1">{gamingLookup.result.qualificationReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {gamingLookup.result.topGames && gamingLookup.result.topGames.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Most Played Games</h4>
                    <div className="space-y-3">
                      {gamingLookup.result.topGames.slice(0, 5).map((game: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{game.name}</p>
                              <p className="text-sm text-gray-500">{game.platform}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{game.hoursPlayed?.toLocaleString()} hours</p>
                            <p className="text-xs text-gray-500">
                              {game.hoursPlayed && gamingLookup.result?.totalHours ? Math.round((game.hoursPlayed / gamingLookup.result.totalHours) * 100) : 0}% of total
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Intake Form Tracking */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Intake Form Tracking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 font-bold">📥</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Forms Submitted</p>
                  <p className="text-2xl font-bold text-blue-900">{leads.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 font-bold">📤</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Sent to Lawyers</p>
                  <p className="text-2xl font-bold text-green-900">{leads.filter(lead => lead.status === 'contacted').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 font-bold">💰</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Paid Referrals</p>
                  <p className="text-2xl font-bold text-purple-900">{leads.filter(lead => lead.status === 'enrolled').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Status Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">New Submissions</span>
                <span className="text-sm font-bold text-blue-600">{leads.filter(lead => lead.status === 'new').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Contacted by Lawyers</span>
                <span className="text-sm font-bold text-yellow-600">{leads.filter(lead => lead.status === 'contacted').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Qualified for Treatment</span>
                <span className="text-sm font-bold text-green-600">{leads.filter(lead => lead.status === 'qualified').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Enrolled in Treatment</span>
                <span className="text-sm font-bold text-purple-600">{leads.filter(lead => lead.status === 'enrolled').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">📋 Recent Leads</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emergency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.gamerFirstName} {lead.gamerLastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Agent: {lead.agentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === 'new' ? 'bg-green-100 text-green-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'enrolled' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.hasEmergencyIndicators ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          🚨 Emergency
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {leads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No leads yet. Generate a QR code and start collecting leads!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 