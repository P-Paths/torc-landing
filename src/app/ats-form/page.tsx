'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ATSReplicaForm from '../../../components/ATSReplicaForm';

export default function ATSFormPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const agent = params.get('agent');
      if (agent) {
        setAgentId(agent);
        localStorage.setItem('agentName', agent);
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