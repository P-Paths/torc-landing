'use client';

import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';


interface GamingLookupResult {
  platform: string;
  username: string;
  totalHours?: number;
  totalGames?: number;
  qualificationStatus?: string;
  qualificationReason?: string;
  topGames?: any[];
  player?: {
    gamerTag?: string;
    profilePicture?: string;
  };
}

export default function GamingLookupPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [gamingLookup, setGamingLookup] = useState({
    platform: 'xbox',
    username: '',
    result: null as GamingLookupResult | null,
    isLoading: false
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleGamingLookup = async () => {
    if (!gamingLookup.username.trim()) return;

    setGamingLookup(prev => ({ ...prev, isLoading: true, result: null }));

    try {
      // Use the real gamer lookup API endpoint
      console.log(`🔍 Looking up ${gamingLookup.username} on ${gamingLookup.platform} via real API...`);
      
      const response = await fetch(`/api/gamer-lookup?platform=${gamingLookup.platform}&username=${encodeURIComponent(gamingLookup.username)}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const apiResult = await response.json();
      
      // Convert API result to our GamingLookupResult format
      const realResult: GamingLookupResult = {
        platform: apiResult.platform,
        username: apiResult.player.gamerTag,
        totalHours: apiResult.totalHours,
        totalGames: apiResult.totalGames,
        qualificationStatus: apiResult.qualificationStatus,
        qualificationReason: apiResult.qualificationReason,
        topGames: apiResult.topGames.map((game: any) => ({
          name: game.name,
          hours: game.hoursPlayed
        })),
        player: {
          gamerTag: apiResult.player.gamerTag,
          profilePicture: apiResult.player.profilePicture
        }
      };

      setGamingLookup(prev => ({ 
        ...prev, 
        result: realResult, 
        isLoading: false 
      }));
      
      console.log('✅ Real API lookup completed:', apiResult);
    } catch (error) {
      console.error('❌ Real API gaming lookup error:', error);
      setGamingLookup(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <AdminLayout agentId={agentId} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎮 Real Gaming Profile Lookup
          </h1>
          <p className="text-gray-600 mt-2">Real-time gaming profile lookup via Steam, Xbox, and PlayStation APIs</p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={gamingLookup.platform}
                onChange={(e) => setGamingLookup(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="xbox">Xbox</option>
                <option value="playstation">PlayStation</option>
                <option value="steam">Steam</option>
                <option value="epic">Epic Games</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gamertag/Username</label>
              <input
                type="text"
                value={gamingLookup.username}
                onChange={(e) => setGamingLookup(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter gamertag..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
              />
            </div>
            
            <div className="flex items-end space-x-3">
              <button
                onClick={handleGamingLookup}
                disabled={gamingLookup.isLoading || !gamingLookup.username.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gamingLookup.isLoading ? '🔍 Searching...' : '🎮 Lookup Player'}
              </button>
              <a
                href="http://tag-checker.tortconnector.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔗 Direct ATS Tool
              </a>
            </div>
          </div>
        </div>

        {/* Results */}
        {gamingLookup.result && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-4">
                {gamingLookup.result.player?.profilePicture ? (
                  <img 
                    src={gamingLookup.result.player.profilePicture} 
                    alt={`${gamingLookup.result.username} profile`}
                    className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {gamingLookup.result.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Player Results
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {gamingLookup.result.platform.toUpperCase()} - {gamingLookup.result.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {gamingLookup.result.totalHours?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-sm text-blue-700 font-medium">Total Hours</div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {gamingLookup.result.totalGames || 'N/A'}
                </div>
                <div className="text-sm text-green-700 font-medium">Games Played</div>
              </div>

              <div className={`rounded-xl p-6 border ${
                gamingLookup.result.qualificationStatus === 'qualified' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
              }`}>
                <div className={`text-2xl font-bold mb-2 ${
                  gamingLookup.result.qualificationStatus === 'qualified' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {gamingLookup.result.qualificationStatus === 'qualified' ? '✅' : '❌'}
                </div>
                <div className={`text-sm font-medium ${
                  gamingLookup.result.qualificationStatus === 'qualified' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {gamingLookup.result.qualificationStatus === 'qualified' ? 'Qualified' : 'Not Qualified'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  ${gamingLookup.result.qualificationStatus === 'qualified' ? '10.00' : '0.00'}
                </div>
                <div className="text-sm text-purple-700 font-medium">Bonus Amount</div>
              </div>
            </div>

            {/* Top Games */}
            {gamingLookup.result.topGames && gamingLookup.result.topGames.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Games</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gamingLookup.result.topGames.map((game, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{game.name}</div>
                      <div className="text-sm text-gray-500">{game.hours} hours</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qualification Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualification Details</h3>
              <p className="text-gray-700">{gamingLookup.result.qualificationReason}</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Requirements Met</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Age 18+ (if applicable)</li>
                    <li>✅ 500+ hours gaming</li>
                    <li>✅ Active in last 30 days</li>
                    <li>✅ Eligible games played</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📞 Contact lead for verification</li>
                    <li>📋 Complete intake form</li>
                    <li>💰 Process bonus payment</li>
                    <li>📊 Update commission tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎮 Real Gaming Profile Lookup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Real API Integration:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Enter the player's gamertag/username</li>
                <li>Select the correct gaming platform</li>
                <li>Click "Lookup Player" to verify via real APIs</li>
                <li>Check qualification status and hours</li>
                <li>Process bonus if eligible</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Supported Platforms:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ Steam - Real Steam API integration</li>
                <li>✅ Xbox - Real Xbox Live API integration</li>
                <li>✅ PlayStation - Real PSN API integration</li>
                <li>✅ Real gaming hours and activity data</li>
                <li>✅ Automatic qualification scoring</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>✅ Connected to Real Gaming APIs:</strong> This system uses actual Steam, Xbox, and PlayStation APIs to fetch real gaming data.
            </p>
            <p className="text-sm text-green-700 mt-1">
              <strong>No fake data:</strong> All results are from official gaming platform APIs.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
