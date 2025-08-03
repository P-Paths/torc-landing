'use client';

import React, { useState } from 'react';

export default function QRCodeGenerator() {
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = () => {
    // Use production URL when deployed, fallback to localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-vercel-domain.vercel.app' // Update this with your actual Vercel domain
      : 'http://localhost:3000';
    const url = `${baseUrl}/ats-form?agent=${agentId}`;
    
    // Using a free QR code API
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">QR Code Generator</h2>
      
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
            placeholder="Enter agent ID (e.g., AHRPE5559)"
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
                This QR code links to: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/ats-form?agent={agentId}</code>
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to Use:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Enter the agent ID (e.g., AHRPE5559)</li>
            <li>2. Click &quot;Generate QR Code&quot;</li>
            <li>3. Download the QR code image</li>
            <li>4. Print on flyers, Facebook Marketplace, local stores, etc.</li>
            <li>5. When scanned, users land on agent-specific landing page</li>
          </ol>
          
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-1">💡 Important:</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• QR codes are <strong>permanent</strong> - generate once, use forever</li>
                <li>• Each agent gets their own unique QR code</li>
                <li>• No need to regenerate QR codes - they always work</li>
                <li>• Perfect for long-term marketing materials</li>
                <li>• Test on mobile: scan QR code with phone camera</li>
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
} 