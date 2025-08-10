'use client';

import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

interface SystemSettings {
  commissionBase: number;
  commissionBonus: number;
  bonusEligibilityHours: number;
  bonusEligibilityAge: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoFollowUp: boolean;
  followUpDelay: number;
  timezone: string;
  currency: string;
}

export default function SettingsPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>({
    commissionBase: 40,
    commissionBonus: 10,
    bonusEligibilityHours: 500,
    bonusEligibilityAge: 18,
    emailNotifications: true,
    smsNotifications: false,
    autoFollowUp: true,
    followUpDelay: 24,
    timezone: 'America/New_York',
    currency: 'USD'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <AdminLayout agentId={agentId} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-gray-600 mt-2">Configure your system preferences and commission structure</p>
        </div>

        {/* Commission Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">💰</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Commission Structure
              </h2>
              <p className="text-gray-600 mt-1">Configure commission rates and bonus eligibility</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Base Commission per Lead ($)
              </label>
              <input
                type="number"
                value={settings.commissionBase}
                onChange={(e) => updateSetting('commissionBase', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                min="0"
                step="1"
                placeholder="Enter amount..."
              />
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Bonus Commission per Qualified Lead ($)
              </label>
              <input
                type="number"
                value={settings.commissionBonus}
                onChange={(e) => updateSetting('commissionBonus', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                min="0"
                step="1"
                placeholder="Enter amount..."
              />
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Minimum Gaming Hours for Bonus
              </label>
              <input
                type="number"
                value={settings.bonusEligibilityHours}
                onChange={(e) => updateSetting('bonusEligibilityHours', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                min="0"
                step="10"
                placeholder="Enter hours..."
              />
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Minimum Age for Bonus
              </label>
              <input
                type="number"
                value={settings.bonusEligibilityAge}
                onChange={(e) => updateSetting('bonusEligibilityAge', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                min="13"
                max="100"
                step="1"
                placeholder="Enter age..."
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">🔔</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Notification Settings
              </h2>
              <p className="text-gray-600 mt-1">Configure how you receive notifications</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive lead notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Auto Follow-up</h3>
                <p className="text-sm text-gray-500">Automatically send follow-up messages to leads</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoFollowUp}
                  onChange={(e) => updateSetting('autoFollowUp', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.autoFollowUp && (
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Follow-up Delay (hours)
                </label>
                <input
                  type="number"
                  value={settings.followUpDelay}
                  onChange={(e) => updateSetting('followUpDelay', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  min="1"
                  max="168"
                  step="1"
                  placeholder="Enter hours..."
                />
              </div>
            )}
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">⚙️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                System Preferences
              </h2>
              <p className="text-gray-600 mt-1">Configure timezone and currency settings</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Current Settings Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800"><strong>Base Commission:</strong> ${settings.commissionBase} per lead</p>
              <p className="text-blue-800"><strong>Bonus Commission:</strong> ${settings.commissionBonus} per qualified lead</p>
              <p className="text-blue-800"><strong>Bonus Eligibility:</strong> {settings.bonusEligibilityHours}+ hours, {settings.bonusEligibilityAge}+ years</p>
            </div>
            <div>
              <p className="text-blue-800"><strong>Email Notifications:</strong> {settings.emailNotifications ? 'Enabled' : 'Disabled'}</p>
              <p className="text-blue-800"><strong>SMS Notifications:</strong> {settings.smsNotifications ? 'Enabled' : 'Disabled'}</p>
              <p className="text-blue-800"><strong>Auto Follow-up:</strong> {settings.autoFollowUp ? `Enabled (${settings.followUpDelay}h delay)` : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
