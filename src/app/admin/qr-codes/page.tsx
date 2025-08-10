'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

interface QRCode {
  id: string;
  agentId: string;
  agentName: string;
  code: string;
  destination: string;
  active: boolean;
  createdAt: Date;
  qrCodeUrl?: string;
  scans?: number;
  leadsGenerated?: number;
}

export default function QRCodesPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('AHRPE5559');

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const generateQRCode = async () => {
    try {
      const qrUrl = `${window.location.origin}/ats-form?agent=${selectedAgent}`;
      
      // In a real implementation, you'd call an API to generate and store the QR code
      const newQRCode: QRCode = {
        id: Date.now().toString(),
        agentId: selectedAgent,
        agentName: `Agent ${selectedAgent}`,
        code: selectedAgent,
        destination: qrUrl,
        active: true,
        createdAt: new Date(),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`,
        scans: 0,
        leadsGenerated: 0
      };
      
      setQrCodes(prev => [newQRCode, ...prev]);
      alert(`QR Code generated for ${selectedAgent}!`);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = (qrCode: QRCode) => {
    if (qrCode.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCode.qrCodeUrl;
      link.download = `qr-code-${qrCode.agentId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleQRCodeStatus = (qrCodeId: string) => {
    setQrCodes(prev => prev.map(qr => 
      qr.id === qrCodeId ? { ...qr, active: !qr.active } : qr
    ));
  };

  const clearAllQRCodes = () => {
    if (window.confirm('Are you sure you want to clear all QR codes? This action cannot be undone.')) {
      setQrCodes([]);
    }
  };

  useEffect(() => {
    // Load existing QR codes (mock data for now)
    const mockQRCodes: QRCode[] = [
      {
        id: '1',
        agentId: 'AHRPE5559',
        agentName: 'Agent AHRPE5559',
        code: 'AHRPE5559',
        destination: `${window.location.origin}/ats-form?agent=AHRPE5559`,
        active: true,
        createdAt: new Date('2024-01-01'),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/ats-form?agent=AHRPE5559`)}`,
        scans: 0,
        leadsGenerated: 0
      }
    ];
    setQrCodes(mockQRCodes);
    setIsLoading(false);
  }, []);

  // Calculate real stats
  const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.scans || 0), 0);
  const totalLeadsGenerated = qrCodes.reduce((sum, qr) => sum + (qr.leadsGenerated || 0), 0);

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
              QR Code Management
            </h1>
            <p className="text-gray-600 mt-2">Generate and manage agent QR codes for lead collection</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
            >
              <option value="AHRPE5559" className="text-gray-900">AHRPE5559</option>
              <option value="AGENT001" className="text-gray-900">AGENT001</option>
              <option value="AGENT002" className="text-gray-900">AGENT002</option>
            </select>
            <button
              onClick={generateQRCode}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Generate QR Code
            </button>
            {qrCodes.length > 0 && (
              <button
                onClick={clearAllQRCodes}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">📱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {qrCodes.filter((qr: any) => qr.active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeadsGenerated.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📱</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Agent QR Codes
              </h2>
              <p className="text-gray-600 mt-1">Manage QR codes for each agent</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading QR codes...</p>
            </div>
          ) : qrCodes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📱</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">No QR codes yet</p>
              <p className="text-gray-400 text-sm mt-1">Generate your first QR code to start collecting leads!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrCodes.map((qrCode) => (
                <div key={qrCode.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{qrCode.agentName}</h3>
                      <p className="text-sm text-gray-500 font-mono">{qrCode.code}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      qrCode.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {qrCode.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="text-center mb-4">
                    {qrCode.qrCodeUrl ? (
                      <img 
                        src={qrCode.qrCodeUrl} 
                        alt={`QR Code for ${qrCode.agentName}`}
                        className="w-32 h-32 mx-auto border border-gray-200 rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">📱</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-500">
                      <strong>Destination:</strong>
                    </div>
                    <div className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded break-all">
                      {qrCode.destination}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadQRCode(qrCode)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => toggleQRCodeStatus(qrCode.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition ${
                        qrCode.active 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {qrCode.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Created: {qrCode.createdAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use QR Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">For Lead Generation:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Generate a QR code for your agent</li>
                <li>Download and print the QR code</li>
                <li>Display in high-traffic areas</li>
                <li>When scanned, leads go to your opt-in form</li>
                <li>Track performance in the dashboard</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Best Practices:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Place QR codes in gaming stores</li>
                <li>• Use at gaming conventions</li>
                <li>• Include on business cards</li>
                <li>• Add to social media profiles</li>
                <li>• Monitor scan analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
