'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  platforms?: string[];
  gamertags?: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  dailyHours?: string;
  primaryGames?: string[];
}

interface AgentStats {
  totalLeads: number;
  recentLeads: number;
  qualifiedLeads: number;
  totalCommission: number;
  bonusEligibleLeads: number;
}

export default function AgentDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') || 'AHRPE5559';
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<AgentStats>({
    totalLeads: 0,
    recentLeads: 0,
    qualifiedLeads: 0,
    totalCommission: 0,
    bonusEligibleLeads: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadAgentData = async () => {
    try {
      // Load leads for this specific agent
      const response = await fetch(`/api/admin/leads?agent=${agentId}`);
      if (response.ok) {
        const data = await response.json();
        const agentLeads = data.leads?.filter((lead: Lead) => lead.agentId === agentId) || [];
        setLeads(agentLeads);
        
        // Calculate stats
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        setStats({
          totalLeads: agentLeads.length,
          recentLeads: agentLeads.filter((lead: Lead) => new Date(lead.submittedAt) > thirtyDaysAgo).length,
          qualifiedLeads: agentLeads.filter((lead: Lead) => lead.status === 'qualified').length,
          totalCommission: agentLeads.length * 40, // $40 per lead
          bonusEligibleLeads: agentLeads.filter((lead: Lead) => 
            lead.platforms?.includes('xbox') && lead.gamertags?.xbox
          ).length
        });
      }
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgentData();
  }, [agentId]);

  const generateQRCode = () => {
    const qrUrl = `${window.location.origin}/ats-form?agent=${agentId}`;
    // In a real implementation, you'd generate a QR code here
    alert(`QR Code URL: ${qrUrl}`);
  };

  const downloadQRCode = () => {
    const qrUrl = `${window.location.origin}/ats-form?agent=${agentId}`;
    // In a real implementation, you'd download the QR code image
    alert(`Downloading QR code for: ${qrUrl}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Agent Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Agent ID: <span className="font-mono bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full text-blue-800 font-semibold">{agentId}</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={generateQRCode}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Generate QR Code
              </button>
              <button
                onClick={downloadQRCode}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
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

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">🆕</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent (30d)</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.recentLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.qualifiedLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commission</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">${stats.totalCommission}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">🎮</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bonus Eligible</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{stats.bonusEligibleLeads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">⚡</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quick Actions
              </h2>
              <p className="text-gray-600 mt-1">Common tasks and shortcuts</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push(`/ats-form?agent=${agentId}`)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="text-lg font-semibold mb-2">View Opt-In Form</h3>
                <p className="text-sm opacity-90">See how your form looks to leads</p>
              </div>
            </button>
            
            <button
              onClick={() => router.push(`/rts-test?agent=${agentId}`)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-lg font-semibold mb-2">View Intake Form</h3>
                <p className="text-sm opacity-90">Complete case evaluation form</p>
              </div>
            </button>
            
            <button
              onClick={() => router.push(`/admin/gaming-lookup`)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="text-lg font-semibold mb-2">Gaming Lookup</h3>
                <p className="text-sm opacity-90">Verify gamertags for bonuses</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Recent Leads
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
                      Gaming Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Loading your leads...
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        <div className="py-8">
                          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-gray-400 text-2xl">📋</span>
                          </div>
                          <p className="text-gray-500 text-lg font-medium">No leads yet</p>
                          <p className="text-gray-400 text-sm mt-1">Generate a QR code and start collecting leads!</p>
                          <button
                            onClick={generateQRCode}
                            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                          >
                            Generate QR Code
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {lead.gamerFirstName} {lead.gamerLastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.platforms?.join(', ') || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.dailyHours || 'N/A'} hours/day
                          </div>
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
                          <div className="text-sm font-semibold text-green-600">$40.00</div>
                          {lead.platforms?.includes('xbox') && lead.gamertags?.xbox && (
                            <div className="text-xs text-blue-600">+$10.00 bonus</div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
