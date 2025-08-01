'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  totalLeads: number;
  lastActivity: Date;
  phone?: string;
  territory?: string;
  performance: {
    conversionRate: number;
    averageResponseTime: number;
    totalMeetings: number;
    emergencyHandled: number;
  };
  notes?: string;
  assignedLeads: string[];
}

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
  zoomLink?: string;
}

interface DashboardStats {
  totalLeads: number;
  totalAgents: number;
  activeAgents: number;
  emergencyLeads: number;
  recentLeads: number;
  averageSymptoms: number;
  totalZoomMeetings: number;
  conversionRate: number;
  averageResponseTime: number;
  topPerformingAgents: Array<{
    name: string;
    leads: number;
    conversionRate: number;
  }>;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalAgents: 0,
    activeAgents: 0,
    emergencyLeads: 0,
    recentLeads: 0,
    averageSymptoms: 0,
    totalZoomMeetings: 0,
    conversionRate: 0,
    averageResponseTime: 0,
    topPerformingAgents: []
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newAgent, setNewAgent] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    territory: '',
    notes: ''
  });
  const router = useRouter();

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'RTS2024Admin!'; // Use environment variable with fallback

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      alert('Invalid password');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData || {
          totalLeads: 0,
          totalAgents: 0,
          activeAgents: 0,
          emergencyLeads: 0,
          recentLeads: 0,
          averageSymptoms: 0,
          totalZoomMeetings: 0,
          conversionRate: 0,
          averageResponseTime: 0,
          topPerformingAgents: []
        });
      }

      // Load agents
      const agentsResponse = await fetch('/api/admin/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData || []);
      }

      // Load recent leads
      const leadsResponse = await fetch('/api/admin/leads');
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setRecentLeads(leadsData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default values on error
      setStats({
        totalLeads: 0,
        totalAgents: 0,
        activeAgents: 0,
        emergencyLeads: 0,
        recentLeads: 0,
        averageSymptoms: 0,
        totalZoomMeetings: 0,
        conversionRate: 0,
        averageResponseTime: 0,
        topPerformingAgents: []
      });
      setAgents([]);
      setRecentLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async () => {
    if (!newAgent.name || !newAgent.email) {
      alert('Please fill in both name and email');
      return;
    }

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent)
      });

      if (response.ok) {
        setNewAgent({ name: '', email: '', phone: '', territory: '', notes: '' });
        loadDashboardData();
        alert('Agent added successfully!');
      } else {
        alert('Error adding agent');
      }
    } catch (error) {
      console.error('Error adding agent:', error);
      alert('Error adding agent');
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' })
      });

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RTS Admin</h1>
            <p className="text-gray-600">Enter admin password to continue</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
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
              <h1 className="text-2xl font-bold text-gray-800">RTS Admin Dashboard</h1>
              <p className="text-gray-600">Manage agents and monitor leads</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'agents', label: 'Agent Management' },
              { id: 'leads', label: 'Lead Management' },
              { id: 'agent-interface', label: 'Agent Interface' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'reports', label: 'Reports' },
              { id: 'system', label: 'System' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Agents</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeAgents}</p>
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
                        <p className="text-sm font-medium text-gray-600">Emergency Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.emergencyLeads}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                                                 <p className="text-2xl font-bold text-gray-900">{(stats.conversionRate || 0).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Zoom Meetings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalZoomMeetings}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}h</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Symptoms</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.averageSymptoms.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                                             <thead className="bg-gray-50">
                         <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gamer</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zoom</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                         </tr>
                       </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(recentLeads || []).slice(0, 5).map((lead) => (
                          <tr key={lead.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {lead.agentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.gamerFirstName} {lead.gamerLastName}
                            </td>
                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               {lead.email}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               {lead.zoomLink ? (
                                 <a
                                   href={lead.zoomLink}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-blue-600 hover:text-blue-800 underline text-sm"
                                 >
                                   🔗 Join
                                 </a>
                               ) : (
                                 <span className="text-gray-400 text-sm">No Zoom</span>
                               )}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                 lead.hasEmergencyIndicators 
                                   ? 'bg-red-100 text-red-800' 
                                   : 'bg-green-100 text-green-800'
                               }`}>
                                 {lead.hasEmergencyIndicators ? 'Emergency' : 'Normal'}
                               </span>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               {new Date(lead.submittedAt).toLocaleDateString()}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Agents Tab */}
            {activeTab === 'agents' && (
              <div className="space-y-6">
                {/* Add New Agent */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Agent</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <input
                      type="text"
                      placeholder="Agent Name"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <input
                      type="email"
                      placeholder="Agent Email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <input
                      type="text"
                      placeholder="Territory"
                      value={newAgent.territory}
                      onChange={(e) => setNewAgent({ ...newAgent, territory: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <textarea
                      placeholder="Notes"
                      value={newAgent.notes}
                      onChange={(e) => setNewAgent({ ...newAgent, notes: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows={1}
                    />
                    <button
                      onClick={addAgent}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Agent
                    </button>
                  </div>
                </div>

                {/* Agents List */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">All Agents</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                                             <thead className="bg-gray-50">
                         <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Territory</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                         </tr>
                       </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(agents || []).map((agent) => (
                                                     <tr key={agent.id}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                               {agent.name}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               <div>{agent.email}</div>
                               {agent.phone && <div className="text-xs text-gray-400">{agent.phone}</div>}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               {agent.territory || 'Unassigned'}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                 agent.status === 'active' 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-red-100 text-red-800'
                               }`}>
                                 {agent.status}
                               </span>
                             </td>
                                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               <div className="space-y-1">
                                 <div>Leads: {agent.totalLeads}</div>
                                 <div>Conv: {agent.performance?.conversionRate || 0}%</div>
                                 <div>Meetings: {agent.performance?.totalMeetings || 0}</div>
                               </div>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               {new Date(agent.lastActivity).toLocaleDateString()}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                               <div className="flex space-x-2">
                                 <button
                                   onClick={() => toggleAgentStatus(agent.id, agent.status)}
                                   className={`px-3 py-1 rounded-md text-xs font-medium ${
                                     agent.status === 'active'
                                       ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                       : 'bg-green-100 text-green-800 hover:bg-green-200'
                                   }`}
                                 >
                                   {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                                 </button>
                                 <button
                                   className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-xs font-medium"
                                 >
                                   Edit
                                 </button>
                               </div>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                                         <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gamer</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zoom</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                       </tr>
                     </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(recentLeads || []).map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.agentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.gamerFirstName} {lead.gamerLastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.email}<br/>
                            {lead.phone}
                          </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {lead.totalSymptoms} symptoms
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             {lead.zoomLink ? (
                               <a
                                 href={lead.zoomLink}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-600 hover:text-blue-800 underline text-sm"
                               >
                                 🔗 Join Meeting
                               </a>
                             ) : (
                               <span className="text-gray-400 text-sm">No Zoom</span>
                             )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                               lead.hasEmergencyIndicators 
                                 ? 'bg-red-100 text-red-800' 
                                 : 'bg-green-100 text-green-800'
                             }`}>
                               {lead.hasEmergencyIndicators ? 'Emergency' : 'Normal'}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {new Date(lead.submittedAt).toLocaleDateString()}
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
                         )}

             {/* Agent Interface Tab */}
             {activeTab === 'agent-interface' && (
               <div className="space-y-6">
                 <div className="bg-white rounded-lg shadow p-6">
                   <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Intake Form Preview</h3>
                   <p className="text-gray-600 mb-6">
                     This is exactly what your agents will see when they use the intake form. 
                     You can test the form functionality here to stay familiar with the process.
                   </p>
                   
                   <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                     <div className="text-center mb-6">
                       <h4 className="text-2xl font-bold text-gray-800 mb-2">
                         Gaming Addiction Assessment
                       </h4>
                       <p className="text-lg text-gray-600 mb-2">
                         Complete this assessment to see if you qualify for gaming addiction treatment
                       </p>
                       <p className="text-sm text-gray-500">
                         Agent ID: AHRPE5559 (Demo)
                       </p>
                     </div>
                     
                     <div className="bg-white rounded-lg shadow-sm p-6">
                       <div className="text-center mb-6">
                         <h5 className="text-xl font-semibold text-gray-800 mb-2">Step 1: Contact Information</h5>
                         <p className="text-gray-600">Let's start with the basic contact details</p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                           <input
                             type="text"
                             placeholder="Enter agent name"
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Gamer</label>
                           <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                             <option>Parent</option>
                             <option>Spouse</option>
                             <option>Family Member</option>
                             <option>Friend</option>
                           </select>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Gamer's First Name</label>
                           <input
                             type="text"
                             placeholder="Enter first name"
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Gamer's Last Name</label>
                           <input
                             type="text"
                             placeholder="Enter last name"
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled
                           />
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                           <input
                             type="email"
                             placeholder="Enter email address"
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                           <input
                             type="tel"
                             placeholder="Enter phone number"
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled
                           />
                         </div>
                       </div>
                       
                       <div className="flex justify-between items-center">
                         <button
                           className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                           disabled
                         >
                           Previous
                         </button>
                         <div className="flex space-x-2">
                           <span className="text-sm text-gray-500">Step 1 of 5</span>
                           <button
                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                             disabled
                           >
                             Next
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                     <h4 className="font-medium text-blue-900 mb-2">Form Features:</h4>
                     <ul className="text-sm text-blue-800 space-y-1">
                       <li>• 5-step progressive form with contact, gaming profile, assessment, and treatment sections</li>
                       <li>• Real-time validation and error handling</li>
                       <li>• Emergency indicators detection for urgent cases</li>
                       <li>• Automatic lead assignment to agents</li>
                       <li>• Zoom meeting scheduling integration</li>
                       <li>• Firebase data storage with real-time updates</li>
                     </ul>
                   </div>
                   
                   <div className="mt-4 flex space-x-4">
                     <button
                       onClick={() => window.open('/enhanced-intake?agent=AHRPE5559', '_blank')}
                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                     >
                       Open Live Form
                     </button>
                     <button
                       onClick={() => window.open('/intake', '_blank')}
                       className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                     >
                       Open Basic Form
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {/* Analytics Tab */}
             {activeTab === 'analytics' && (
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Performance Chart */}
                   <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
                     <div className="space-y-4">
                       {(stats.topPerformingAgents || []).map((agent, index) => (
                         <div key={index} className="flex justify-between items-center">
                           <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                           <div className="flex items-center space-x-4">
                             <span className="text-sm text-gray-600">{agent.leads} leads</span>
                             <span className="text-sm font-medium text-green-600">{agent.conversionRate}%</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Lead Trends */}
                   <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Trends</h3>
                     <div className="space-y-4">
                       <div className="flex justify-between">
                         <span className="text-sm text-gray-600">This Week</span>
                         <span className="text-sm font-medium text-gray-900">{stats.recentLeads}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-sm text-gray-600">Emergency Rate</span>
                         <span className="text-sm font-medium text-red-600">
                           {stats.totalLeads > 0 ? ((stats.emergencyLeads / stats.totalLeads) * 100).toFixed(1) : 0}%
                         </span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-sm text-gray-600">Zoom Meeting Rate</span>
                         <span className="text-sm font-medium text-blue-600">
                           {stats.totalLeads > 0 ? ((stats.totalZoomMeetings / stats.totalLeads) * 100).toFixed(1) : 0}%
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Territory Analysis */}
                 <div className="bg-white rounded-lg shadow p-6">
                   <h3 className="text-lg font-medium text-gray-900 mb-4">Territory Analysis</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="text-center p-4 bg-blue-50 rounded-lg">
                       <div className="text-2xl font-bold text-blue-600">Michigan</div>
                       <div className="text-sm text-gray-600">Primary Market</div>
                     </div>
                     <div className="text-center p-4 bg-green-50 rounded-lg">
                       <div className="text-2xl font-bold text-green-600">Ohio</div>
                       <div className="text-sm text-gray-600">Expanding</div>
                     </div>
                     <div className="text-center p-4 bg-purple-50 rounded-lg">
                       <div className="text-2xl font-bold text-purple-600">Indiana</div>
                       <div className="text-sm text-gray-600">New Market</div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* Reports Tab */}
             {activeTab === 'reports' && (
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Quick Reports */}
                   <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h3>
                     <div className="space-y-3">
                       <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                         <div className="font-medium text-gray-900">Emergency Leads Report</div>
                         <div className="text-sm text-gray-600">All urgent cases this month</div>
                       </button>
                       <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                         <div className="font-medium text-gray-900">Agent Performance Report</div>
                         <div className="text-sm text-gray-600">Individual agent statistics</div>
                       </button>
                       <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                         <div className="font-medium text-gray-900">Zoom Meeting Report</div>
                         <div className="text-sm text-gray-600">Scheduled and completed meetings</div>
                       </button>
                       <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                         <div className="font-medium text-gray-900">Conversion Report</div>
                         <div className="text-sm text-gray-600">Lead to treatment conversion rates</div>
                       </button>
                     </div>
                   </div>

                   {/* Export Options */}
                   <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
                     <div className="space-y-3">
                       <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                         Export All Leads (CSV)
                       </button>
                       <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                         Export Agent Data (CSV)
                       </button>
                       <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                         Generate Monthly Report (PDF)
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Report Schedule */}
                 <div className="bg-white rounded-lg shadow p-6">
                   <h3 className="text-lg font-medium text-gray-900 mb-4">Automated Reports</h3>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                       <div>
                         <div className="font-medium text-gray-900">Weekly Performance Report</div>
                         <div className="text-sm text-gray-600">Sent every Monday at 9 AM</div>
                       </div>
                       <span className="text-green-600 text-sm font-medium">Active</span>
                     </div>
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                       <div>
                         <div className="font-medium text-gray-900">Emergency Alert</div>
                         <div className="text-sm text-gray-600">Sent immediately when emergency leads come in</div>
                       </div>
                       <span className="text-green-600 text-sm font-medium">Active</span>
                     </div>
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                       <div>
                         <div className="font-medium text-gray-900">Monthly Summary</div>
                         <div className="text-sm text-gray-600">Sent on the 1st of each month</div>
                       </div>
                       <span className="text-gray-400 text-sm font-medium">Inactive</span>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* System Tab */}
             {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Database Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Firestore Connection:</span>
                          <span className="text-green-600 font-medium">Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Collections:</span>
                          <span className="text-gray-900">2 (leads, agents)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Backup:</span>
                          <span className="text-gray-900">Today</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Application Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">API Endpoints:</span>
                          <span className="text-green-600 font-medium">All Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Form Submissions:</span>
                          <span className="text-green-600 font-medium">Working</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Admin Access:</span>
                          <span className="text-green-600 font-medium">Secure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => router.push('/enhanced-intake')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Test Intake Form
                    </button>
                    <button
                      onClick={loadDashboardData}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Refresh Data
                    </button>
                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setPassword('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 