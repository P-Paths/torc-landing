'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  QrCode, 
  Users, 
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Agent {
  id: string;
  agent_id: string;
  name: string;
  email: string;
  phone?: string;
  commission_rate: number;
  bonus_rate: number;
  status: string;
  created_at: string;
}

interface Lead {
  id: string;
  gamer_first_name?: string;
  gamer_last_name?: string;
  email?: string;
  phone?: string;
  status: string;
  source: string;
  submitted_at: string;
  is_bonus_eligible: boolean;
  platforms?: string[];
  gamertags?: Record<string, string>;
}

interface AgentStats {
  totalLeads: number;
  validLeads: number;
  bonusLeads: number;
  commissionTotal: number;
}

export default function AgentDashboardPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgentData();
  }, [agentId]);

  const fetchAgentData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch agent details
      const agentResponse = await fetch(`/api/admin/agents`);
      const agentData = await agentResponse.json();
      const currentAgent = agentData.agents?.find((a: Agent) => a.agent_id === agentId);
      
      if (!currentAgent) {
        setError('Agent not found');
        return;
      }
      
      setAgent(currentAgent);
      
      // Fetch agent leads
      const leadsResponse = await fetch(`/api/admin/leads`);
      const leadsData = await leadsResponse.json();
      const agentLeads = leadsData.leads?.filter((l: Lead) => l.agent_id === agentId) || [];
      setLeads(agentLeads);
      
      // Calculate stats
      const totalLeads = agentLeads.length;
      const validLeads = agentLeads.filter(lead => lead.status === 'qualified').length;
      const bonusLeads = agentLeads.filter(lead => lead.is_bonus_eligible).length;
      const commissionTotal = (validLeads * currentAgent.commission_rate) + (bonusLeads * currentAgent.bonus_rate);
      
      setStats({
        totalLeads,
        validLeads,
        bonusLeads,
        commissionTotal
      });
      
    } catch (err) {
      setError('Failed to load agent data');
      console.error('Error fetching agent data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = () => {
    const trackingUrl = `${window.location.origin}/rts-test?agent=${agentId}`;
    // In a real implementation, you'd generate a QR code here
    // For now, just show the tracking URL
    alert(`Your tracking URL: ${trackingUrl}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested agent could not be found.'}</p>
          <a 
            href="/agent-register" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Register as Agent
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600">Welcome back, {agent.name}</p>
            </div>
            <button
              onClick={generateQRCode}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Get QR Code</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalLeads || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valid Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.validLeads || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bonus Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.bonusLeads || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">${stats?.commissionTotal || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-500">Agent ID: {agent.agent_id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-900">{agent.email}</p>
                </div>

                {agent.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-900">{agent.phone}</p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Commission Rate</p>
                    <p className="text-sm text-gray-500">${agent.commission_rate} per lead</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bonus Rate</p>
                    <p className="text-sm text-gray-500">${agent.bonus_rate} per eligible lead</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-500">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gamer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No leads yet</p>
                          <p className="text-sm">Start sharing your QR code to get leads!</p>
                        </td>
                      </tr>
                    ) : (
                      leads.slice(0, 10).map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.gamer_first_name} {lead.gamer_last_name}
                              </div>
                              {lead.platforms && lead.platforms.length > 0 && (
                                <div className="text-sm text-gray-500">
                                  {lead.platforms.join(', ')}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.email}</div>
                            {lead.phone && (
                              <div className="text-sm text-gray-500">{lead.phone}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              lead.status === 'qualified' 
                                ? 'bg-green-100 text-green-800'
                                : lead.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {lead.status}
                            </span>
                            {lead.is_bonus_eligible && (
                              <div className="mt-1">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                  Bonus Eligible
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.submitted_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {leads.length > 10 && (
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <a 
                    href="#" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all {leads.length} leads
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 