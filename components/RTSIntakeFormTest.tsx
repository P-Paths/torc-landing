'use client';

import React, { useState, useEffect } from 'react';

interface FormData {
  // Agent Information
  agentId: string;
  agentName: string;
  
  // Date/Time Information
  submissionDate: string;
  submissionTime: string;
  
  // Relationship & Status
  relationship: string;
  isMinor: string;
  
  // Injured Party Information
  injuredPartyFirstName: string;
  injuredPartyMiddleName: string;
  injuredPartyLastName: string;
  injuredPartySuffix: string;
  gender: string;
  injuredPartyEmail: string;
  injuredPartyDOB: string;
  injuredPartySSN: string;
  
  // Address Information
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Contact Information
  phoneNumber: string;
  secondaryPhoneNumber: string;
  callerNumberType: string;
  
  // Caller Information (for "Loved one" relationship)
  callerName: string;
  callerEmail: string;
  callerAddressLine1: string;
  callerAddressLine2: string;
  callerCity: string;
  callerState: string;
  callerZipCode: string;
  legalAuthorization: string;
  isClaimantDeceased: string;
  
  // Legal Information
  previousAttorneyDocuments: string;
  legalFullName: string;
  currentlyInSchool: string;
  highestEducationLevel: string;
  
  // Gaming History
  gamingStartDate: string;
  hoursPerDayGaming: string;
  gamingPlatforms: string[];
  firstGamePlayed: string;
  detailedGamingHistory: string;
  
  // Gamer Tags for Platforms
  playstationGamerTag: string;
  xboxGamerTag: string;
  nintendoSwitchGamerTag: string;
  laptopDesktopName: string;
  laptopBrands: string[];
  steamGamerTag: string;
  appleIphoneGamerTag: string;
  androidPhoneGamerTag: string;
  oculusVrGamerTag: string;
  metaQuestGamerTag: string;
  otherGamingDeviceGamerTag: string;
  
  // Gaming Subscriptions & Accessories
  monthlySubscriptions: string[];
  cloudGamingSubscriptions: string;
  virtualRealityAccessories: string;
  gamePurchaseReceipts: string;
  
  // Gaming Habits & Financial
  monthlyGamingSpend: string;
  triedToStopGaming: string;
  paidForAdditionalItems: string;
  receivedEnergyDrinkRewards: string;
  gamingProof: string[];
  watchedGamingInfluencers: string;
  soldVideoGameContent: string;
  
  // Gaming Disorder Symptoms & Injuries
  gamingDisorderSymptoms: string[];
  gamingInjuries: string[];
  
  // Life Impact & Medical Treatment
  lifeImpactFromGaming: string[];
  medicalTreatmentsReceived: string[];
  medicalProviderDiagnosis: string;
  medicationTaken: string;
  
  // Final Section - Medical, Legal, & Contact Info
  otherMedicalConditions: string;
  filedLawsuit: string;
  convictedCrime: string;
  receiveSSDI: string;
  receiveSSI: string;
  driversLicense: File | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  notes: string;
  
  // Gaming Profile
  platforms: string[];
  gamertags: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  dailyHours: string;
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

const RTSIntakeFormTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agentId: 'AHRPE5559',
    agentName: '',
    submissionDate: '',
    submissionTime: '',
    relationship: '',
    isMinor: '',
    injuredPartyFirstName: '',
    injuredPartyMiddleName: '',
    injuredPartyLastName: '',
    injuredPartySuffix: '',
    gender: '',
    injuredPartyEmail: '',
    injuredPartyDOB: '',
    injuredPartySSN: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
    callerNumberType: '',
    callerName: '',
    callerEmail: '',
    callerAddressLine1: '',
    callerAddressLine2: '',
    callerCity: '',
    callerState: '',
    callerZipCode: '',
    legalAuthorization: '',
    isClaimantDeceased: '',
    previousAttorneyDocuments: '',
    legalFullName: '',
    currentlyInSchool: '',
    highestEducationLevel: '',
    gamingStartDate: '',
    hoursPerDayGaming: '',
    gamingPlatforms: [],
    firstGamePlayed: '',
    detailedGamingHistory: '',
    playstationGamerTag: '',
    xboxGamerTag: '',
    nintendoSwitchGamerTag: '',
    laptopDesktopName: '',
    laptopBrands: [],
    steamGamerTag: '',
    appleIphoneGamerTag: '',
    androidPhoneGamerTag: '',
    oculusVrGamerTag: '',
    metaQuestGamerTag: '',
    otherGamingDeviceGamerTag: '',
    monthlySubscriptions: [],
    cloudGamingSubscriptions: '',
    virtualRealityAccessories: '',
    gamePurchaseReceipts: '',
    monthlyGamingSpend: '',
    triedToStopGaming: '',
    paidForAdditionalItems: '',
    receivedEnergyDrinkRewards: '',
    gamingProof: [],
    watchedGamingInfluencers: '',
    soldVideoGameContent: '',
    gamingDisorderSymptoms: [],
    gamingInjuries: [],
    lifeImpactFromGaming: [],
    medicalTreatmentsReceived: [],
    medicalProviderDiagnosis: '',
    medicationTaken: '',
    otherMedicalConditions: '',
    filedLawsuit: '',
    convictedCrime: '',
    receiveSSDI: '',
    receiveSSI: '',
    driversLicense: null,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    notes: '',
    platforms: [],
    gamertags: {},
    dailyHours: '',
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
  const [testResult, setTestResult] = useState<any>(null);

  // Get agent ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const agentFromUrl = urlParams.get('agent');
    if (agentFromUrl) {
      setFormData(prev => ({ ...prev, agentId: agentFromUrl }));
    }
  }, []);

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

  // Function to capture current date/time when field is clicked
  const captureDateTime = (field: 'submissionDate' | 'submissionTime') => {
    const now = new Date();
    if (field === 'submissionDate') {
      const dateStr = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      updateFormData(field, dateStr);
    } else {
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      updateFormData(field, timeStr);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/test-rts-submission?agent=${formData.agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Test submission successful:', result);
        setTestResult(result.testData);
        setSubmitSuccess(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Test submission failed');
      }
    } catch (error) {
      console.error('Test submission error:', error);
      alert('There was an error submitting your test form. Please try again.');
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
          <h2 className="text-2xl font-bold text-green-800 mb-4">Submission Successful!</h2>
          <p className="text-green-700 mb-6">
            Thank you for submitting your information. We'll review your case and contact you within 24 hours.
          </p>
          
          {testResult && (
            <div className="bg-white p-4 rounded-lg border mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Test Results:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Agent ID:</strong> {testResult.agentId}</p>
                <p><strong>Bonus Eligible:</strong> {testResult.isBonusEligible ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Routing:</strong> {testResult.routing}</p>
                <p><strong>Formstack Success:</strong> {testResult.formstackSuccess ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Fields Received:</strong> {testResult.formDataReceived}</p>
                <p><strong>Timestamp:</strong> {new Date(testResult.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Test the real submission endpoint</li>
              <li>• Verify Formstack integration</li>
              <li>• Check Firestore data storage</li>
              <li>• Monitor admin dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header Section */}
      <div className="bg-blue-600 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Form Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Real-Time Solutions</h1>
            <p className="text-blue-100 text-lg">Video Gaming Addiction Intake Form</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">


        {/* Form Container with White Background */}
        <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200">

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {['Basic Info', 'Gaming Profile', 'Assessment', 'Review'].map((step, index) => (
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

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date/Time Section */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Date/Time Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="text"
                        value={formData.submissionDate}
                        onChange={(e) => updateFormData('submissionDate', e.target.value)}
                        onClick={() => captureDateTime('submissionDate')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white cursor-pointer"
                        placeholder="Click to set current date"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="text"
                        value={formData.submissionTime}
                        onChange={(e) => updateFormData('submissionTime', e.target.value)}
                        onClick={() => captureDateTime('submissionTime')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white cursor-pointer"
                        placeholder="Click to set current time"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Agent Information */}
                <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Agent Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Agent ID *
                      </label>
                      <input
                        type="text"
                        value={formData.agentId}
                        onChange={(e) => updateFormData('agentId', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-blue-400 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Agent Name *
                      </label>
                      <input
                        type="text"
                        value={formData.agentName}
                        onChange={(e) => updateFormData('agentName', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-blue-400 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Relationship & Status */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Relationship & Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Relationship to the individual that played the video games? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="relationship"
                            value="myself"
                            checked={formData.relationship === 'myself'}
                            onChange={(e) => updateFormData('relationship', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Myself</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="relationship"
                            value="loved_one"
                            checked={formData.relationship === 'loved_one'}
                            onChange={(e) => updateFormData('relationship', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Loved one</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Is the person who played video games a minor (under age of 18)? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="isMinor"
                            value="yes"
                            checked={formData.isMinor === 'yes'}
                            onChange={(e) => updateFormData('isMinor', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="isMinor"
                            value="no"
                            checked={formData.isMinor === 'no'}
                            onChange={(e) => updateFormData('isMinor', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Caller Information - Only show when "Loved one" is selected */}
                {formData.relationship === 'loved_one' && (
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Caller Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Caller Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Caller Name
                        </label>
                        <input
                          type="text"
                          value={formData.callerName}
                          onChange={(e) => updateFormData('callerName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                          placeholder="Enter caller name"
                        />
                      </div>

                      {/* Caller Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Caller Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.callerEmail}
                          onChange={(e) => updateFormData('callerEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                          placeholder="Enter caller email"
                        />
                      </div>

                      {/* Caller Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Caller Address
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={formData.callerAddressLine1}
                            onChange={(e) => updateFormData('callerAddressLine1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Address Line 1"
                          />
                          <input
                            type="text"
                            value={formData.callerAddressLine2}
                            onChange={(e) => updateFormData('callerAddressLine2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Address Line 2"
                          />
                          <input
                            type="text"
                            value={formData.callerCity}
                            onChange={(e) => updateFormData('callerCity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            value={formData.callerState}
                            onChange={(e) => updateFormData('callerState', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="State"
                          />
                          <input
                            type="text"
                            value={formData.callerZipCode}
                            onChange={(e) => updateFormData('callerZipCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="ZIP Code"
                          />
                        </div>
                      </div>

                      {/* Legal Authorization */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Do you have legal authorization to pursue claims on behalf of the individual that played the video games? *
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="legalAuthorization" value="yes" checked={formData.legalAuthorization === 'yes'} onChange={(e) => updateFormData('legalAuthorization', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-black">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="legalAuthorization" value="no" checked={formData.legalAuthorization === 'no'} onChange={(e) => updateFormData('legalAuthorization', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-black">No</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="legalAuthorization" value="willing" checked={formData.legalAuthorization === 'willing'} onChange={(e) => updateFormData('legalAuthorization', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-black">No but I would be willing to gain legal authorization</span>
                          </label>
                        </div>
                      </div>

                      {/* Is Claimant Deceased */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Is the claimant Deceased? *
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="isClaimantDeceased" value="yes" checked={formData.isClaimantDeceased === 'yes'} onChange={(e) => updateFormData('isClaimantDeceased', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-black">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="isClaimantDeceased" value="no" checked={formData.isClaimantDeceased === 'no'} onChange={(e) => updateFormData('isClaimantDeceased', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-black">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Injured Party Information */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Injured Party Name *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.injuredPartyFirstName}
                        onChange={(e) => updateFormData('injuredPartyFirstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.injuredPartyMiddleName}
                        onChange={(e) => updateFormData('injuredPartyMiddleName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.injuredPartyLastName}
                        onChange={(e) => updateFormData('injuredPartyLastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suffix (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.injuredPartySuffix}
                        onChange={(e) => updateFormData('injuredPartySuffix', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        placeholder="Jr., Sr., III, etc."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured Party Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.injuredPartyEmail}
                    onChange={(e) => updateFormData('injuredPartyEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured Party DOB *
                  </label>
                  <input
                    type="date"
                    value={formData.injuredPartyDOB}
                    onChange={(e) => updateFormData('injuredPartyDOB', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured Party SSN *
                  </label>
                  <input
                    type="text"
                    value={formData.injuredPartySSN}
                    onChange={(e) => updateFormData('injuredPartySSN', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                </div>

                {/* Address Information */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Injured Party Address *</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => updateFormData('addressLine1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => updateFormData('addressLine2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        placeholder="Apartment, suite, unit, etc."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <select
                          value={formData.state}
                          onChange={(e) => updateFormData('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                          required
                        >
                          <option value="">Select state</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.secondaryPhoneNumber}
                    onChange={(e) => updateFormData('secondaryPhoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Caller Number Provided *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="callerNumberType"
                        value="home"
                        checked={formData.callerNumberType === 'home'}
                        onChange={(e) => updateFormData('callerNumberType', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-black">Home</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="callerNumberType"
                        value="cell"
                        checked={formData.callerNumberType === 'cell'}
                        onChange={(e) => updateFormData('callerNumberType', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-black">Cell Phone</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Legal Information Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Legal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Have you previously signed documents with an attorney for this claim? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="previousAttorneyDocuments"
                          value="yes"
                          checked={formData.previousAttorneyDocuments === 'yes'}
                          onChange={(e) => updateFormData('previousAttorneyDocuments', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="previousAttorneyDocuments"
                          value="no"
                          checked={formData.previousAttorneyDocuments === 'no'}
                          onChange={(e) => updateFormData('previousAttorneyDocuments', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="previousAttorneyDocuments"
                          value="dq"
                          checked={formData.previousAttorneyDocuments === 'dq'}
                          onChange={(e) => updateFormData('previousAttorneyDocuments', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">DQ- If yes</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legal Full Name of person signing *
                    </label>
                    <input
                      type="text"
                      value={formData.legalFullName}
                      onChange={(e) => updateFormData('legalFullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Is Injured Party currently going to school? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="currentlyInSchool"
                          value="yes"
                          checked={formData.currentlyInSchool === 'yes'}
                          onChange={(e) => updateFormData('currentlyInSchool', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="currentlyInSchool"
                          value="no"
                          checked={formData.currentlyInSchool === 'no'}
                          onChange={(e) => updateFormData('currentlyInSchool', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Level of Education for Gamer? *
                    </label>
                    <select
                      value={formData.highestEducationLevel}
                      onChange={(e) => updateFormData('highestEducationLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      required
                    >
                      <option value="">Select Education Level</option>
                      <option value="elementary">Elementary School</option>
                      <option value="middle">Middle School</option>
                      <option value="high_school">High School</option>
                      <option value="some_college">Some College</option>
                      <option value="associates">Associate's Degree</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="doctorate">Doctorate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Gaming History Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Gaming History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimate the date that injured party first started playing video games? *
                    </label>
                    <input
                      type="date"
                      value={formData.gamingStartDate}
                      onChange={(e) => updateFormData('gamingStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      On average how many hours a day do you play video games? *
                    </label>
                    <input
                      type="number"
                      value={formData.hoursPerDayGaming}
                      onChange={(e) => updateFormData('hoursPerDayGaming', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                      min="0"
                      max="24"
                      step="0.5"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select gaming platforms that have been used. *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.gamingPlatforms.includes('playstation')}
                          onChange={(e) => updateArrayField('gamingPlatforms', 'playstation', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">PlayStation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.gamingPlatforms.includes('xbox')}
                          onChange={(e) => updateArrayField('gamingPlatforms', 'xbox', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Xbox</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.gamingPlatforms.includes('nintendo')}
                          onChange={(e) => updateArrayField('gamingPlatforms', 'nintendo', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Nintendo Switch</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Gaming Platforms Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Select gaming platforms that have been used. *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Playstation',
                    'Xbox', 
                    'Nintendo Switch',
                    'Gaming Computer or Laptop',
                    'Steam',
                    'Apple iPhone',
                    'Android Phone',
                    'Oculus VR',
                    'Meta Quest',
                    'Other Gaming Device'
                  ].map(platform => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.gamingPlatforms.includes(platform.toLowerCase().replace(/\s+/g, '_'))}
                        onChange={(e) => updateArrayField('gamingPlatforms', platform.toLowerCase().replace(/\s+/g, '_'), e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-black">{platform}</span>
                    </label>
                  ))}
                </div>

                {/* Dynamic Gamer Tag Fields */}
                {formData.gamingPlatforms.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-gray-700 mb-3">Gamer Tags for Selected Platforms:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.gamingPlatforms.includes('playstation') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Playstation Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.playstationGamerTag || ''}
                            onChange={(e) => updateFormData('playstationGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Playstation Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('xbox') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xbox Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.xboxGamerTag || ''}
                            onChange={(e) => updateFormData('xboxGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Xbox Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('nintendo_switch') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nintendo Switch Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.nintendoSwitchGamerTag || ''}
                            onChange={(e) => updateFormData('nintendoSwitchGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Nintendo Switch Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('gaming_computer_or_laptop') && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gaming Computer or Laptop
                            </label>
                            <input
                              type="text"
                              value={formData.laptopDesktopName || ''}
                              onChange={(e) => updateFormData('laptopDesktopName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                              placeholder="Enter laptop/desktop name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Name of Laptop or Desktop
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                'Dell',
                                'Lenova',
                                'HP', 
                                'Mac',
                                'iPad'
                              ].map(brand => (
                                <label key={brand} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={formData.laptopBrands.includes(brand.toLowerCase())}
                                    onChange={(e) => updateArrayField('laptopBrands', brand.toLowerCase(), e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-black">{brand}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('steam') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Steam Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.steamGamerTag || ''}
                            onChange={(e) => updateFormData('steamGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Steam Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('apple_iphone') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apple iPhone Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.appleIphoneGamerTag || ''}
                            onChange={(e) => updateFormData('appleIphoneGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Apple iPhone Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('android_phone') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Android Phone Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.androidPhoneGamerTag || ''}
                            onChange={(e) => updateFormData('androidPhoneGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Android Phone Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('oculus_vr') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Oculus VR Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.oculusVrGamerTag || ''}
                            onChange={(e) => updateFormData('oculusVrGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Oculus VR Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('meta_quest') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Quest Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.metaQuestGamerTag || ''}
                            onChange={(e) => updateFormData('metaQuestGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter Meta Quest Gamer Tag"
                          />
                        </div>
                      )}
                      {formData.gamingPlatforms.includes('other_gaming_device') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Other Gaming Device & Gamer Tag
                          </label>
                          <input
                            type="text"
                            value={formData.otherGamingDeviceGamerTag || ''}
                            onChange={(e) => updateFormData('otherGamingDeviceGamerTag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                            placeholder="Enter other gaming device and gamer tag"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Games Played Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Select all video games that have been played. *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Apex Legends',
                    'Call of Duty',
                    'Counter-Strike',
                    'Fortnite',
                    'GTA 5',
                    'League of Legends',
                    'Minecraft',
                    'Overwatch',
                    'Rainbow Six: Siege',
                    'Roblox',
                    'Rocket League',
                    'Teamfight Tactics',
                    'Valorant',
                    'World of Warcraft',
                    'Other Game'
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

              {/* First Game Played Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">What video game that was played first? *</h3>
                <input
                  type="text"
                  value={formData.firstGamePlayed}
                  onChange={(e) => updateFormData('firstGamePlayed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                  placeholder="Enter the first video game played"
                  required
                />
              </div>

              {/* Detailed Gaming History Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Please list the game names including the version, dates, and estimated hours spent playing each of the above game. *</h3>
                <textarea
                  value={formData.detailedGamingHistory}
                  onChange={(e) => updateFormData('detailedGamingHistory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                  rows={6}
                  placeholder="List each game with version, dates played, and hours spent..."
                  required
                />
              </div>

              {/* Gaming Subscriptions & Accessories Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Gaming Subscriptions & Accessories</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Subscriptions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Which monthly subscription(s) did you purchase? *
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {[
                        'Game Pass Ultimate',
                        'Game Pass Core',
                        'XBox Live Gold',
                        'Playstation Premium',
                        'Playstation Extra',
                        'Playstation Essential',
                        'EA Play',
                        'EA Play Pro',
                        'Apple Arcade',
                        'Google Play Pass',
                        'Amazon Prime Gaming',
                        'NVIDIA GeForce NOW',
                        'Amazon Luna',
                        'Roblox Premim',
                        'Ubisoft Classics',
                        'Ubisoft Premium',
                        'Fortnite Battlepass',
                        'Fortnite Crew Subscription',
                        'Other Subscription',
                        'No Monthly Subscription'
                      ].map(subscription => (
                        <label key={subscription} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.monthlySubscriptions.includes(subscription)}
                            onChange={(e) => updateArrayField('monthlySubscriptions', subscription, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">{subscription}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cloud Gaming Subscriptions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you subscribe to any cloud/internet gaming subscription(s) (online gaming subscriptions)? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="cloudGamingSubscriptions"
                          value="yes"
                          checked={formData.cloudGamingSubscriptions === 'yes'}
                          onChange={(e) => updateFormData('cloudGamingSubscriptions', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="cloudGamingSubscriptions"
                          value="no"
                          checked={formData.cloudGamingSubscriptions === 'no'}
                          onChange={(e) => updateFormData('cloudGamingSubscriptions', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="cloudGamingSubscriptions"
                          value="unsure"
                          checked={formData.cloudGamingSubscriptions === 'unsure'}
                          onChange={(e) => updateFormData('cloudGamingSubscriptions', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Unsure</span>
                      </label>
                    </div>
                  </div>

                  {/* Virtual Reality Accessories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you use virtual reality headsets, gloves, or other video game accessories? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="virtualRealityAccessories"
                          value="yes"
                          checked={formData.virtualRealityAccessories === 'yes'}
                          onChange={(e) => updateFormData('virtualRealityAccessories', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="virtualRealityAccessories"
                          value="no"
                          checked={formData.virtualRealityAccessories === 'no'}
                          onChange={(e) => updateFormData('virtualRealityAccessories', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Game Purchase Receipts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you have receipts for any video games related purchased? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gamePurchaseReceipts"
                          value="yes"
                          checked={formData.gamePurchaseReceipts === 'yes'}
                          onChange={(e) => updateFormData('gamePurchaseReceipts', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gamePurchaseReceipts"
                          value="no"
                          checked={formData.gamePurchaseReceipts === 'no'}
                          onChange={(e) => updateFormData('gamePurchaseReceipts', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaming Habits & Financial Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Gaming Habits & Financial</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        On average how much money per month was spent on video gaming? *
                      </label>
                      <input
                        type="text"
                        value={formData.monthlyGamingSpend}
                        onChange={(e) => updateFormData('monthlyGamingSpend', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        placeholder="Enter amount spent per month"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you tried to stop or give up gaming? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="triedToStopGaming"
                            value="yes"
                            checked={formData.triedToStopGaming === 'yes'}
                            onChange={(e) => updateFormData('triedToStopGaming', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="triedToStopGaming"
                            value="no"
                            checked={formData.triedToStopGaming === 'no'}
                            onChange={(e) => updateFormData('triedToStopGaming', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Did you pay for additional items in the video games, such as loot, level up options, rewards, badges, or additional game content? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="paidForAdditionalItems"
                            value="yes"
                            checked={formData.paidForAdditionalItems === 'yes'}
                            onChange={(e) => updateFormData('paidForAdditionalItems', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="paidForAdditionalItems"
                            value="no"
                            checked={formData.paidForAdditionalItems === 'no'}
                            onChange={(e) => updateFormData('paidForAdditionalItems', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">No</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="paidForAdditionalItems"
                            value="unsure"
                            checked={formData.paidForAdditionalItems === 'unsure'}
                            onChange={(e) => updateFormData('paidForAdditionalItems', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Unsure</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Did you receive a reward of an energy drink or powder with Battle Pass or other video games? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="receivedEnergyDrinkRewards"
                            value="yes"
                            checked={formData.receivedEnergyDrinkRewards === 'yes'}
                            onChange={(e) => updateFormData('receivedEnergyDrinkRewards', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="receivedEnergyDrinkRewards"
                            value="no"
                            checked={formData.receivedEnergyDrinkRewards === 'no'}
                            onChange={(e) => updateFormData('receivedEnergyDrinkRewards', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">No</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="receivedEnergyDrinkRewards"
                            value="do_not_know"
                            checked={formData.receivedEnergyDrinkRewards === 'do_not_know'}
                            onChange={(e) => updateFormData('receivedEnergyDrinkRewards', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Do not know</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you have photos, witnesses, or any proof that video games were played/used? *
                      </label>
                      <div className="space-y-2">
                        {[
                          'Photos',
                          'Witnesses', 
                          'Other Proof'
                        ].map(proof => (
                          <label key={proof} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.gamingProof.includes(proof)}
                              onChange={(e) => updateArrayField('gamingProof', proof, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-black">{proof}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you ever watched social media gaming influencers on YouTube, TikTok, or any other websites? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="watchedGamingInfluencers"
                            value="yes"
                            checked={formData.watchedGamingInfluencers === 'yes'}
                            onChange={(e) => updateFormData('watchedGamingInfluencers', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="watchedGamingInfluencers"
                            value="no"
                            checked={formData.watchedGamingInfluencers === 'no'}
                            onChange={(e) => updateFormData('watchedGamingInfluencers', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Did you sell in video game content or loot (level, persons, badges, etc.) for money? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="soldVideoGameContent"
                            value="yes"
                            checked={formData.soldVideoGameContent === 'yes'}
                            onChange={(e) => updateFormData('soldVideoGameContent', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="soldVideoGameContent"
                            value="no"
                            checked={formData.soldVideoGameContent === 'no'}
                            onChange={(e) => updateFormData('soldVideoGameContent', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaming Disorder Symptoms Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Gaming Disorder Symptoms & Injuries</h3>
                
                <div className="space-y-6">
                  {/* Gaming Disorder Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select all internet gaming disorder symptoms that the individual has experienced or has been witnessed since playing video games *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Poor school or work performance due to playing video games',
                        'Withdrawal symptoms when games are taken away such as Sadness, Anxiety or Restlessness, Gamers Rage',
                        'Loss of interest in sports, hobbies or spending time with family',
                        'Gamer recognizes they have a problem with excessive gaming',
                        'Deceives family about gameplay time or steals money to play games',
                        'Needs to play more hours on video games to the detriment of education or work',
                        'Decline in personal hygiene due to gaming',
                        'Failed attempts to stop playing video games',
                        'Uses video games to relieve negative moods such as guilt or depression',
                        'None of the above'
                      ].map(symptom => (
                        <label key={symptom} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.gamingDisorderSymptoms.includes(symptom)}
                            onChange={(e) => updateArrayField('gamingDisorderSymptoms', symptom, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <span className="text-sm text-black leading-relaxed">{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gaming Injuries */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Have you had any of the following injuries or diagnoses due to video games? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Diagnosed gaming disorder or addiction',
                        'Opposition defiant disorder (ODD)',
                        'Suicide attempt',
                        'Depression',
                        'ADD/ ADHD (Attention deficit hyperactivity disorder)',
                        'Gamer\'s rage',
                        'Gamer\'s thumb',
                        'Seizures',
                        'Computer vision syndrome',
                        'Carpal tunnel syndrome',
                        'Orthopedic injury',
                        'Sleep Deprivation Psychosis',
                        'Other injury',
                        'No injury'
                      ].map(injury => (
                        <label key={injury} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.gamingInjuries.includes(injury)}
                            onChange={(e) => updateArrayField('gamingInjuries', injury, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <span className="text-sm text-black leading-relaxed">{injury}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Life Impact & Medical Treatment Section */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Life Impact & Medical Treatment</h3>
                
                <div className="space-y-6">
                  {/* Life Impact from Gaming */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Have video games affected your life in any of the following ways? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Drop in grades',
                        'Dropout of school',
                        'Hiding or lying about game playing time',
                        'Inability to stop playing games',
                        'Poor Hygiene due to excessive video gaming',
                        'Received an individualized Education Plan (IEP)',
                        'Social isolation',
                        'Stealing money for gaming',
                        'Withdrawal symptoms',
                        'Other Affects',
                        'No affects from video games'
                      ].map(impact => (
                        <label key={impact} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.lifeImpactFromGaming.includes(impact)}
                            onChange={(e) => updateArrayField('lifeImpactFromGaming', impact, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <span className="text-sm text-black leading-relaxed">{impact}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Medical Treatments Received */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Have you received any of the following medical treatments due to playing video games? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Counseling',
                        'Doctor visits',
                        'Hospitalization',
                        'In person gaming addiction program',
                        'Online gaming addiction program',
                        'Therapy',
                        'Other treatment',
                        'No treatment'
                      ].map(treatment => (
                        <label key={treatment} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.medicalTreatmentsReceived.includes(treatment)}
                            onChange={(e) => updateArrayField('medicalTreatmentsReceived', treatment, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <span className="text-sm text-black leading-relaxed">{treatment}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Medical Provider Diagnosis & Medication */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Did a medical provider diagnosis and/or treat you for any of the gaming related injuries? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="medicalProviderDiagnosis" value="yes" checked={formData.medicalProviderDiagnosis === 'yes'} onChange={(e) => updateFormData('medicalProviderDiagnosis', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="medicalProviderDiagnosis" value="no" checked={formData.medicalProviderDiagnosis === 'no'} onChange={(e) => updateFormData('medicalProviderDiagnosis', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Was any medication taken to treat you for any of the gaming related injuries? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="medicationTaken" value="yes" checked={formData.medicationTaken === 'yes'} onChange={(e) => updateFormData('medicationTaken', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="medicationTaken" value="no" checked={formData.medicationTaken === 'no'} onChange={(e) => updateFormData('medicationTaken', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Section - Medical, Legal, & Contact Info */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Medical, Legal & Contact Information</h3>
                
                <div className="space-y-6">
                  {/* Medical Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      List any other medical conditions you have been diagnosed with in the past ten years? *
                    </label>
                    <textarea
                      value={formData.otherMedicalConditions}
                      onChange={(e) => updateFormData('otherMedicalConditions', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white resize-vertical"
                      placeholder="Please list any medical conditions..."
                      required
                    />
                  </div>

                  {/* Legal & Criminal History */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you filed a lawsuit or been a defendant in a lawsuit? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="filedLawsuit" value="yes" checked={formData.filedLawsuit === 'yes'} onChange={(e) => updateFormData('filedLawsuit', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="filedLawsuit" value="no" checked={formData.filedLawsuit === 'no'} onChange={(e) => updateFormData('filedLawsuit', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you ever been convicted of a misdemeanor or felony? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="convictedCrime" value="yes" checked={formData.convictedCrime === 'yes'} onChange={(e) => updateFormData('convictedCrime', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="convictedCrime" value="no" checked={formData.convictedCrime === 'no'} onChange={(e) => updateFormData('convictedCrime', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SSDI & SSI Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you receive SSDI (Social Security Disability Insurance) benefits? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="receiveSSDI" value="yes" checked={formData.receiveSSDI === 'yes'} onChange={(e) => updateFormData('receiveSSDI', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="receiveSSDI" value="no" checked={formData.receiveSSDI === 'no'} onChange={(e) => updateFormData('receiveSSDI', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you receive SSI (Supplemental Security Income) benefits? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="receiveSSI" value="yes" checked={formData.receiveSSI === 'yes'} onChange={(e) => updateFormData('receiveSSI', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="receiveSSI" value="no" checked={formData.receiveSSI === 'no'} onChange={(e) => updateFormData('receiveSSI', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-black">No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Driver's License Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Upload Drivers License
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-2">Drag and drop here or <span className="text-blue-600 cursor-pointer">Browse files</span></p>
                        <p className="text-xs text-gray-500">Max file size: 10 MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => updateFormData('driversLicense', e.target.files?.[0] || null)}
                        className="hidden"
                        id="drivers-license-upload"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        placeholder="Enter emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone #
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Relationship to client
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => updateFormData('emergencyContactRelationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white"
                        placeholder="e.g., Parent, Spouse, Friend"
                      />
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => updateFormData('notes', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white resize-vertical"
                      placeholder="Additional notes or comments..."
                    />
                  </div>
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
                    {formData.injuredPartyFirstName} {formData.injuredPartyLastName} (Age: {formData.isMinor === 'yes' ? 'Minor' : 'Adult'})<br/>
                    {formData.injuredPartyEmail} | {formData.phoneNumber}<br/>
                    {formData.addressLine1}, {formData.city}, {formData.state} {formData.zipCode}
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
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTSIntakeFormTest; 