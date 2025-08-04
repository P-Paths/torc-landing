'use client';

import React, { useState, useEffect } from 'react';

interface BackupLead {
  id: string;
  gamerFirstName: string;
  gamerLastName: string;
  email: string;
  phone: string;
  agentId: string;
  backupReason: string;
  backupTimestamp: string;
}

interface RecoveryResult {
  originalId: string;
  newId: string;
  name: string;
  email: string;
}

export default function DataRecoveryPage() {
  const [backupLeads, setBackupLeads] = useState<BackupLead[]>([]);
  const [emergencyBackups, setEmergencyBackups] = useState<any[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResults, setRecoveryResults] = useState<{
    recovered: RecoveryResult[];
    failed: any[];
    summary: { total: number; recovered: number; failed: number };
  } | null>(null);

  useEffect(() => {
    checkForBackupData();
  }, []);

  const checkForBackupData = () => {
    if (typeof window === 'undefined') return;

    // Check for backup leads
    try {
      const backupData = localStorage.getItem('torcBackupLeads');
      if (backupData) {
        const leads = JSON.parse(backupData);
        setBackupLeads(leads);
        console.log(`Found ${leads.length} backup leads`);
      }
    } catch (error) {
      console.error('Error reading backup leads:', error);
    }

    // Check for emergency backups
    try {
      const emergencyData = localStorage.getItem('torcEmergencyBackups');
      if (emergencyData) {
        const backups = JSON.parse(emergencyData);
        setEmergencyBackups(backups);
        console.log(`Found ${backups.length} emergency backups`);
      }
    } catch (error) {
      console.error('Error reading emergency backups:', error);
    }
  };

  const recoverBackupData = async () => {
    if (backupLeads.length === 0) {
      alert('No backup data to recover');
      return;
    }

    setIsRecovering(true);
    setRecoveryResults(null);

    try {
      const response = await fetch('/api/recover-backup-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backupLeads: backupLeads
        })
      });

      const result = await response.json();

      if (result.success) {
        setRecoveryResults(result);
        
        // Clear backup data after successful recovery
        localStorage.removeItem('torcBackupLeads');
        setBackupLeads([]);
        
        alert(`Recovery completed! ${result.summary.recovered} leads recovered, ${result.summary.failed} failed.`);
      } else {
        alert(`Recovery failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Recovery error:', error);
      alert('Recovery failed. Check console for details.');
    } finally {
      setIsRecovering(false);
    }
  };

  const clearBackupData = () => {
    if (confirm('Are you sure you want to clear all backup data? This cannot be undone.')) {
      localStorage.removeItem('torcBackupLeads');
      localStorage.removeItem('torcEmergencyBackups');
      setBackupLeads([]);
      setEmergencyBackups([]);
      setRecoveryResults(null);
      alert('Backup data cleared');
    }
  };

  const downloadBackupData = () => {
    const data = {
      backupLeads,
      emergencyBackups,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `torc-backup-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔄 Data Recovery Tool</h1>
          <p className="text-gray-600 mb-6">
            This tool helps recover any form submissions that were saved to backup storage when Firebase was unavailable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900">Backup Leads</h3>
              <p className="text-3xl font-bold text-blue-600">{backupLeads.length}</p>
              <p className="text-sm text-blue-700">Form submissions saved locally</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900">Emergency Backups</h3>
              <p className="text-3xl font-bold text-yellow-600">{emergencyBackups.length}</p>
              <p className="text-sm text-yellow-700">Raw form data backups</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900">Recovery Status</h3>
              <p className="text-3xl font-bold text-green-600">
                {recoveryResults ? recoveryResults.summary.recovered : 0}
              </p>
              <p className="text-sm text-green-700">Successfully recovered</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={recoverBackupData}
              disabled={isRecovering || backupLeads.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRecovering ? 'Recovering...' : `Recover ${backupLeads.length} Leads`}
            </button>

            <button
              onClick={downloadBackupData}
              disabled={backupLeads.length === 0 && emergencyBackups.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Backup Data
            </button>

            <button
              onClick={clearBackupData}
              disabled={backupLeads.length === 0 && emergencyBackups.length === 0}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Backup Data
            </button>

            <button
              onClick={checkForBackupData}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Recovery Results */}
        {recoveryResults && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recovery Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900">Recovered</h3>
                <p className="text-2xl font-bold text-green-600">{recoveryResults.summary.recovered}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-900">Failed</h3>
                <p className="text-2xl font-bold text-red-600">{recoveryResults.summary.failed}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Total</h3>
                <p className="text-2xl font-bold text-blue-600">{recoveryResults.summary.total}</p>
              </div>
            </div>

            {recoveryResults.recovered.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Successfully Recovered Leads</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New ID</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recoveryResults.recovered.map((lead, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.originalId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.newId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {recoveryResults.failed.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Failed Recoveries</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recoveryResults.failed.map((lead, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {lead.error}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Backup Leads List */}
        {backupLeads.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Backup Leads ({backupLeads.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {backupLeads.map((lead, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.gamerFirstName} {lead.gamerLastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.agentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.backupTimestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Emergency Backups List */}
        {emergencyBackups.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Backups ({emergencyBackups.length})</h2>
            <div className="space-y-4">
              {emergencyBackups.map((backup, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Emergency Backup #{index + 1}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(backup.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Error: {backup.error}</p>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View Raw Form Data
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(backup.rawFormData, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 