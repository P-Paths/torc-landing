'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ATSReplicaForm from '../../../components/ATSReplicaForm';

export default function ATSFormPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');

  const trackQRScan = async (agentId: string) => {
    try {
      // Get user agent and other tracking info
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      
      // Note: In a real implementation, you'd get the IP from the server
      // For now, we'll use a placeholder
      const ipAddress = 'unknown';
      
      await fetch('/api/qr-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          userAgent,
          ipAddress,
          referrer
        }),
      });
    } catch (error) {
      console.error('Error tracking QR scan:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const agent = params.get('agent');
      if (agent) {
        setAgentId(agent);
        localStorage.setItem('agentName', agent);
        
        // Track the QR code scan
        trackQRScan(agent);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">RTS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Real Time Solutions</span>
            </Link>
            {/* Agent ID hidden from users - only in localStorage for tracking */}
          </div>
        </div>
      </div>

      {/* RTS Opt-In Form */}
      <ATSReplicaForm />
    </div>
  );
} 