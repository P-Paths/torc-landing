'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

interface ReportData {
  totalLeads: number;
  totalAgents: number;
  totalCommission: number;
  totalBonus: number;
  conversionRate: number;
  monthlyGrowth: number;
  topAgents: Array<{
    name: string;
    agentId: string;
    leads: number;
    commission: number;
  }>;
  leadSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  monthlyLeads: Array<{
    month: string;
    leads: number;
    commission: number;
  }>;
  zipCodeData: Array<{
    zipCode: string;
    count: number;
    percentage: number;
  }>;
  ageDemographics: Array<{
    ageRange: string;
    count: number;
    percentage: number;
  }>;
  leadIdentities: Array<{
    identity: string;
    count: number;
    percentage: number;
  }>;
}

export default function ReportsPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const loadRealData = async () => {
      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API calls to get real data
        const realData: ReportData = {
          totalLeads: 0,
          totalAgents: 0,
          totalCommission: 0,
          totalBonus: 0,
          conversionRate: 0,
          monthlyGrowth: 0,
          topAgents: [],
          leadSources: [],
          monthlyLeads: [],
          zipCodeData: [],
          ageDemographics: [],
          leadIdentities: []
        };
        
        setReportData(realData);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRealData();
  }, [dateRange]);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <AdminLayout agentId={agentId} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">Real data insights into your lead generation performance</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
            >
              <option value="7d" className="text-gray-900">Last 7 Days</option>
              <option value="30d" className="text-gray-900">Last 30 Days</option>
              <option value="90d" className="text-gray-900">Last 90 Days</option>
              <option value="1y" className="text-gray-900">Last Year</option>
            </select>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{reportData?.totalLeads.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-600">+{reportData?.monthlyGrowth || '0'}% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">${reportData?.totalCommission.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-600">+${reportData?.totalBonus.toLocaleString() || '0'} in bonuses</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{reportData?.conversionRate || '0'}%</p>
                <p className="text-xs text-blue-600">Qualified leads</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{reportData?.totalAgents || '0'}</p>
                <p className="text-xs text-gray-600">Generating leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Zip Code Tracking */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">📍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Zip Code Distribution</h3>
            </div>
            {reportData?.zipCodeData && reportData.zipCodeData.length > 0 ? (
              <div className="space-y-2">
                {reportData.zipCodeData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-medium">{item.zipCode}</span>
                    <span className="text-sm text-gray-600">{item.count} leads ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No zip code data available</p>
            )}
          </div>

          {/* Age Demographics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">👤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Age Demographics</h3>
            </div>
            {reportData?.ageDemographics && reportData.ageDemographics.length > 0 ? (
              <div className="space-y-2">
                {reportData.ageDemographics.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-medium">{item.ageRange}</span>
                    <span className="text-sm text-gray-600">{item.count} leads ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No age data available</p>
            )}
          </div>

          {/* Lead Identities */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">🆔</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Lead Identities</h3>
            </div>
            {reportData?.leadIdentities && reportData.leadIdentities.length > 0 ? (
              <div className="space-y-2">
                {reportData.leadIdentities.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-medium">{item.identity}</span>
                    <span className="text-sm text-gray-600">{item.count} leads ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No identity data available</p>
            )}
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-12 text-center">
          <div className="text-gray-400 text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Real Data Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            This dashboard will show real analytics when you start generating leads and collecting data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-blue-900 mb-1">Lead Analytics</h3>
              <p className="text-sm text-blue-700">Track lead sources, conversion rates, and performance metrics</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-green-900 mb-1">Commission Tracking</h3>
              <p className="text-sm text-green-700">Monitor earnings, bonuses, and agent performance</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-purple-900 mb-1">Growth Insights</h3>
              <p className="text-sm text-purple-700">Identify trends and optimization opportunities</p>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">🎯 Conversion Optimization</h4>
              <p className="text-sm text-blue-700">
                Focus on follow-up timing and lead qualification to improve conversion rates.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">📈 Growth Opportunity</h4>
              <p className="text-sm text-blue-700">
                Consider expanding to new gaming communities and platforms for lead generation.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">💰 Revenue Potential</h4>
              <p className="text-sm text-blue-700">
                Focus on Xbox gamertag verification for additional $10 bonuses per qualified lead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
