'use client';

import React from 'react';

export default function SampleQRCode() {
  const sampleAgentId = 'AHRPE5559';
  const sampleUrl = `http://localhost:3000/agent/${sampleAgentId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sampleUrl)}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample QR Code</h3>
      <div className="mb-4">
        <img 
          src={qrCodeUrl} 
          alt="Sample QR Code"
          className="mx-auto border border-gray-300 rounded-lg"
        />
      </div>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Agent ID:</strong> {sampleAgentId}
      </p>
      <p className="text-xs text-gray-500">
        Scan this QR code to test the funnel
      </p>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>How it works:</strong> When scanned, users land on an agent-specific landing page that looks 
          exactly like the main site, then click &quot;See if you qualify&quot; to access the enhanced intake form.
        </p>
      </div>
    </div>
  );
} 