'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

interface Lead {
  id: string;
  agentName: string;
  relation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    agentName: 'agent123',
    relation: 'Mother',
    firstName: 'Brenda',
    lastName: 'Smith',
    email: 'brenda@example.com',
    phone: '555-123-4567',
    status: 'Qualified',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '2',
    agentName: 'agent456',
    relation: 'Mother',
    firstName: 'Brenda',
    lastName: 'Smith',
    email: 'brenda@example.com',
    phone: '555-123-4567',
    status: 'Qualified',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    agentName: 'agent789',
    relation: 'Mother',
    firstName: 'Brenda',
    lastName: 'Smith',
    email: 'brenda@example.com',
    phone: '555-123-4567',
    status: 'Qualified',
    createdAt: new Date().toISOString(), // today
  },
];

interface ZoomSignup {
  id: string;
  name: string;
  phone: string;
  email: string;
  day: string;
  attended: boolean;
  timestamp: string;
}

const MOCK_ZOOM_SIGNUPS: ZoomSignup[] = [
  { id: 'z1', name: 'John Doe', phone: '555-111-2222', email: 'john@example.com', day: 'Saturday', attended: false, timestamp: new Date().toISOString() },
  { id: 'z2', name: 'Jane Smith', phone: '555-333-4444', email: 'jane@example.com', day: 'Sunday', attended: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
];

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('torcDemoLeads');
      if (data) {
        setLeads(JSON.parse(data));
      } else {
        setLeads(MOCK_LEADS);
        localStorage.setItem('torcDemoLeads', JSON.stringify(MOCK_LEADS));
      }
      setLoading(false);
    }
  }, []);

  const clearDemoLeads = () => {
    setLeads(MOCK_LEADS);
    localStorage.setItem('torcDemoLeads', JSON.stringify(MOCK_LEADS));
  };

  // Add mock Zoom signups data and stats
  const [zoomSignups, setZoomSignups] = useState<ZoomSignup[]>(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('torcZoomSignups');
      return data ? JSON.parse(data) : MOCK_ZOOM_SIGNUPS;
    }
    return MOCK_ZOOM_SIGNUPS;
  });
  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('torcZoomSignups', JSON.stringify(zoomSignups));
    }
  }, [zoomSignups]);
  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const signupsToday = zoomSignups.filter((z: ZoomSignup) => new Date(z.timestamp) >= today);
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);
  const signupsThisWeek = zoomSignups.filter((z: ZoomSignup) => new Date(z.timestamp) >= weekAgo);
  const attendedCount = zoomSignups.filter((z: ZoomSignup) => z.attended).length;
  const toggleAttended = (id: string) => {
    setZoomSignups(zoomSignups.map((z: ZoomSignup) => z.id === id ? { ...z, attended: !z.attended } : z));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Real Time Solutions Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>Loading leads...</p>
          </div>
        </div>
      </div>
    );
  }

  // Stat calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const leadsToday = leads.filter(l => new Date(l.createdAt) >= startOfToday);
  const leadsThisWeek = leads.filter(l => new Date(l.createdAt) >= startOfWeek);
  const leadsThisMonth = leads.filter(l => new Date(l.createdAt) >= startOfMonth);

  // Top zip code (week)
  const zipCounts: Record<string, number> = {};
  leadsThisWeek.forEach(l => {
    const zip = l.id === '1' ? '48219' : l.id === '2' ? '48228' : l.id === '3' ? '48235' : '48219'; // mock zip
    zipCounts[zip] = (zipCounts[zip] || 0) + 1;
  });
  const topZip = Object.entries(zipCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Pie chart data (mock)
  const cityPieData = {
    labels: ['Detroit', 'Westland', 'Southfield', 'Redford', 'Warren'],
    datasets: [
      {
        data: [15, 9, 6, 3, 2],
        backgroundColor: [
          '#6366f1', // indigo
          '#f59e42', // orange
          '#10b981', // green
          '#f43f5e', // red
          '#fbbf24', // yellow
        ],
      },
    ],
  };
  // Mock zip code counts
  const mockZipCounts = [
    { zip: '48219', count: 10 },
    { zip: '48228', count: 7 },
    { zip: '48235', count: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Real Time Solutions Dashboard</h1>
        {/* Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-indigo-700">{leadsThisWeek.length}</div>
            <div className="text-gray-800 font-semibold">Total Leads (Week)</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-green-700">{leadsToday.length}</div>
            <div className="text-gray-800 font-semibold">Leads Today</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-yellow-700">{leadsThisMonth.length}</div>
            <div className="text-gray-800 font-semibold">Leads This Month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-pink-700">{topZip}</div>
            <div className="text-gray-800 font-semibold">Top Zip Code (Week)</div>
          </div>
        </div>
        {/* Pie Chart + Zip Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-lg font-bold text-gray-800 mb-2">Lead Distribution by City</div>
            <Pie data={cityPieData} options={{ plugins: { legend: { labels: { color: '#374151', font: { weight: 'bold' } } } } }} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-lg font-bold text-gray-800 mb-2">Zip Code Lead Counts</div>
            <ul className="space-y-2">
              {mockZipCounts.map((z) => (
                <li key={z.zip} className="flex justify-between text-gray-700 font-medium">
                  <span>{z.zip}</span>
                  <span>{z.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Submitted Leads ({leads.length})</h2>
            <button
              onClick={clearDemoLeads}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold flex items-center"
            >
              <span role="img" aria-label="broom" className="mr-2"></span>Clear Leads
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.agentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.relation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{lead.email}</div>
                      <div className="text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'PROCESSED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Zoom Signups Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-12">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900">Zoom Signups ({zoomSignups.length})</h2>
            <div className="flex gap-4">
              <div className="text-sm text-gray-700 font-semibold">Signups Today: <span className="text-indigo-700">{signupsToday.length}</span></div>
              <div className="text-sm text-gray-700 font-semibold">This Week: <span className="text-indigo-700">{signupsThisWeek.length}</span></div>
              <div className="text-sm text-gray-700 font-semibold">Attended: <span className="text-green-700">{attendedCount}</span></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attended</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {zoomSignups.map((z: ZoomSignup) => (
                  <tr key={z.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{z.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{z.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{z.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{z.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => toggleAttended(z.id)} className={`px-3 py-1 rounded-full text-xs font-bold ${z.attended ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{z.attended ? 'Yes' : 'No'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 