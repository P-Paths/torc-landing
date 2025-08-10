'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';

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
  zipCode?: string; // Added for zip code tracking
  
  // Additional fields for bonus eligibility checking
  platforms?: string[];
  gamertags?: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  dailyHours?: string;
  primaryGames?: string[];
  games?: string[];
  additionalData?: {
    gamerDOB?: {
      year?: string;
    };
    startedAge?: string;
    totalHours?: string;
    games?: string[];
  };
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
  const router = useRouter();
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

  // Bonus eligibility checking functions
  const checkBonusEligibility = (lead: Lead): boolean => {
    // Check age (22 or younger)
    const age = getAgeFromLead(lead);
    if (age > 22) return false;

    // Check platform (Xbox only)
    const platform = getPlatformFromLead(lead);
    if (platform.toLowerCase() !== 'xbox') return false;

    // Check hours (1,100+ hours)
    const hours = getHoursFromLead(lead);
    if (hours < 1100) return false;

    // Check games (must play at least one of the required games)
    const games = getGamesFromLead(lead);
    const requiredGames = ['Call of Duty', 'GTA5', 'Fortnite', 'Minecraft', 'Roblox'];
    const hasRequiredGame = games.some(game => 
      requiredGames.some(required => 
        game.toLowerCase().includes(required.toLowerCase())
      )
    );
    if (!hasRequiredGame) return false;

    return true;
  };

  const getAgeFromLead = (lead: Lead): number => {
    // Try to get age from various possible fields
    if (lead.additionalData?.gamerDOB?.year) {
      const birthYear = parseInt(lead.additionalData.gamerDOB.year);
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    }
    
    // Fallback: try to parse from other age-related fields
    if (lead.additionalData?.startedAge) {
      return parseInt(lead.additionalData.startedAge) || 0;
    }
    
    return 0; // Default if no age data
  };

  const getPlatformFromLead = (lead: Lead): string => {
    // Check platforms array first
    if (lead.platforms && lead.platforms.length > 0) {
      return lead.platforms[0];
    }
    
    // Check gamertags object
    if (lead.gamertags) {
      if (lead.gamertags.xbox) return 'Xbox';
      if (lead.gamertags.playstation) return 'PlayStation';
      if (lead.gamertags.steam) return 'Steam';
    }
    
    return 'Unknown';
  };

  const getHoursFromLead = (lead: Lead): number => {
    // Try to parse hours from dailyHours or other fields
    if (lead.dailyHours) {
      const daily = parseInt(lead.dailyHours);
      if (!isNaN(daily)) {
        // Estimate total hours (daily * 365 days)
        return daily * 365;
      }
    }
    
    // Check additionalData for total hours
    if (lead.additionalData?.totalHours) {
      return parseInt(lead.additionalData.totalHours) || 0;
    }
    
    return 0;
  };

  const getGamesFromLead = (lead: Lead): string[] => {
    // Check primaryGames array first
    if (lead.primaryGames && Array.isArray(lead.primaryGames)) {
      return lead.primaryGames;
    }
    
    // Check games field
    if (lead.games && Array.isArray(lead.games)) {
      return lead.games;
    }
    
    // Check additionalData
    if (lead.additionalData?.games && Array.isArray(lead.additionalData.games)) {
      return lead.additionalData.games;
    }
    
    return [];
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
            Plain Admin Dashboard
          </h1>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent ID
              </label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          
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
    <AdminLayout agentId={agentId} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">🆕</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Leads</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.recentLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">🚨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emergency</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{stats.emergencyLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agents</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalAgents}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  <p className="mt-2 text-sm text-gray-900">
                    This QR code links to: <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">{process.env.NODE_ENV === 'production' ? 'https://torc-landing.vercel.app' : 'http://localhost:3000'}/ats-form?agent={agentId}</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">🧪</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Form Testing Navigation
              </h2>
              <p className="text-gray-600 mt-1">Quick access to all forms for testing and verification</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* RTS Mock VGA Form */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <span className="text-white font-bold text-lg">🎮</span>
                </div>
                <h3 className="font-semibold text-blue-900 text-lg">RTS Mock VGA Form</h3>
              </div>
              <p className="text-blue-700 mb-4 text-sm">Complete VGA replica for agents</p>
              <button
                onClick={() => window.open(`/rts-test?agent=${agentId}`, '_blank')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Open Form
              </button>
            </div>

            {/* Real VGA Form */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <span className="text-white font-bold text-lg">⚖️</span>
                </div>
                <h3 className="font-semibold text-green-900 text-lg">Real VGA Form</h3>
              </div>
              <p className="text-green-700 mb-4 text-sm">Actual Formstack form</p>
              <button
                onClick={() => window.open('https://intakes.formstack.com/forms/vga_agents_spbmcc?i-18763960-GFVHloP1Vr&', '_blank')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Open Form
              </button>
            </div>

            {/* ATS Replica Form */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <span className="text-white font-bold text-lg">🏢</span>
                </div>
                <h3 className="font-semibold text-purple-900 text-lg">ATS Replica Form</h3>
              </div>
              <p className="text-purple-700 mb-4 text-sm">ATS-style form</p>
              <button
                onClick={() => window.open(`/ats-form?agent=${agentId}`, '_blank')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Open Form
              </button>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
            <h3 className="font-semibold text-yellow-800 mb-4 text-lg flex items-center">
              <span className="mr-2">🧪</span>
              Testing Instructions
            </h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>RTS Mock VGA Form</strong> - Complete VGA replica for agents to collect data</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Real VGA Form</strong> - Actual Formstack form that needs to be auto-populated</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>ATS Replica Form</strong> - ATS-style form for alternative lead collection</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Data Transfer</strong> - RTS Test Form → Real VGA Form automation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Zip Code Tracking */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📍</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Zip Code Tracking
              </h2>
              <p className="text-gray-600 mt-1">Geographic data analysis and lead distribution</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">📍</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Zip Codes</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{leads.filter((lead: Lead) => lead.zipCode).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">🏆</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Top Zip Code</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {(() => {
                      const zipCounts = leads.reduce((acc: Record<string, number>, lead: Lead) => {
                        if (lead.zipCode) {
                          acc[lead.zipCode] = (acc[lead.zipCode] || 0) + 1;
                        }
                        return acc;
                      }, {} as Record<string, number>);
                      const topZip = Object.entries(zipCounts).sort((a, b) => b[1] - a[1])[0];
                      return topZip ? topZip[0] : 'N/A';
                    })()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Unique Zip Codes</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {new Set(leads.filter((lead: Lead) => lead.zipCode).map((lead: Lead) => lead.zipCode)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Meetings & One-on-Ones */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📞</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Zoom Meetings & One-on-Ones
              </h2>
              <p className="text-gray-600 mt-1">Appointment tracking and call management</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">📅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Scheduled Meetings</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">0</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">✅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Completed Calls</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">0</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">⏰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Calls</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">0</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">❌</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">No-Shows</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">0</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Meeting Schedule */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📅</span>
              Upcoming Meetings
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200/50">
              <p className="text-gray-500 text-center">No upcoming meetings scheduled</p>
            </div>
          </div>
        </div>

        {/* Agent Management */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">👥</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Agent Management
              </h2>
              <p className="text-gray-600 mt-1">Team performance tracking and management</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">👥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Agents</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{agents.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">✅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Active Agents</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{agents.filter((agent: Agent) => agent.isActive).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Top Agent</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {(() => {
                      const agentLeads = leads.reduce((acc, lead) => {
                        acc[lead.agentId] = (acc[lead.agentId] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      const topAgent = Object.entries(agentLeads).sort((a, b) => b[1] - a[1])[0];
                      return topAgent ? topAgent[0] : 'N/A';
                    })()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">💰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Leads/Agent</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {agents.length > 0 ? Math.round(leads.length / agents.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent List */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📈</span>
              Agent Performance
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-100 to-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Conversion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-200">
                    {agents.map((agent) => {
                      const agentLeads = leads.filter((lead: Lead) => lead.agentId === agent.agentId);
                                              const conversionRate = agentLeads.length > 0 ? 
                          Math.round((agentLeads.filter((lead: Lead) => lead.status === 'enrolled').length / agentLeads.length) * 100) : 0;
                      
                      return (
                        <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {agent.name}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {agent.agentId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              agent.isActive 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                            }`}>
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {agentLeads.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {conversionRate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* API Connection Test */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">🔗</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                API Connection Test
              </h2>
              <p className="text-gray-600 mt-1">System health and connectivity verification</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/gamer-lookup?platform=steam&username=testuser');
                      const data = await response.json();
                      if (data.error && data.error.includes('API key not configured')) {
                        alert('❌ Steam API key not configured in production. Check Vercel environment variables.');
                      } else {
                        alert('✅ Steam API connection working!');
                      }
                    } catch (error) {
                      alert('❌ Steam API connection failed. Check environment variables.');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  Test Steam API
                </button>
              </div>
              
              <div>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/gamer-lookup?platform=xbox&username=testuser');
                      const data = await response.json();
                      if (data.error && data.error.includes('API key not configured')) {
                        alert('❌ Xbox API key not configured in production. Check Vercel environment variables.');
                      } else {
                        alert('✅ Xbox API connection working!');
                      }
                    } catch (error) {
                      alert('❌ Xbox API connection failed. Check environment variables.');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  Test Xbox API
                </button>
              </div>
              
              <div>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/gamer-lookup?platform=playstation&username=testuser');
                      const data = await response.json();
                      if (data.qualificationStatus) {
                        alert('✅ PlayStation API connection working!');
                      } else {
                        alert('❌ PlayStation API connection failed.');
                      }
                    } catch (error) {
                      alert('❌ PlayStation API connection failed.');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  Test PlayStation API
                </button>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
              <h3 className="font-semibold text-yellow-800 mb-4 text-lg flex items-center">
                <span className="mr-2">💡</span>
                API Connection Help
              </h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Steam:</strong> Requires STEAM_API_KEY in Vercel environment variables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Xbox:</strong> Requires OPENXBL_API_KEY in Vercel environment variables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>PlayStation:</strong> Uses mock data (no API key needed)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>If tests fail:</strong> Add API keys to Vercel project settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gaming Lookup */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">🎮</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Gaming Profile Lookup
              </h2>
              <p className="text-gray-600 mt-1">Verify gaming profiles and qualification status</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={gamingLookup.platform}
                  onChange={(e) => setGamingLookup(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white/80 backdrop-blur-sm"
                >
                  <option value="steam" className="text-gray-900">Steam</option>
                  <option value="xbox" className="text-gray-900">Xbox</option>
                  <option value="playstation" className="text-gray-900">PlayStation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username/Gamertag
                </label>
                <input
                  type="text"
                  value={gamingLookup.username}
                  onChange={(e) => setGamingLookup(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleGamingLookup}
                  disabled={gamingLookup.isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gamingLookup.isLoading ? 'Looking up...' : 'Lookup Profile'}
                </button>
              </div>
            </div>

            {gamingLookup.result && (
              <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-8 border border-gray-200/50">
                <div className="flex items-center space-x-4 mb-6">
                  {gamingLookup.result.player?.profilePicture && (
                    <img 
                      src={gamingLookup.result.player.profilePicture} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {gamingLookup.result.player?.gamerTag || gamingLookup.username}
                    </h3>
                    <p className="text-gray-600 capitalize">
                      {gamingLookup.result.platform} Platform
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      gamingLookup.result.qualificationStatus === 'qualified' 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                        : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                    }`}>
                      {gamingLookup.result.qualificationStatus === 'qualified' ? '✅ Qualified' : '❌ Not Qualified'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
                        <span className="text-white font-bold text-lg">⏰</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Hours</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{gamingLookup.result.totalHours?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                        <span className="text-white font-bold text-lg">🎮</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">Games Owned</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{gamingLookup.result.totalGames || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg mr-4">
                        <span className="text-white font-bold text-lg">📊</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-600">Avg Hours/Day</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {gamingLookup.result && gamingLookup.result.totalHours ? Math.round(gamingLookup.result.totalHours / 365) : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {gamingLookup.result.qualificationReason && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-yellow-600 font-bold text-lg">💡</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-yellow-800">Qualification Reason</h4>
                        <p className="text-sm text-yellow-700 mt-1">{gamingLookup.result.qualificationReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {gamingLookup.result.topGames && gamingLookup.result.topGames.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Most Played Games</h4>
                    <div className="space-y-3">
                      {gamingLookup.result.topGames.slice(0, 5).map((game: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{game.name}</p>
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
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📝</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Intake Form Tracking
              </h2>
              <p className="text-gray-600 mt-1">Form submission analytics and processing status</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">📥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Forms Submitted</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{leads.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">📤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Sent to Lawyers</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{leads.filter((lead: Lead) => lead.status === 'contacted').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg mr-4">
                  <span className="text-white font-bold text-lg">💰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Paid Referrals</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{leads.filter((lead: Lead) => lead.status === 'enrolled').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📊</span>
              Form Status Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-blue-900">New Submissions</span>
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{leads.filter((lead: Lead) => lead.status === 'new').length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-yellow-900">Contacted by Lawyers</span>
                <span className="text-sm font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">{leads.filter((lead: Lead) => lead.status === 'contacted').length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-green-900">Qualified for Treatment</span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{leads.filter((lead: Lead) => lead.status === 'qualified').length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 hover:shadow-lg transition-all duration-200">
                <span className="text-sm font-semibold text-purple-900">Enrolled in Treatment</span>
                <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{leads.filter((lead: Lead) => lead.status === 'enrolled').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Eligibility Tracking */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">🎯</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Bonus Eligibility Tracking
              </h2>
              <p className="text-gray-600 mt-1">$10 Extra Per Enrollment - Automatically Detected</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligibility Requirements */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200/50">
              <h3 className="font-semibold text-yellow-800 mb-4 text-lg flex items-center">
                <span className="mr-2">📋</span>
                Eligibility Requirements
              </h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>22 years old or younger</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Xbox platform only</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>1,100+ total gameplay hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Must play Call of Duty, GTA5, Fortnite, Minecraft, or Roblox</span>
                </li>
              </ul>
            </div>

            {/* Automatic Detection Results */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
              <h3 className="font-semibold text-green-800 mb-4 text-lg flex items-center">
                <span className="mr-2">🎯</span>
                Automatic Detection Results
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Total Leads Analyzed:</span>
                  <span className="text-lg font-bold text-green-600">{leads.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Bonus Eligible:</span>
                  <span className="text-lg font-bold text-green-600">{leads.filter((lead: Lead) => checkBonusEligibility(lead)).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Bonus Rate:</span>
                  <span className="text-lg font-bold text-green-600">
                    {leads.length > 0 ? Math.round((leads.filter((lead: Lead) => checkBonusEligibility(lead)).length / leads.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus Eligible Leads Table */}
                          {leads.filter((lead: Lead) => checkBonusEligibility(lead)).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-yellow-800 mb-4 text-lg flex items-center">
                <span className="mr-2">🎯</span>
                Bonus Eligible Leads
              </h3>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-yellow-200">
                    <thead className="bg-gradient-to-r from-yellow-100 to-orange-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                          Platform
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                          Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                          Games
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-yellow-200">
                      {leads.filter((lead: Lead) => checkBonusEligibility(lead)).map((lead: Lead) => (
                        <tr key={lead.id} className="hover:bg-yellow-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {lead.gamerFirstName} {lead.gamerLastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getAgeFromLead(lead)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getPlatformFromLead(lead)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getHoursFromLead(lead)}+ hours
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getGamesFromLead(lead).join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🎯 Bonus Eligible
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Recent Leads
              </h2>
              <p className="text-gray-600 mt-1">Latest lead submissions and activity</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Emergency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {lead.gamerFirstName} {lead.gamerLastName}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          Agent: {lead.agentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          lead.status === 'new' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                          lead.status === 'contacted' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200' :
                          lead.status === 'qualified' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200' :
                          lead.status === 'enrolled' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200' :
                          'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.hasEmergencyIndicators ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
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
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📋</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">No leads yet</p>
                <p className="text-gray-400 text-sm mt-1">Generate a QR code and start collecting leads!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 