'use client';

import React, { useState } from 'react';

interface ATSFormData {
  // Family Information
  familyMember: string;
  gamerDOB: {
    month: string;
    day: string;
    year: string;
  };
  secondDOB: {
    month: string;
    day: string;
    year: string;
  };
  startedAge: string;
  
  // Gaming Information
  dailyHours: string;
  platforms: string[];
  gamertags: {
    playstation?: string;
    xbox?: string;
    steam?: string;
    nintendo?: string;
    epic?: string;
    other?: string;
  };
  games: string[];
  otherGames: string;
  
  // Contact Information
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zipCode: string;
  
  // Consent
  consent: boolean;
}

const ATSReplicaForm: React.FC = () => {
  const [formData, setFormData] = useState<ATSFormData>({
    familyMember: '',
    gamerDOB: { month: '', day: '', year: '' },
    secondDOB: { month: '', day: '', year: '' },
    startedAge: '',
    dailyHours: '',
    platforms: [],
    gamertags: {},
    games: [],
    otherGames: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    zipCode: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateFormData = (field: keyof ATSFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof ATSFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const updateDOB = (field: 'month' | 'day' | 'year', value: string) => {
    setFormData(prev => ({
      ...prev,
      gamerDOB: { ...prev.gamerDOB, [field]: value }
    }));
  };

  const updateSecondDOB = (field: 'month' | 'day' | 'year', value: string) => {
    setFormData(prev => ({
      ...prev,
      secondDOB: { ...prev.secondDOB, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const agentId = new URLSearchParams(window.location.search).get('agent') || 'AHRPE5559';
      
      const response = await fetch(`/api/submit-enhanced-lead?agent=${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Map form data to our enhanced form structure
          agentName: 'Form Referral',
          relationship: formData.familyMember,
          gamerFirstName: formData.firstName,
          gamerLastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          bestTimeToCall: 'anytime',
          platforms: formData.platforms,
          gamertags: formData.gamertags,
          dailyHours: formData.dailyHours,
          schedule: [],
          primaryGames: formData.games,
          durationOfConcern: 'unknown',
          affectedAreas: [],
          symptoms: [],
          emergencyIndicators: [],
          helpType: 'legal_compensation',
          previousAttempts: [],
          zoomLink: '',
          // Additional form data
          additionalData: {
            gamerDOB: formData.gamerDOB,
            secondDOB: formData.secondDOB,
            startedAge: formData.startedAge,
            otherGames: formData.otherGames,
            zipCode: formData.zipCode
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submission successful:', result);
        setSubmitSuccess(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Form submission failed:', response.status, errorData);
        throw new Error(`Submission failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank you for signing up!</h2>
          <p className="text-gray-600 mb-6">
            You'll be receiving a detailed form from us within 24 hours if we think you qualify.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>What happens next:</strong><br/>
              • Your case will be reviewed<br/>
              • You'll receive a detailed form within 24 hours<br/>
              • Free case evaluation provided
            </p>
          </div>
          <button
            onClick={() => {
              // Store ATS data for RTS form
              localStorage.setItem('atsFormData', JSON.stringify(formData));
              // Redirect to RTS form
              window.location.href = '/rts-test?agent=AHRPE5559';
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Continue to Detailed Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white text-center py-4 animate-slideDown shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl animate-pulse">🔥</span>
                              <strong className="text-xl font-bold animate-pulse">ACT NOW – THOUSANDS HAVE ALREADY CLAIMED: DON&apos;T MISS OUT!</strong>
          <span className="text-2xl animate-pulse">🔥</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 animate-fadeInUp">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Section - Information */}
          <div className="relative animate-slideInLeft">
            <div className="bg-white rounded-2xl p-8 text-gray-800 relative overflow-hidden shadow-2xl border-2 border-gray-200" 
                 style={{
                   backgroundImage: `url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}>
              {/* Background Image Overlay */}
              <div className="absolute inset-0 bg-white bg-opacity-90 z-0"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl mb-6 shadow-lg">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3 animate-pulse">⚡</span>
                    <h1 className="text-3xl font-bold mb-2 text-white">TIME-SENSITIVE</h1>
                  </div>
                  <h2 className="text-2xl font-bold text-yellow-300">VIDEO GAME ADDICTION LITIGATION ALERT</h2>
                </div>
                
                <p className="text-xl mb-6 leading-relaxed text-gray-800">
                  <span className="text-blue-600 font-bold">Are you or a loved one struggling with video game addiction?</span> Video game companies may design their games to be addictive, drawing players into spending excessive amounts of time and money.
                </p>
                
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3 animate-bounce">🎮</span>
                    <h3 className="text-xl font-bold text-white">ATTENTION</h3>
                  </div>
                  <p className="text-lg text-white">If you or a family member has experienced negative consequences due to video game addiction, you may be entitled to compensation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-8 relative overflow-hidden animate-slideInRight border border-purple-200">
            {/* Animated gaming pattern background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{
                   backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23666"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>')`,
                   backgroundSize: '20px 20px',
                   animation: 'float 6s ease-in-out infinite'
                 }}></div>
            <div className="relative z-10">
              <div className="text-center mb-8 animate-fadeInUp">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl mb-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl">⏰</span>
                    <h2 className="text-2xl font-bold">TIME IS LIMITED TO FILE</h2>
                    <span className="text-3xl">⏰</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-fadeInUp">FREE CASE EVALUATION</h3>
                <p className="text-xl font-semibold text-gray-700 animate-fadeInUp">YOU MAY BE ENTITLED TO SIGNIFICANT COMPENSATION</p>
              </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6 animate-fadeInUp">
              
              {/* Family Member */}
              <div className="animate-fadeInUp">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who in your family is addicted to video games? *
                </label>
                <select
                  value={formData.familyMember}
                  onChange={(e) => updateFormData('familyMember', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:scale-105"
                  required
                >
                  <option value="">Select</option>
                  <option value="myself">Myself</option>
                  <option value="loved_one">Loved One</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* First Date of Birth Field - Always shows */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.familyMember === 'myself' ? 'Your date of birth' : 'Date of Birth of the Gamer'} *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={formData.gamerDOB.month}
                    onChange={(e) => updateDOB('month', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="">Month</option>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={formData.gamerDOB.day}
                    onChange={(e) => updateDOB('day', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="">Day</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={formData.gamerDOB.year}
                    onChange={(e) => updateDOB('year', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({length: 50}, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second Date of Birth Field - Shows for Loved One and Other */}
              {(formData.familyMember === 'loved_one' || formData.familyMember === 'other') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth of the Gamer *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={formData.secondDOB.month}
                      onChange={(e) => updateSecondDOB('month', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Month</option>
                      {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={formData.secondDOB.day}
                      onChange={(e) => updateSecondDOB('day', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Day</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select
                      value={formData.secondDOB.year}
                      onChange={(e) => updateSecondDOB('year', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({length: 50}, (_, i) => 2024 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Started Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How old was the gamer when they started playing?
                </label>
                <input
                  type="number"
                  value={formData.startedAge}
                  onChange={(e) => updateFormData('startedAge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter age"
                />
              </div>

              {/* Daily Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many hours per day did/does the gamer play? *
                </label>
                <select
                  value={formData.dailyHours}
                  onChange={(e) => updateFormData('dailyHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select</option>
                  <option value="1-2">1-2 hours</option>
                  <option value="2-4">2-4 hours</option>
                  <option value="4-6">4-6 hours</option>
                  <option value="6-8">6-8 hours</option>
                  <option value="8-12">8-12 hours</option>
                  <option value="12+">More than 12 hours</option>
                </select>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What platforms did the gamer use? (Select all that apply) *
                </label>
                
                                  {/* Selected Platforms Display */}
                  {formData.platforms.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {formData.platforms.map((platform, index) => {
                        const platformInfo = {
                          playstation: { label: 'PlayStation', color: 'bg-blue-100 text-blue-800' },
                          xbox: { label: 'Xbox', color: 'bg-green-100 text-green-800' },
                          steam: { label: 'Steam', color: 'bg-gray-100 text-gray-800' },
                          other: { label: 'Other (Please specify):', color: 'bg-purple-100 text-purple-800' }
                        }[platform];
                        
                        if (!platformInfo) {
                          return null;
                        }
                        
                        return (
                          <span key={platform} className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${platformInfo.color} animate-fadeInUp shadow-lg border-2 border-white`} style={{ animationDelay: `${index * 100}ms` }}>
                            {platformInfo.label}
                            <button
                              type="button"
                              onClick={() => updateArrayField('platforms', platform, false)}
                              className="ml-3 text-gray-600 hover:text-red-600 transition-all duration-200 hover:scale-125 font-bold text-lg"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                
                {/* Platform Selection Dropdown */}
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value && !formData.platforms.includes(e.target.value)) {
                        updateArrayField('platforms', e.target.value, true);
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Select platforms</option>
                    {[
                      { value: 'playstation', label: 'PlayStation' },
                      { value: 'xbox', label: 'Xbox' },
                      { value: 'steam', label: 'Steam' },
                      { value: 'other', label: 'Other (Please specify):' }
                    ].filter(platform => !formData.platforms.includes(platform.value)).map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gamertags */}
              {(formData.platforms.includes('playstation') || formData.platforms.includes('xbox') || formData.platforms.includes('steam')) && (
                <div className="space-y-4">
                  {formData.platforms.includes('playstation') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gamer Tag for PlayStation (if known):
                      </label>
                      <input
                        type="text"
                        value={formData.gamertags.playstation || ''}
                        onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, playstation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Enter PlayStation PSN ID"
                      />
                    </div>
                  )}
                  {formData.platforms.includes('xbox') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gamer Tag for Xbox (if known):
                      </label>
                      <input
                        type="text"
                        value={formData.gamertags.xbox || ''}
                        onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, xbox: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Enter Xbox Gamertag"
                      />
                    </div>
                  )}
                  {formData.platforms.includes('steam') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gamer Tag for Steam (if known):
                      </label>
                      <input
                        type="text"
                        value={formData.gamertags.steam || ''}
                        onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, steam: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Enter Steam Username"
                      />
                    </div>
                  )}
                  {formData.platforms.includes('other') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Platform:
                      </label>
                      <input
                        type="text"
                        value={formData.gamertags.other || ''}
                        onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, other: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Specify other platform"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Games */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which of the following games did/does the gamer play? (Select all that apply) *
                </label>
                
                                  {/* Selected Games Display */}
                  {formData.games.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {formData.games.map((game, index) => (
                        <span key={game} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 animate-fadeInUp shadow-lg border-2 border-white" style={{ animationDelay: `${index * 100}ms` }}>
                          {game}
                          <button
                            type="button"
                            onClick={() => updateArrayField('games', game, false)}
                            className="ml-3 text-gray-600 hover:text-red-600 transition-all duration-200 hover:scale-125 font-bold text-lg"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                {/* Game Selection Dropdown */}
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value && !formData.games.includes(e.target.value)) {
                        updateArrayField('games', e.target.value, true);
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Select games</option>
                    {[
                      'Fortnite',
                      'Call of Duty',
                      'Minecraft',
                      'Roblox',
                      'Grand Theft Auto V',
                      'League of Legends',
                      'Valorant',
                      'Counter-Strike 2',
                      'Apex Legends',
                      'Overwatch 2',
                      'PUBG',
                      'Rainbow Six Siege',
                      'FIFA',
                      'Madden NFL',
                      'NBA 2K',
                      'Rocket League',
                      'Among Us',
                      'Fall Guys',
                      'World of Warcraft',
                      'Hearthstone'
                    ].filter(game => !formData.games.includes(game)).map(game => (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Other Games */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Games:
                </label>
                <input
                  type="text"
                  value={formData.otherGames}
                  onChange={(e) => updateFormData('otherGames', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Specify other games"
                />
              </div>



              {/* Contact Information Section */}
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl animate-fadeInUp border-2 border-blue-200 shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3 animate-pulse">🔒</span>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fadeInUp">Your Information is 100% Confidential</h3>
                </div>
                <p className="text-blue-700 mb-6 animate-fadeInUp text-lg">Fill this section with your information so we can contact you.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Legal Consent */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateFormData('consent', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    By clicking the "Submit" button below, I am asking to be contacted about my potential claim and to assist with obtaining a lawyer. Those responding to this ad expressly request and give permission to being contacted by Real Time Solutions, ATSlawsuits, a law firm, its representatives or associated co-counsel, working in this area of practice related to this inquiry and/or their services, at any time in any way, including but not limited to calls using an auto-dialer, text, fax, or email, even if these result in charges by your carrier. This request and permission override any do-not-call registry rules or list, or any other applicable law or regulation. Those responding to this ad confirm they have carefully read and consent to the Terms of Use and Privacy Policy contained in any links, website or publication by the law firm and/or its representatives, marketing or otherwise. I understand that submitting this information does not create an attorney-client relationship. *
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'SUBMIT MY CLAIM'}
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSReplicaForm; 