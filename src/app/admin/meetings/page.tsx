'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

interface Meeting {
  id: string;
  title: string;
  type: 'zoom' | 'one-on-one';
  date: Date;
  agentId: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  zoomLink?: string;
  location?: string;
  duration: number; // in minutes
  reminderSent: boolean;
}

export default function MeetingsPage() {
  const [agentId, setAgentId] = useState('AHRPE5559');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'completed'>('all');

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    type: 'zoom' as 'zoom' | 'one-on-one',
    date: '',
    time: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    notes: '',
    zoomLink: '',
    location: '',
    duration: 60
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Load meetings from localStorage or start empty
    const savedMeetings = localStorage.getItem('admin-meetings');
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
        console.error('Error parsing saved meetings:', error);
        setMeetings([]);
      }
    } else {
      setMeetings([]);
    }
    setIsLoading(false);
  }, [agentId]);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    if (meetings.length > 0) {
      localStorage.setItem('admin-meetings', JSON.stringify(meetings));
    } else {
      localStorage.removeItem('admin-meetings');
    }
  }, [meetings]);

  const addMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time || !newMeeting.leadName) {
      alert('Please fill in all required fields');
      return;
    }

    const [hours, minutes] = newMeeting.time.split(':');
    const meetingDate = new Date(newMeeting.date);
    meetingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      type: newMeeting.type,
      date: meetingDate,
      agentId: agentId,
      leadName: newMeeting.leadName,
      leadEmail: newMeeting.leadEmail,
      leadPhone: newMeeting.leadPhone,
      status: 'scheduled',
      notes: newMeeting.notes,
      zoomLink: newMeeting.zoomLink,
      location: newMeeting.location,
      duration: newMeeting.duration,
      reminderSent: false
    };

    setMeetings(prev => [meeting, ...prev]);
    setShowAddMeeting(false);
    setNewMeeting({
      title: '',
      type: 'zoom',
      date: '',
      time: '',
      leadName: '',
      leadEmail: '',
      leadPhone: '',
      notes: '',
      zoomLink: '',
      location: '',
      duration: 60
    });
  };

  const updateMeetingStatus = (meetingId: string, status: Meeting['status']) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId ? { ...meeting, status } : meeting
    ));
  };

  const deleteMeeting = (meetingId: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
              setMeetings(prev => prev.filter((meeting: any) => meeting.id !== meetingId));
    }
  };

  const sendReminder = (meeting: Meeting) => {
    // In a real app, this would send an email/SMS reminder
    alert(`Reminder sent to ${meeting.leadName} for meeting: ${meeting.title}`);
    setMeetings(prev => prev.map(m => 
      m.id === meeting.id ? { ...m, reminderSent: true } : m
    ));
  };

  const getFilteredMeetings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'upcoming':
        return meetings.filter((meeting: Meeting) => meeting.date > now && meeting.status === 'scheduled');
      case 'today':
        return meetings.filter((meeting: Meeting) => 
          meeting.date >= today && meeting.date < tomorrow && meeting.status === 'scheduled'
        );
      case 'completed':
        return meetings.filter((meeting: Meeting) => meeting.status === 'completed');
      default:
        return meetings;
    }
  };

  const formatMeetingTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntilMeeting = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return 'Past';
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} away`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m away`;
    } else {
      return `${minutes}m away`;
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  const filteredMeetings = getFilteredMeetings();

  return (
    <AdminLayout agentId={agentId} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📅 Meeting Management
            </h1>
            <p className="text-gray-600 mt-2">Track and manage zoom and one-on-one meetings</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
            >
              <option value="all">All Meetings</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={() => setShowAddMeeting(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              + Add Meeting
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Zoom Meetings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {meetings.filter((m: Meeting) => m.type === 'zoom').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">One-on-One</p>
                <p className="text-2xl font-bold text-gray-900">
                  {meetings.filter((m: Meeting) => m.type === 'one-on-one').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {meetings.filter((m: Meeting) => {
                    const today = new Date();
                    const meetingDate = new Date(m.date);
                    return meetingDate.toDateString() === today.toDateString() && m.status === 'scheduled';
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Meeting Modal */}
        {showAddMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Meeting</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="e.g., Initial Consultation, Follow-up Assessment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, type: e.target.value as 'zoom' | 'one-on-one' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value="zoom">🔗 Zoom Consultation</option>
                    <option value="one-on-one">👥 In-Person Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Name *</label>
                  <input
                    type="text"
                    value={newMeeting.leadName}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, leadName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="Enter lead name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Email</label>
                  <input
                    type="email"
                    value={newMeeting.leadEmail}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, leadEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="Enter lead email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Phone</label>
                  <input
                    type="tel"
                    value={newMeeting.leadPhone}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, leadPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="Enter lead phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    min="15"
                    step="15"
                  />
                </div>

                {newMeeting.type === 'zoom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Link</label>
                    <input
                      type="url"
                      value={newMeeting.zoomLink}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, zoomLink: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      placeholder="Enter zoom link"
                    />
                  </div>
                )}

                {newMeeting.type === 'one-on-one' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      placeholder="Enter meeting location"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  rows={3}
                  placeholder="Enter meeting notes"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMeeting(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addMeeting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meetings List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-lg font-bold">📅</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Meetings
              </h2>
              <p className="text-gray-600 mt-1">Manage your scheduled meetings</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading meetings...</p>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📅</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">No meetings found</p>
              <p className="text-gray-400 text-sm mt-1">Add your first meeting to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          meeting.type === 'zoom' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {meeting.type === 'zoom' ? '🔗 Zoom' : '👥 One-on-One'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          meeting.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{meeting.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Lead:</strong> {meeting.leadName} • {meeting.leadEmail} • {meeting.leadPhone}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Time:</strong> {formatMeetingTime(meeting.date)} • {meeting.duration} minutes
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Time until:</strong> {getTimeUntilMeeting(meeting.date)}
                      </p>
                      
                      {meeting.zoomLink && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Zoom:</strong> <a href={meeting.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{meeting.zoomLink}</a>
                        </p>
                      )}
                      
                      {meeting.location && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Location:</strong> {meeting.location}
                        </p>
                      )}
                      
                      {meeting.notes && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Notes:</strong> {meeting.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {meeting.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => updateMeetingStatus(meeting.id, 'in-progress')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => sendReminder(meeting)}
                            disabled={meeting.reminderSent}
                            className={`px-3 py-1 text-xs rounded-lg transition ${
                              meeting.reminderSent
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {meeting.reminderSent ? 'Reminder Sent' : 'Send Reminder'}
                          </button>
                        </>
                      )}
                      
                      {meeting.status === 'in-progress' && (
                        <button
                          onClick={() => updateMeetingStatus(meeting.id, 'completed')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                        >
                          Complete
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteMeeting(meeting.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
