'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Meeting {
  id: string;
  title: string;
  type: 'zoom' | 'one-on-one';
  date: Date;
  agentId: string;
  leadName: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface AdminSidebarProps {
  agentId: string;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function AdminSidebar({ agentId, onLogout, isOpen, onToggle, theme, onThemeToggle }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetings, setShowMeetings] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'DASH',
      description: 'Overview and stats'
    },
    {
      name: 'Leads',
      href: '/admin/leads',
      icon: 'LEADS',
      description: 'Manage leads'
    },
    {
      name: 'Agents',
      href: '/admin/agents',
      icon: 'AGENTS',
      description: 'Agent management'
    },
    {
      name: 'Meetings',
      href: '/admin/meetings',
      icon: 'MEET',
      description: 'Meeting tracker'
    },
    {
      name: 'QR Codes',
      href: '/admin/qr-codes',
      icon: 'QR',
      description: 'QR code generation'
    },
    {
      name: 'Gaming Lookup',
      href: '/admin/gaming-lookup',
      icon: 'GAME',
      description: 'Gamertag verification'
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: 'REPORTS',
      description: 'Analytics & reports'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: 'SETTINGS',
      description: 'System settings'
    }
  ];

  // Load meetings from localStorage or start empty
  useEffect(() => {
    const savedMeetings = localStorage.getItem('sidebar-meetings');
    if (savedMeetings) {
      try {
        const parsedMeetings = JSON.parse(savedMeetings);
        // Convert date strings back to Date objects
        const meetingsWithDates = parsedMeetings.map((meeting: any) => ({
          ...meeting,
          date: new Date(meeting.date)
        }));
        setMeetings(meetingsWithDates);
      } catch (error) {
        console.error('Error parsing saved sidebar meetings:', error);
        setMeetings([]);
      }
    } else {
      setMeetings([]);
    }
  }, [agentId]);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    if (meetings.length > 0) {
      localStorage.setItem('sidebar-meetings', JSON.stringify(meetings));
    } else {
      localStorage.removeItem('sidebar-meetings');
    }
  }, [meetings]);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    return meetings.filter((meeting: Meeting) => 
      meeting.date > now && meeting.status === 'upcoming'
    ).slice(0, 3);
  };

  const formatMeetingTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} away`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m away`;
    } else {
      return `${minutes}m away`;
    }
  };

  const upcomingMeetings = getUpcomingMeetings();

  return (
    <div className={`fixed left-0 top-0 h-full shadow-xl border-r border-gray-200 z-50 transition-all duration-300 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Logo/Header */}
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RTS</span>
            </div>
            {isOpen && (
              <div>
                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Admin Panel
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Real-Time Solutions
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-800 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>
        {isOpen && (
          <div className={`mt-4 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-50'
          }`}>
            <p className={`text-xs font-medium ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>Agent ID</p>
            <p className={`text-sm font-mono ${
              theme === 'dark' ? 'text-blue-100' : 'text-blue-900'
            }`}>{agentId}</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Meeting Alerts */}
        {isOpen && upcomingMeetings.length > 0 && (
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                📅 Upcoming Meetings
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowMeetings(!showMeetings)}
                  className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  {showMeetings ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setMeetings([])}
                  className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
                >
                  Clear
                </button>
              </div>
            </div>
            
            {showMeetings && (
              <div className="space-y-2">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {meeting.title}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {meeting.leadName} • {meeting.type === 'zoom' ? '🔗 Zoom' : '👥 One-on-One'}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                      }`}>
                        {formatMeetingTime(meeting.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!showMeetings && (
              <div className={`text-center p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-50'
              }`}>
                <span className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                }`}>
                  {upcomingMeetings.length} meeting{upcomingMeetings.length > 1 ? 's' : ''} today
                </span>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive(item.href)
                    ? theme === 'dark'
                      ? 'bg-blue-900/50 text-blue-300 border-l-4 border-blue-500'
                      : 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isOpen ? undefined : item.name}
              >
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.icon}
                </span>
                {isOpen && (
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className={`text-xs ${
                      isActive(item.href)
                        ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        : theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0">
          {/* Theme Toggle */}
          {isOpen && (
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={onThemeToggle}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {theme === 'dark' ? 'LIGHT' : 'DARK'}
                </span>
                <span className="font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>
          )}

          {/* Logout Button - Always Visible */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={onLogout}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/50'
                  : 'text-red-600 hover:bg-red-50'
              }`}
              title={isOpen ? undefined : "Logout"}
            >
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                EXIT
              </span>
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}