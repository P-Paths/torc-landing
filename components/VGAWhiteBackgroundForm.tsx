'use client';

import React, { useState, useEffect } from 'react';

interface VGAFormData {
  // Agent Information
  agentId: string;
  
  // Relationship & Minor Status
  relationshipWithIndividual: string;
  isPersonMinor: string;
  
  // Injured Party Information (when "myself" is selected)
  injuredPartyName: string;
  injuredPartyGender: string;
  injuredPartyAddress: string;
  injuredPartyPhone: string;
  injuredPartySecondaryPhone: string;
  callerPhone: string;
  injuredPartyDateOfBirth: string;
  injuredPartySSN: string;
  ssnLastFour: string;
  
  // Legal Information
  previouslySignedDocuments: string;
  fullNameSigning: string;
  isCurrentlyInSchool: string;
  
  // School Information (conditional)
  schoolName: string;
  schoolAddress: string;
  
  // Education
  highestEducationLevel: string;
  
  // Gaming History
  firstStartedPlayingDate: string;
  averageGamesPerDay: string;
  
  // Gaming Platforms & Games
  gamingPlatforms: string[];
  videoGames: string[];
  
  // Gaming Details
  firstVideoGame: string;
  gameDetails: string;
}

const VGAWhiteBackgroundForm: React.FC = () => {
  const [formData, setFormData] = useState<VGAFormData>({
    agentId: '',
    relationshipWithIndividual: '',
    isPersonMinor: '',
    injuredPartyName: '',
    injuredPartyGender: '',
    injuredPartyAddress: '',
    injuredPartyPhone: '',
    injuredPartySecondaryPhone: '',
    callerPhone: '',
    injuredPartyDateOfBirth: '',
    injuredPartySSN: '',
    ssnLastFour: '',
    previouslySignedDocuments: '',
    fullNameSigning: '',
    isCurrentlyInSchool: '',
    schoolName: '',
    schoolAddress: '',
    highestEducationLevel: '',
    firstStartedPlayingDate: '',
    averageGamesPerDay: '',
    gamingPlatforms: [],
    videoGames: [],
    firstVideoGame: '',
    gameDetails: ''
  });

  // Auto-fill agent ID and handle token on component mount
  useEffect(() => {
    // Get token and email from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    // Get opt-in data from localStorage if available
    const optInData = localStorage.getItem('torcFormData');
    let prefillData: any = {};
    
    if (optInData) {
      try {
        prefillData = JSON.parse(optInData);
      } catch (e) {
        console.error('Error parsing opt-in data:', e);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      agentId: 'AGENT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      // Pre-fill with opt-in data if available
      ...(prefillData.firstName && { injuredPartyName: `${prefillData.firstName} ${prefillData.lastName}` }),
      ...(prefillData.email && { callerPhone: prefillData.email }), // Using email as phone for now
      ...(prefillData.address1 && { injuredPartyAddress: `${prefillData.address1}, ${prefillData.city}, ${prefillData.state} ${prefillData.zip}` }),
      ...(prefillData.dob && { injuredPartyDateOfBirth: prefillData.dob }),
      ...(prefillData.ssn && { injuredPartySSN: prefillData.ssn }),
      ...(prefillData.gender && { injuredPartyGender: prefillData.gender }),
      ...(prefillData.relation && { relationshipWithIndividual: prefillData.relation === 'Myself' ? 'myself' : 'loved_one' }),
      ...(prefillData.isMinor && { isPersonMinor: prefillData.isMinor }),
      ...(prefillData.education && { highestEducationLevel: prefillData.education }),
      ...(prefillData.startDate && { firstStartedPlayingDate: prefillData.startDate }),
      ...(prefillData.avgHours && { averageGamesPerDay: prefillData.avgHours }),
      ...(prefillData.firstGame && { firstVideoGame: prefillData.firstGame }),
      ...(prefillData.gameHistory && { gameDetails: prefillData.gameHistory }),
      // Convert platforms and games arrays
      ...(prefillData.platforms && { gamingPlatforms: prefillData.platforms }),
      ...(prefillData.games && { videoGames: prefillData.games }),
    }));
  }, []);

  const handleInputChange = (field: keyof VGAFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof VGAFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    try {
      const response = await fetch('/api/submit-vga-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Form submitted successfully!');
        // Save to local storage for dashboard
        const submissions = JSON.parse(localStorage.getItem('vga_submissions') || '[]');
        submissions.push({
          id: Date.now().toString(),
          agentId: formData.agentId,
          status: 'submitted',
          timestamp: new Date().toISOString(),
          message: result.message
        });
        localStorage.setItem('vga_submissions', JSON.stringify(submissions));
      } else {
        alert('Error submitting form: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const showInjuredPartyFields = formData.relationshipWithIndividual === 'myself';
  const showMinorField = formData.relationshipWithIndividual === 'myself';
  const showSchoolFields = formData.isCurrentlyInSchool === 'Yes';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">VGA_Agents_SPBMCC - Form</h1>
          <p className="text-blue-100 mt-2">Video Gaming Addiction Intake Form</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Agent Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Agent Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.agentId}
                  onChange={(e) => handleInputChange('agentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Relationship & Minor Status Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Relationship & Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your relationship with the individual? <span className="text-red-500">*</span>
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="relationshipWithIndividual"
                      value="myself"
                      checked={formData.relationshipWithIndividual === 'myself'}
                      onChange={(e) => handleInputChange('relationshipWithIndividual', e.target.value)}
                      className="mr-2"
                      required
                    />
                    Myself
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="relationshipWithIndividual"
                      value="loved_one"
                      checked={formData.relationshipWithIndividual === 'loved_one'}
                      onChange={(e) => handleInputChange('relationshipWithIndividual', e.target.value)}
                      className="mr-2"
                      required
                    />
                    A Loved One
                  </label>
                </div>
              </div>

              {showMinorField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is the person who played the video game a minor under the age of 18? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isPersonMinor"
                        value="Yes"
                        checked={formData.isPersonMinor === 'Yes'}
                        onChange={(e) => handleInputChange('isPersonMinor', e.target.value)}
                        className="mr-2"
                        required
                      />
                      Yes
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isPersonMinor"
                        value="No"
                        checked={formData.isPersonMinor === 'No'}
                        onChange={(e) => handleInputChange('isPersonMinor', e.target.value)}
                        className="mr-2"
                        required
                      />
                      No
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Injured Party Information (conditional) */}
          {showInjuredPartyFields && (
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Injured Party Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured Party Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.injuredPartyName}
                    onChange={(e) => handleInputChange('injuredPartyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.injuredPartyGender}
                    onChange={(e) => handleInputChange('injuredPartyGender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured Party Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.injuredPartyAddress}
                    onChange={(e) => handleInputChange('injuredPartyAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured Party Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.injuredPartyPhone}
                    onChange={(e) => handleInputChange('injuredPartyPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.injuredPartySecondaryPhone}
                    onChange={(e) => handleInputChange('injuredPartySecondaryPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caller Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.callerPhone}
                    onChange={(e) => handleInputChange('callerPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.injuredPartyDateOfBirth}
                    onChange={(e) => handleInputChange('injuredPartyDateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Security Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.injuredPartySSN}
                    onChange={(e) => handleInputChange('injuredPartySSN', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    If you don't feel comfortable providing your full SSN, please provide the last 4 digits only.
                    You can provide the full SSN to the lawyers when they ask for additional information.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last 4 Digits of SSN (if not providing full SSN)
                  </label>
                  <input
                    type="text"
                    value={formData.ssnLastFour}
                    onChange={(e) => handleInputChange('ssnLastFour', e.target.value)}
                    placeholder="XXXX"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Legal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Legal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you previously signed any documents with attorneys? <span className="text-red-500">*</span>
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="previouslySignedDocuments"
                      value="Yes"
                      checked={formData.previouslySignedDocuments === 'Yes'}
                      onChange={(e) => handleInputChange('previouslySignedDocuments', e.target.value)}
                      className="mr-2"
                      required
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="previouslySignedDocuments"
                      value="No"
                      checked={formData.previouslySignedDocuments === 'No'}
                      onChange={(e) => handleInputChange('previouslySignedDocuments', e.target.value)}
                      className="mr-2"
                      required
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name of Person Signing <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullNameSigning}
                  onChange={(e) => handleInputChange('fullNameSigning', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is Injured Party currently going to school? <span className="text-red-500">*</span>
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isCurrentlyInSchool"
                      value="Yes"
                      checked={formData.isCurrentlyInSchool === 'Yes'}
                      onChange={(e) => handleInputChange('isCurrentlyInSchool', e.target.value)}
                      className="mr-2"
                      required
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isCurrentlyInSchool"
                      value="No"
                      checked={formData.isCurrentlyInSchool === 'No'}
                      onChange={(e) => handleInputChange('isCurrentlyInSchool', e.target.value)}
                      className="mr-2"
                      required
                    />
                    No
                  </label>
                </div>
              </div>

              {/* School Information (conditional) */}
              {showSchoolFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.schoolAddress}
                      onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highest Educational Level of Gamer <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.highestEducationLevel}
                  onChange={(e) => handleInputChange('highestEducationLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="Elementary School">Elementary School</option>
                  <option value="High School">High School</option>
                  <option value="Vocational School">Vocational School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Graduate School">Graduate School</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gaming History Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gaming History</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimate the date injured party first started playing video games <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.firstStartedPlayingDate}
                  onChange={(e) => handleInputChange('firstStartedPlayingDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  On average, how many video games did the party play a day? <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.averageGamesPerDay}
                  onChange={(e) => handleInputChange('averageGamesPerDay', e.target.value)}
                  placeholder="Enter number of games"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Gaming Platforms & Games Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gaming Platforms & Games</h2>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Select gaming platforms that have been used.</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['Playstation', 'Xbox', 'Nintendo Switch', 'Gaming Computer or Laptop', 'Steam', 'Apple iPhone', 'Android Phone', 'Oculus VR', 'Meta Quest', 'Other Gaming Device'].map((platform) => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.gamingPlatforms.includes(platform)}
                      onChange={(e) => handleCheckboxChange('gamingPlatforms', platform, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Select all video games that have been played.</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['Apex Legends', 'Call of Duty', 'Counter-Strike', 'Fortnite', 'GTA 5', 'League of Legends', 'Minecraft', 'Overwatch', 'Rainbow Six: Siege', 'Roblox', 'Rocket League', 'Teamfight Tactics', 'Valorant', 'World of Warcraft', 'Other Game'].map((game) => (
                  <label key={game} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.videoGames.includes(game)}
                      onChange={(e) => handleCheckboxChange('videoGames', game, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{game}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Gaming Details Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gaming Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What video game was played first? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstVideoGame}
                  onChange={(e) => handleInputChange('firstVideoGame', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please list the game names including the version, dates, and estimated hours spent playing each of the above games. <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={formData.gameDetails}
                  onChange={(e) => handleInputChange('gameDetails', e.target.value)}
                  placeholder="Example: Roblox from March 2022 to present, 3 hours/day; Call of Duty: Modern Warfare II from January 2023- March 2023, total 100 hours."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save and Resume Later
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VGAWhiteBackgroundForm; 