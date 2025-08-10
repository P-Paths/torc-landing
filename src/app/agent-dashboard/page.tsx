'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  id: string;
  agentId: string;
  agentName: string;
  gamerFirstName: string;
  gamerLastName: string;
  email: string;
  phone: string;
  address: string;
  status: 'new' | 'contacted' | 'registered' | 'zoom_scheduled' | 'zoom_completed' | 'converted';
  submittedAt: Date;
  hasEmergencyIndicators: boolean;
  totalSymptoms: number;
  zoomLink?: string;
  zoomScheduledAt?: Date;
  gamingPlatforms: {
    xbox?: { gamertag: string; hoursPlayed?: number };
    playstation?: { psnId: string; hoursPlayed?: number };
    steam?: { steamId: string; hoursPlayed?: number };
  };
  notes?: string;
}

interface AgentStats {
  totalLeads: number;
  recentLeads: number;
  emergencyLeads: number;
  averageSymptoms: number;
  conversionRate: number;
  platformStats: {
    xbox: number;
    playstation: number;
    steam: number;
  };
  zoomMeetings: {
    scheduled: number;
    completed: number;
    pending: number;
  };
}

export default function AgentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [gamingLookup, setGamingLookup] = useState({
    platform: 'xbox',
    username: '',
    result: null as any
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAgentLoggedIn = localStorage.getItem('isAgentLoggedIn') === 'true';
      const storedAgentId = localStorage.getItem('agentId');
      const storedAgentName = localStorage.getItem('agentName');

      if (isAgentLoggedIn && storedAgentId && storedAgentName) {
        setIsAuthenticated(true);
        setAgentId(storedAgentId);
        setAgentName(storedAgentName);
        loadDashboardData();
      } else {
        router.push('/agent-login');
      }
    };

    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Load leads for this agent
      const leadsResponse = await fetch('/api/admin/leads');
      const allLeads = await leadsResponse.json();
      const agentLeads = (allLeads.leads || []).filter((lead: Lead) => lead.agentId === agentId);
      setLeads(agentLeads);

      // Calculate stats
      const totalLeads = agentLeads.length;
      const recentLeads = agentLeads.filter((lead: Lead) => 
        new Date(lead.submittedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length;
      const emergencyLeads = agentLeads.filter((lead: Lead) => lead.hasEmergencyIndicators).length;
      const averageSymptoms = agentLeads.length > 0 
        ? agentLeads.reduce((sum: number, lead: Lead) => sum + lead.totalSymptoms, 0) / agentLeads.length 
        : 0;
      const convertedLeads = agentLeads.filter((lead: Lead) => lead.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Platform stats
      const platformStats = {
        xbox: agentLeads.filter((lead: Lead) => lead.gamingPlatforms?.xbox).length,
        playstation: agentLeads.filter((lead: Lead) => lead.gamingPlatforms?.playstation).length,
        steam: agentLeads.filter((lead: Lead) => lead.gamingPlatforms?.steam).length
      };

      // Zoom stats
      const zoomMeetings = {
        scheduled: agentLeads.filter((lead: Lead) => lead.status === 'zoom_scheduled').length,
        completed: agentLeads.filter((lead: Lead) => lead.status === 'zoom_completed').length,
        pending: agentLeads.filter((lead: Lead) => lead.status === 'contacted').length
      };

      setStats({
        totalLeads,
        recentLeads,
        emergencyLeads,
        averageSymptoms: Math.round(averageSymptoms * 10) / 10,
        conversionRate: Math.round(conversionRate * 10) / 10,
        platformStats,
        zoomMeetings
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const generateQRCode = () => {
    const qrUrl = `${window.location.origin}/?agent=${agentId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`;
    setQrCodeUrl(qrCodeUrl);
    setShowQRModal(true);
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${agentId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGamingLookup = async () => {
    if (!gamingLookup.username) return;

    try {
      const response = await fetch(`/api/gamer-lookup?platform=${gamingLookup.platform}&username=${gamingLookup.username}`);
      const data = await response.json();
      setGamingLookup(prev => ({ ...prev, result: data }));
    } catch (error) {
      console.error('Error looking up gaming profile:', error);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      // In a real app, this would update the database
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      loadDashboardData(); // Reload to update stats
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAgentLoggedIn');
    localStorage.removeItem('agentId');
    localStorage.removeItem('agentName');
    router.push('/agent-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar with Agent Info and Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {agentName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Agent ID: {agentId}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <button
            onClick={generateQRCode}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left max-w-md"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Generate QR Code</h3>
                <p className="text-sm text-gray-600">Create QR code for lead collection</p>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalLeads || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.conversionRate || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Zoom Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.zoomMeetings.scheduled || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emergency Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.emergencyLeads || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Leads Management with ATS Tool */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your Leads</h3>
              </div>
              
              {/* ATS Gaming Lookup Tool - Now at top of leads section */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-md font-semibold text-gray-900 mb-3">🎮 ATS Gaming Profile Lookup</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={gamingLookup.platform}
                    onChange={(e) => setGamingLookup(prev => ({ ...prev, platform: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="xbox">Xbox</option>
                    <option value="playstation">PlayStation</option>
                    <option value="steam">Steam</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter username/gamertag"
                    value={gamingLookup.username}
                    onChange={(e) => setGamingLookup(prev => ({ ...prev, username: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  />
                  <button
                    onClick={handleGamingLookup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Lookup Profile
                  </button>
                  <a
                    href="http://tag-checker.tortconnector.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                  >
                    ATS Tool
                  </a>
                </div>

                {gamingLookup.result && (
                  <div className="mt-3 bg-white rounded-lg p-3 border">
                    <h5 className="font-semibold text-gray-900 mb-2">Profile Found</h5>
                    <p className="text-sm text-gray-600">
                      <strong>Username:</strong> {gamingLookup.result.player?.gamerTag || 'N/A'}<br/>
                      <strong>Platform:</strong> {gamingLookup.result.platform}<br/>
                      <strong>Hours:</strong> {gamingLookup.result.totalHours?.toLocaleString() || 'N/A'}<br/>
                      <strong>Status:</strong> 
                      <span className={`ml-1 ${
                        gamingLookup.result.qualificationStatus === 'qualified' 
                          ? 'text-green-600 font-semibold' 
                          : 'text-red-600 font-semibold'
                      }`}>
                        {gamingLookup.result.qualificationStatus === 'qualified' ? '✅ Qualified' : '❌ Not Qualified'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.gamerFirstName} {lead.gamerLastName}
                            </div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {lead.gamingPlatforms?.xbox && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Xbox
                              </span>
                            )}
                            {lead.gamingPlatforms?.playstation && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                PS
                              </span>
                            )}
                            {lead.gamingPlatforms?.steam && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Steam
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'new' ? 'bg-gray-100 text-gray-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'zoom_scheduled' ? 'bg-purple-100 text-purple-800' :
                            lead.status === 'zoom_completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lead.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.totalSymptoms} symptoms
                          {lead.hasEmergencyIndicators && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              EMERGENCY
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowLeadModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your QR Code</h3>
              <div className="mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto border border-gray-200 rounded-lg" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to direct leads to your opt-in form
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Management Modal */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Manage Client: {selectedLead.gamerFirstName} {selectedLead.gamerLastName}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as Lead['status'])}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="registered">Registered</option>
                    <option value="zoom_scheduled">Zoom Scheduled</option>
                    <option value="zoom_completed">Zoom Completed</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={selectedLead.address || ''}
                    onChange={(e) => {
                      setSelectedLead(prev => prev ? { ...prev, address: e.target.value } : null);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter client address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Zoom Link</label>
                  <input
                    type="url"
                    value={selectedLead.zoomLink || ''}
                    onChange={(e) => {
                      setSelectedLead(prev => prev ? { ...prev, zoomLink: e.target.value } : null);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={selectedLead.notes || ''}
                    onChange={(e) => {
                      setSelectedLead(prev => prev ? { ...prev, notes: e.target.value } : null);
                    }}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this client..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Save changes
                    setShowLeadModal(false);
                    loadDashboardData();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 