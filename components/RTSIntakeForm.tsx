'use client';

import React, { useState } from 'react';

interface FormData {
  // Contact Information
  agentName: string;
  relationship: string;
  gamerFirstName: string;
  gamerLastName: string;
  email: string;
  phone: string;
  bestTimeToCall: string;
  
  // Additional contact info for law firm
  address: string;
  city: string;
  state: string;
  zipCode: string;
  age: number;
  
  // Gaming Profile
  platforms: string[];
  gamertags: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  dailyHours: string;
  schedule: string[];
  primaryGames: string[];
  
  // Assessment
  durationOfConcern: string;
  affectedAreas: string[];
  symptoms: string[];
  emergencyIndicators: string[];
  
  // Treatment
  helpType: string;
  previousAttempts: string[];
  zoomLink: string;
}

const RTSIntakeForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agentName: '',
    relationship: '',
    gamerFirstName: '',
    gamerLastName: '',
    email: '',
    phone: '',
    bestTimeToCall: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    age: 0,
    platforms: [],
    gamertags: {},
    dailyHours: '',
    schedule: [],
    primaryGames: [],
    durationOfConcern: '',
    affectedAreas: [],
    symptoms: [],
    emergencyIndicators: [],
    helpType: '',
    previousAttempts: [],
    zoomLink: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get agent ID from URL params or use default
      const agentId = new URLSearchParams(window.location.search).get('agent') || 'AHRPE5559';
      
      const response = await fetch(`/api/submit-to-formstack?agent=${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        setSubmitSuccess(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Thank You!</h2>
          <p className="text-green-700 mb-6">
            Your gaming assessment has been submitted successfully. Our legal team will review your case and contact you within 24-48 hours.
          </p>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-2">Next Steps:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You'll receive a confirmation email</li>
              <li>• Our legal team will review your case</li>
              <li>• We'll contact you to discuss your options</li>
              <li>• If eligible, we'll help you file your claim</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['Contact Info', 'Gaming Profile', 'Assessment', 'Review'].map((step, index) => (
            <span key={step} className={`text-sm ${currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step}
            </span>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Contact Information */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) => updateFormData('agentName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Gamer *
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => updateFormData('relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                required
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent/Guardian</option>
                <option value="spouse">Spouse/Partner</option>
                <option value="self">Self (I need help)</option>
                <option value="family">Other Family Member</option>
                <option value="friend">Friend/Concerned Person</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gamer&apos;s First Name *
              </label>
              <input
                type="text"
                value={formData.gamerFirstName}
                onChange={(e) => updateFormData('gamerFirstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gamer&apos;s Last Name *
              </label>
              <input
                type="text"
                value={formData.gamerLastName}
                onChange={(e) => updateFormData('gamerLastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                min="1"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Time to Call
              </label>
              <select
                value={formData.bestTimeToCall}
                onChange={(e) => updateFormData('bestTimeToCall', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              >
                <option value="">Select preferred time</option>
                <option value="morning">Morning (8AM-12PM)</option>
                <option value="afternoon">Afternoon (12PM-5PM)</option>
                <option value="evening">Evening (5PM-8PM)</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                placeholder="Street address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => updateFormData('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                placeholder="State abbreviation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Gaming Profile */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gaming Profile Assessment</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gaming Platform(s) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'xbox', label: '🟩 Xbox', tag: 'Gamertag', color: 'border-green-500 bg-green-50' },
                  { value: 'playstation', label: '🔵 PlayStation', tag: 'PSN ID', color: 'border-blue-500 bg-blue-50' },
                  { value: 'steam', label: '⚫ Steam', tag: 'Username', color: 'border-gray-800 bg-gray-50' },
                  { value: 'mobile', label: '📱 Mobile Gaming', tag: 'Mobile', color: 'border-purple-500 bg-purple-50' },
                  { value: 'pc', label: '💻 PC Gaming', tag: 'PC', color: 'border-orange-500 bg-orange-50' },
                  { value: 'multiple', label: '🎮 Multiple Platforms', tag: 'Multi', color: 'border-indigo-500 bg-indigo-50' }
                ].map(platform => (
                  <label key={platform.value} className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    formData.platforms.includes(platform.value) 
                      ? `${platform.color} shadow-md` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.value)}
                      onChange={(e) => updateArrayField('platforms', platform.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{platform.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gamertag inputs for selected platforms */}
            {(formData.platforms.includes('xbox') || formData.platforms.includes('playstation') || formData.platforms.includes('steam')) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.platforms.includes('xbox') && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      🟩 Xbox Gamertag
                    </label>
                    <input
                      type="text"
                      value={formData.gamertags.xbox || ''}
                      onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, xbox: e.target.value })}
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black placeholder-green-400 bg-white"
                      placeholder="Enter Xbox Gamertag"
                    />
                  </div>
                )}
                {formData.platforms.includes('playstation') && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      🔵 PlayStation PSN ID
                    </label>
                    <input
                      type="text"
                      value={formData.gamertags.playstation || ''}
                      onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, playstation: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-blue-400 bg-white"
                      placeholder="Enter PSN ID"
                    />
                  </div>
                )}
                {formData.platforms.includes('steam') && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      ⚫ Steam Username
                    </label>
                    <input
                      type="text"
                      value={formData.gamertags.steam || ''}
                      onChange={(e) => updateFormData('gamertags', { ...formData.gamertags, steam: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-black placeholder-gray-400 bg-white"
                      placeholder="Enter Steam Username"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Daily Gaming Hours *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'Less than 2 hours', color: 'bg-green-50 border-green-200 text-green-800' },
                  { value: '2-4 hours', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
                  { value: '4-8 hours', color: 'bg-orange-50 border-orange-200 text-orange-800' },
                  { value: '8-12 hours', color: 'bg-red-50 border-red-200 text-red-800' },
                  { value: 'More than 12 hours', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                  { value: 'I don\'t know', color: 'bg-gray-50 border-gray-200 text-gray-800' }
                ].map(hours => (
                  <label key={hours.value} className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    formData.dailyHours === hours.value 
                      ? `${hours.color} shadow-md` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="dailyHours"
                      value={hours.value}
                      checked={formData.dailyHours === hours.value}
                      onChange={(e) => updateFormData('dailyHours', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{hours.value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Primary Games Played *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  'Fortnite',
                  'Call of Duty',
                  'Minecraft',
                  'Roblox',
                  'League of Legends',
                  'Valorant',
                  'Apex Legends',
                  'Overwatch',
                  'World of Warcraft',
                  'GTA V',
                  'Red Dead Redemption',
                  'FIFA',
                  'Madden NFL',
                  'NBA 2K',
                  'Rocket League',
                  'Among Us',
                  'Fall Guys',
                  'PUBG',
                  'CS:GO',
                  'Dota 2',
                  'Hearthstone',
                  'Pokemon GO',
                  'Clash of Clans',
                  'Clash Royale',
                  'Candy Crush',
                  'Mobile Legends',
                  'Free Fire',
                  'PUBG Mobile',
                  'Other'
                ].map(game => (
                  <label key={game} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.primaryGames.includes(game)}
                      onChange={(e) => updateArrayField('primaryGames', game, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-black">{game}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Assessment */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gaming Impact Assessment</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How long has excessive gaming been a concern? *
              </label>
              <div className="space-y-2">
                {[
                  'Less than 6 months',
                  '6 months to 1 year',
                  '1-2 years',
                  '2-5 years',
                  'More than 5 years'
                ].map(duration => (
                  <label key={duration} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="durationOfConcern"
                      value={duration}
                      checked={formData.durationOfConcern === duration}
                      onChange={(e) => updateFormData('durationOfConcern', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-black">{duration}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Which areas of life are affected by gaming? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'School performance/attendance',
                  'Work performance/attendance',
                  'Family relationships',
                  'Friendships/social life',
                  'Physical health',
                  'Sleep schedule',
                  'Personal hygiene',
                  'Financial issues',
                  'All of the above'
                ].map(area => (
                  <label key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.affectedAreas.includes(area)}
                      onChange={(e) => updateArrayField('affectedAreas', area, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-black">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Has the gamer experienced any of these? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Aggressive behavior when gaming is restricted',
                  'Lying about gaming time',
                  'Neglecting responsibilities for gaming',
                  'Physical symptoms (headaches, eye strain, carpal tunnel)',
                  'Depression or anxiety when not gaming',
                  'Loss of interest in other activities',
                  'Failed attempts to reduce gaming'
                ].map(symptom => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(symptom)}
                      onChange={(e) => updateArrayField('symptoms', symptom, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-black">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">⚠️ Emergency Indicators</h3>
              <div className="space-y-2">
                {[
                  'Thoughts of self-harm',
                  'Complete isolation from family/friends',
                  'Stopped attending school/work entirely',
                  'Physical health concerns requiring immediate attention'
                ].map(indicator => (
                  <label key={indicator} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.emergencyIndicators.includes(indicator)}
                      onChange={(e) => updateArrayField('emergencyIndicators', indicator, e.target.checked)}
                      className="rounded border-red-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-red-800 font-medium">{indicator}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Submit</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600">
                {formData.agentName} ({formData.relationship})<br/>
                {formData.gamerFirstName} {formData.gamerLastName} (Age: {formData.age})<br/>
                {formData.email} | {formData.phone}<br/>
                {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Gaming Profile</h3>
              <p className="text-sm text-gray-600">
                Platforms: {formData.platforms.join(', ')}<br/>
                Daily Hours: {formData.dailyHours}<br/>
                Primary Games: {formData.primaryGames.join(', ')}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Assessment</h3>
              <p className="text-sm text-gray-600">
                Duration: {formData.durationOfConcern}<br/>
                Affected Areas: {formData.affectedAreas.join(', ')}<br/>
                Symptoms: {formData.symptoms.length} identified
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Ready to Submit?</h3>
            <p className="text-sm text-blue-700">
              By submitting this form, you agree to be contacted by our legal team regarding potential compensation claims. 
              All information is kept confidential and secure.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-md ${
            currentStep === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md ${
              isSubmitting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Legal Review'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RTSIntakeForm; 