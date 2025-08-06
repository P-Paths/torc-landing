'use client'

import React, { useState } from 'react';


// Define types for form fields
interface FormData {
  agentName: string;
  relation: string;
  isMinor: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  ssn: string;
  signedWithAttorney: string;
  legalFullName?: string;
  inSchool: string;
  education: string;
  startDate: string;
  avgHours: string;
  platforms: string[];
  games: string[];
  firstGame: string;
  gameHistory: string;
  subscriptions: string[];
  cloudSub: string;
  vrAccessories: string;
  receipts: string;
  monthlySpend: string;
  proof: string[];
  triedToStop: string;
  watchedInfluencers: string;
  paidForItems: string;
  soldContent: string;
  energyDrink: string;
  symptoms: string[];
  injuries: string[];
  lifeEffects: string[];
  treatments: string[];
  diagnosedByProvider: string;
  medication: string;
  otherConditions?: string;
  filedLawsuit: string;
  convicted: string;
  ssdi: string;
  ssi: string;
  driversLicense?: File | null;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  notes?: string;
  consent: boolean;
}

const initialFormData: FormData = {
  agentName: '',
  relation: '',
  isMinor: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  gender: '',
  email: '',
  phone: '',
  secondaryPhone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  dob: '',
  ssn: '',
  signedWithAttorney: '',
  legalFullName: '',
  inSchool: '',
  education: '',
  startDate: '',
  avgHours: '',
  platforms: [],
  games: [],
  firstGame: '',
  gameHistory: '',
  subscriptions: [],
  cloudSub: '',
  vrAccessories: '',
  receipts: '',
  monthlySpend: '',
  proof: [],
  triedToStop: '',
  watchedInfluencers: '',
  paidForItems: '',
  soldContent: '',
  energyDrink: '',
  symptoms: [],
  injuries: [],
  lifeEffects: [],
  treatments: [],
  diagnosedByProvider: '',
  medication: '',
  otherConditions: '',
  filedLawsuit: '',
  convicted: '',
  ssdi: '',
  ssi: '',
  driversLicense: null,
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelation: '',
  notes: '',
  consent: false,
};

const PRIORITY_1_URL = 'https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef';
const PRIORITY_2_URL = 'https://copilot.formstack.com/start-workflow/484828b7-d528-4147-8ffa-975f629d0cd8';
const REDIRECT_URL = 'https://atslawsuits.com/lawsuits/vga/';

const OptInForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState(() => (Math.random() < 0.6 ? '1' : '2'));

  // Helper for handling input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      if (e.target instanceof HTMLInputElement) {
        setFormData({ ...formData, [name]: e.target.checked });
      }
    } else if (type === 'file') {
      if (e.target instanceof HTMLInputElement) {
        setFormData({ ...formData, [name]: e.target.files ? e.target.files[0] : null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Helper for handling multi-select (checkbox group)
  const handleMultiSelect = (name: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[name as keyof FormData] as string[];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...arr, value] };
      }
    });
  };

  // Conditional logic helpers
  const isLovedOne = formData.relation === 'Loved one';
  const isMyself = formData.relation === 'Myself';
  const isMinor = formData.isMinor === 'Yes';
  const isAdult = formData.isMinor === 'No';
  const hasSignedWithAttorney = formData.signedWithAttorney === 'Yes';
  const isInSchool = formData.inSchool === 'Yes';
  const hasDiagnosedByProvider = formData.diagnosedByProvider === 'Yes';

  // Basic validation (required fields)
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.agentName) newErrors.agentName = 'Agent Name is required';
    if (!formData.relation) newErrors.relation = 'Relation is required';
    if (!formData.isMinor) newErrors.isMinor = 'Required';
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'ZIP is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.dob) newErrors.dob = 'DOB is required';
    if (!formData.ssn) newErrors.ssn = 'SSN is required';
    if (!formData.signedWithAttorney) newErrors.signedWithAttorney = 'Required';
    if (hasSignedWithAttorney && !formData.legalFullName) newErrors.legalFullName = 'Legal Full Name required';
    if (!formData.inSchool) newErrors.inSchool = 'Required';
    if (!formData.education) newErrors.education = 'Required';
    if (!formData.startDate) newErrors.startDate = 'Required';
    if (!formData.avgHours) newErrors.avgHours = 'Required';
    if (!formData.platforms.length) newErrors.platforms = 'Select at least one platform';
    if (!formData.games.length) newErrors.games = 'Select at least one game';
    if (!formData.firstGame) newErrors.firstGame = 'Required';
    if (!formData.gameHistory) newErrors.gameHistory = 'Required';
    if (!formData.subscriptions.length) newErrors.subscriptions = 'Select at least one';
    if (!formData.cloudSub) newErrors.cloudSub = 'Required';
    if (!formData.vrAccessories) newErrors.vrAccessories = 'Required';
    if (!formData.receipts) newErrors.receipts = 'Required';
    if (!formData.monthlySpend) newErrors.monthlySpend = 'Required';
    if (!formData.proof.length) newErrors.proof = 'Select at least one';
    if (!formData.triedToStop) newErrors.triedToStop = 'Required';
    if (!formData.watchedInfluencers) newErrors.watchedInfluencers = 'Required';
    if (!formData.paidForItems) newErrors.paidForItems = 'Required';
    if (!formData.soldContent) newErrors.soldContent = 'Required';
    if (!formData.energyDrink) newErrors.energyDrink = 'Required';
    if (!formData.symptoms.length) newErrors.symptoms = 'Select at least one';
    if (!formData.injuries.length) newErrors.injuries = 'Select at least one';
    if (!formData.lifeEffects.length) newErrors.lifeEffects = 'Select at least one';
    if (!formData.treatments.length) newErrors.treatments = 'Select at least one';
    if (!formData.diagnosedByProvider) newErrors.diagnosedByProvider = 'Required';
    if (!formData.medication) newErrors.medication = 'Required';
    if (!formData.filedLawsuit) newErrors.filedLawsuit = 'Required';
    if (!formData.convicted) newErrors.convicted = 'Required';
    if (!formData.ssdi) newErrors.ssdi = 'Required';
    if (!formData.ssi) newErrors.ssi = 'Required';
    // driversLicense is optional for now
    // emergency contact is optional for now
    // notes is optional
    if (!formData.consent) newErrors.consent = 'Consent is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Show loading state
        setSubmitted(true);
        
        // Store form data in localStorage for potential use
        localStorage.setItem('torcFormData', JSON.stringify(formData));
        
        // Submit to our API endpoint
        const response = await fetch('/api/submit-optin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Store the VGA form URL for testing
          if (result.vgaFormUrl) {
            localStorage.setItem('vgaFormUrl', result.vgaFormUrl);
          }
          
          // Show success message
          setTimeout(() => {
            // For testing, show the VGA form URL
            if (result.vgaFormUrl) {
              alert(`VGA Form URL: ${result.vgaFormUrl}`);
            }
          }, 1000);
        } else {
          throw new Error(result.message);
        }
        
      } catch (error) {
        console.error('Error processing form:', error);
        setSubmitted(false);
        alert('There was an error. Please try again or contact support.');
      }
    }
  };

  // Function to submit to Google Form via fetch
  const submitToGoogleForm = async (data: any) => {
    const formUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
    const formData = new URLSearchParams();
    
    // Add all form fields to URLSearchParams
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    return fetch(formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Required for Google Forms
    });
  };

  // Function to redirect to Google Form with pre-filled data
  const redirectToGoogleForm = (data: any) => {
    const baseUrl = 'https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef';
    const params = new URLSearchParams();
    
    // Add pre-filled data as URL parameters
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.append(key, value as string);
      }
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;
    window.open(fullUrl, '_blank');
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(e.target.value);
  };

  if (submitted) {
    return (
      <section className="bg-green-100 rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Thanks for submitting! Step 1 is done.</h2>
        <p className="text-green-700 mb-4">Please watch for your legal intake link shortly. We also host Zoom help sessions every Sat/Sun 12–2PM EST.</p>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="font-semibold mb-2">Step 2: Legal Intake Form</div>
          <a
            href={priority === '1' ? PRIORITY_1_URL : PRIORITY_2_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {priority === '1' ? 'Priority 1 Legal Intake (60%)' : 'Priority 2 Legal Intake (40%)'}
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Your form data has been saved locally for your convenience.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <div className="h-16 mb-2 bg-gray-300 rounded" style={{ width: '120px', margin: '0 auto' }}></div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Agent Intake</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Priority Toggle */}
        <div>
          <label className="block font-semibold mb-1">Legal Intake Link Priority</label>
          <div className="flex gap-4">
            <label>
              <input type="radio" name="priority" value="1" checked={priority === '1'} onChange={handlePriorityChange} /> Priority 1 (60%)
            </label>
            <label>
              <input type="radio" name="priority" value="2" checked={priority === '2'} onChange={handlePriorityChange} /> Priority 2 (40%)
            </label>
          </div>
          <div className="text-xs text-gray-500">(Default is randomized: 60% Priority 1, 40% Priority 2)</div>
        </div>
        {/* Agent Name */}
        <div>
          <label className="block font-semibold">Agent Name<span className="text-red-500">*</span></label>
          <input type="text" name="agentName" value={formData.agentName} onChange={handleChange} className="w-full p-2 border rounded" />
          {errors.agentName && <span className="text-red-500 text-sm">{errors.agentName}</span>}
        </div>
        
        {/* Relation */}
        <div>
          <label className="block font-semibold">Relation to Gamer<span className="text-red-500">*</span></label>
          <select name="relation" value={formData.relation} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Myself">Myself</option>
            <option value="Loved one">Loved one</option>
          </select>
          {errors.relation && <span className="text-red-500 text-sm">{errors.relation}</span>}
        </div>

        {/* Conditional: Only show if relation is selected */}
        {formData.relation && (
          <>
            {/* Is Minor */}
            <div>
              <label className="block font-semibold">
                {isLovedOne ? 'Is the person a minor?' : 'Are you a minor?'} <span className="text-red-500">*</span>
              </label>
              <select name="isMinor" value={formData.isMinor} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.isMinor && <span className="text-red-500 text-sm">{errors.isMinor}</span>}
            </div>

            {/* Conditional: Personal Information */}
            {formData.isMinor && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isLovedOne ? 'Information about the minor:' : 'Your information:'}
                </h3>
                
                {/* First Name */}
                <div>
                  <label className="block font-semibold">First Name<span className="text-red-500">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded" />
                  {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                </div>
                
                {/* Middle Name */}
                <div>
                  <label className="block font-semibold">Middle Name</label>
                  <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                
                {/* Last Name */}
                <div>
                  <label className="block font-semibold">Last Name<span className="text-red-500">*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded" />
                  {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                </div>
                
                {/* Suffix */}
                <div>
                  <label className="block font-semibold">Suffix</label>
                  <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                
                {/* Gender */}
                <div>
                  <label className="block font-semibold">Gender<span className="text-red-500">*</span></label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                </div>
                
                {/* DOB */}
                <div>
                  <label className="block font-semibold">Date of Birth<span className="text-red-500">*</span></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded" />
                  {errors.dob && <span className="text-red-500 text-sm">{errors.dob}</span>}
                </div>
              </div>
            )}

            {/* Conditional: Contact Information */}
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-green-800 mb-2">
                {isLovedOne ? 'Your contact information (as the loved one):' : 'Your contact information:'}
              </h3>
              
              {/* Email */}
              <div>
                <label className="block font-semibold">Email<span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>
              
              {/* Phone */}
              <div>
                <label className="block font-semibold">Phone Number<span className="text-red-500">*</span></label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </div>
              
              {/* Secondary Phone */}
              <div>
                <label className="block font-semibold">Secondary Phone</label>
                <input type="text" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>

            {/* Conditional: Address Information */}
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-semibold text-yellow-800 mb-2">
                {isLovedOne ? 'Address of the person with gaming addiction:' : 'Your address:'}
              </h3>
              
              {/* Address 1 */}
              <div>
                <label className="block font-semibold">Address Line 1<span className="text-red-500">*</span></label>
                <input type="text" name="address1" value={formData.address1} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.address1 && <span className="text-red-500 text-sm">{errors.address1}</span>}
              </div>
              
              {/* Address 2 */}
              <div>
                <label className="block font-semibold">Address Line 2</label>
                <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              
              {/* City */}
              <div>
                <label className="block font-semibold">City<span className="text-red-500">*</span></label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
              </div>
              
              {/* State */}
              <div>
                <label className="block font-semibold">State<span className="text-red-500">*</span></label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
              </div>
              
              {/* ZIP */}
              <div>
                <label className="block font-semibold">ZIP Code<span className="text-red-500">*</span></label>
                <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.zip && <span className="text-red-500 text-sm">{errors.zip}</span>}
              </div>
            </div>

            {/* Conditional: SSN Section */}
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 className="font-semibold text-red-800 mb-2">Social Security Information</h3>
              <p className="text-sm text-red-600 mb-3">This information is required for legal processing.</p>
              
              {/* SSN */}
              <div>
                <label className="block font-semibold">SSN<span className="text-red-500">*</span></label>
                <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.ssn && <span className="text-red-500 text-sm">{errors.ssn}</span>}
              </div>
            </div>

            {/* Conditional: Legal Information */}
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h3 className="font-semibold text-purple-800 mb-2">Legal Information</h3>
              
              {/* Signed With Attorney */}
              <div>
                <label className="block font-semibold">Have you previously signed documents with an attorney for this claim?<span className="text-red-500">*</span></label>
                <select name="signedWithAttorney" value={formData.signedWithAttorney} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.signedWithAttorney && <span className="text-red-500 text-sm">{errors.signedWithAttorney}</span>}
              </div>
              
              {/* Conditional: Legal Full Name */}
              {hasSignedWithAttorney && (
                <div>
                  <label className="block font-semibold">Legal Full Name of person signing<span className="text-red-500">*</span></label>
                  <input type="text" name="legalFullName" value={formData.legalFullName} onChange={handleChange} className="w-full p-2 border rounded" />
                  {errors.legalFullName && <span className="text-red-500 text-sm">{errors.legalFullName}</span>}
                </div>
              )}
            </div>

            {/* Conditional: Education Section */}
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h3 className="font-semibold text-indigo-800 mb-2">Education Information</h3>
              
              {/* In School */}
              <div>
                <label className="block font-semibold">
                  {isLovedOne ? 'Is the person currently going to school?' : 'Are you currently going to school?'}<span className="text-red-500">*</span>
                </label>
                <select name="inSchool" value={formData.inSchool} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.inSchool && <span className="text-red-500 text-sm">{errors.inSchool}</span>}
              </div>
              
              {/* Education Level */}
              <div>
                <label className="block font-semibold">
                  {isLovedOne ? 'Highest level of education for the gamer:' : 'Your highest level of education:'}<span className="text-red-500">*</span>
                </label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g., High School, College, etc." />
                {errors.education && <span className="text-red-500 text-sm">{errors.education}</span>}
              </div>
            </div>

            {/* Gaming Information Section */}
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h3 className="font-semibold text-orange-800 mb-2">Gaming Information</h3>
              
              {/* Start Date */}
              <div>
                <label className="block font-semibold">
                  {isLovedOne ? 'When did the person first start playing video games?' : 'When did you first start playing video games?'}<span className="text-red-500">*</span>
                </label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" />
                {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
              </div>
              
              {/* Average Hours */}
              <div>
                <label className="block font-semibold">
                  {isLovedOne ? 'On average, how many hours a day does the person play video games?' : 'On average, how many hours a day do you play video games?'}<span className="text-red-500">*</span>
                </label>
                <input type="text" name="avgHours" value={formData.avgHours} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g., 4-6 hours" />
                {errors.avgHours && <span className="text-red-500 text-sm">{errors.avgHours}</span>}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block font-semibold">Platforms<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="platforms" value="PC" checked={formData.platforms.includes('PC')} onChange={() => handleMultiSelect('platforms', 'PC')} className="mr-1" />
                  PC
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="platforms" value="Console" checked={formData.platforms.includes('Console')} onChange={() => handleMultiSelect('platforms', 'Console')} className="mr-1" />
                  Console
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="platforms" value="Mobile" checked={formData.platforms.includes('Mobile')} onChange={() => handleMultiSelect('platforms', 'Mobile')} className="mr-1" />
                  Mobile
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="platforms" value="VR" checked={formData.platforms.includes('VR')} onChange={() => handleMultiSelect('platforms', 'VR')} className="mr-1" />
                  VR
                </label>
              </div>
              {errors.platforms && <span className="text-red-500 text-sm">{errors.platforms}</span>}
            </div>
            {/* Games */}
            <div>
              <label className="block font-semibold">Games<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="games" value="Fortnite" checked={formData.games.includes('Fortnite')} onChange={() => handleMultiSelect('games', 'Fortnite')} className="mr-1" />
                  Fortnite
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="games" value="Call of Duty" checked={formData.games.includes('Call of Duty')} onChange={() => handleMultiSelect('games', 'Call of Duty')} className="mr-1" />
                  Call of Duty
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="games" value="League of Legends" checked={formData.games.includes('League of Legends')} onChange={() => handleMultiSelect('games', 'League of Legends')} className="mr-1" />
                  League of Legends
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="games" value="Valorant" checked={formData.games.includes('Valorant')} onChange={() => handleMultiSelect('games', 'Valorant')} className="mr-1" />
                  Valorant
                </label>
              </div>
              {errors.games && <span className="text-red-500 text-sm">{errors.games}</span>}
            </div>
            {/* First Game */}
            <div>
              <label className="block font-semibold">First Game<span className="text-red-500">*</span></label>
              <input type="text" name="firstGame" value={formData.firstGame} onChange={handleChange} className="w-full p-2 border rounded" />
              {errors.firstGame && <span className="text-red-500 text-sm">{errors.firstGame}</span>}
            </div>
            {/* Game History */}
            <div>
              <label className="block font-semibold">Game History<span className="text-red-500">*</span></label>
              <textarea name="gameHistory" value={formData.gameHistory} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
              {errors.gameHistory && <span className="text-red-500 text-sm">{errors.gameHistory}</span>}
            </div>
            {/* Subscriptions */}
            <div>
              <label className="block font-semibold">Subscriptions<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="subscriptions" value="Game Pass" checked={formData.subscriptions.includes('Game Pass')} onChange={() => handleMultiSelect('subscriptions', 'Game Pass')} className="mr-1" />
                  Game Pass
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="subscriptions" value="Premium" checked={formData.subscriptions.includes('Premium')} onChange={() => handleMultiSelect('subscriptions', 'Premium')} className="mr-1" />
                  Premium
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="subscriptions" value="Other" checked={formData.subscriptions.includes('Other')} onChange={() => handleMultiSelect('subscriptions', 'Other')} className="mr-1" />
                  Other
                </label>
              </div>
              {errors.subscriptions && <span className="text-red-500 text-sm">{errors.subscriptions}</span>}
            </div>
            {/* Cloud Sub */}
            <div>
              <label className="block font-semibold">Cloud Subscription<span className="text-red-500">*</span></label>
              <select name="cloudSub" value={formData.cloudSub} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.cloudSub && <span className="text-red-500 text-sm">{errors.cloudSub}</span>}
            </div>
            {/* VR Accessories */}
            <div>
              <label className="block font-semibold">VR Accessories<span className="text-red-500">*</span></label>
              <select name="vrAccessories" value={formData.vrAccessories} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.vrAccessories && <span className="text-red-500 text-sm">{errors.vrAccessories}</span>}
            </div>
            {/* Receipts */}
            <div>
              <label className="block font-semibold">Receipts<span className="text-red-500">*</span></label>
              <select name="receipts" value={formData.receipts} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.receipts && <span className="text-red-500 text-sm">{errors.receipts}</span>}
            </div>
            {/* Monthly Spend */}
            <div>
              <label className="block font-semibold">Monthly Spend<span className="text-red-500">*</span></label>
              <input type="text" name="monthlySpend" value={formData.monthlySpend} onChange={handleChange} className="w-full p-2 border rounded" />
              {errors.monthlySpend && <span className="text-red-500 text-sm">{errors.monthlySpend}</span>}
            </div>
            {/* Proof */}
            <div>
              <label className="block font-semibold">Proof<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="proof" value="Receipts" checked={formData.proof.includes('Receipts')} onChange={() => handleMultiSelect('proof', 'Receipts')} className="mr-1" />
                  Receipts
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="proof" value="Bills" checked={formData.proof.includes('Bills')} onChange={() => handleMultiSelect('proof', 'Bills')} className="mr-1" />
                  Bills
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="proof" value="Statements" checked={formData.proof.includes('Statements')} onChange={() => handleMultiSelect('proof', 'Statements')} className="mr-1" />
                  Statements
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="proof" value="Other" checked={formData.proof.includes('Other')} onChange={() => handleMultiSelect('proof', 'Other')} className="mr-1" />
                  Other
                </label>
              </div>
              {errors.proof && <span className="text-red-500 text-sm">{errors.proof}</span>}
            </div>
            {/* Tried to Stop */}
            <div>
              <label className="block font-semibold">Tried to Stop Playing?<span className="text-red-500">*</span></label>
              <select name="triedToStop" value={formData.triedToStop} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.triedToStop && <span className="text-red-500 text-sm">{errors.triedToStop}</span>}
            </div>
            {/* Watched Influencers */}
            <div>
              <label className="block font-semibold">Watched Influencers?<span className="text-red-500">*</span></label>
              <select name="watchedInfluencers" value={formData.watchedInfluencers} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.watchedInfluencers && <span className="text-red-500 text-sm">{errors.watchedInfluencers}</span>}
            </div>
            {/* Paid For Items */}
            <div>
              <label className="block font-semibold">Paid for Items?<span className="text-red-500">*</span></label>
              <select name="paidForItems" value={formData.paidForItems} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.paidForItems && <span className="text-red-500 text-sm">{errors.paidForItems}</span>}
            </div>
            {/* Sold Content */}
            <div>
              <label className="block font-semibold">Sold Content?<span className="text-red-500">*</span></label>
              <select name="soldContent" value={formData.soldContent} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.soldContent && <span className="text-red-500 text-sm">{errors.soldContent}</span>}
            </div>
            {/* Energy Drink */}
            <div>
              <label className="block font-semibold">Energy Drink?<span className="text-red-500">*</span></label>
              <select name="energyDrink" value={formData.energyDrink} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.energyDrink && <span className="text-red-500 text-sm">{errors.energyDrink}</span>}
            </div>
            {/* Symptoms */}
            <div>
              <label className="block font-semibold">Symptoms<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="symptoms" value="Depression" checked={formData.symptoms.includes('Depression')} onChange={() => handleMultiSelect('symptoms', 'Depression')} className="mr-1" />
                  Depression
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="symptoms" value="Anxiety" checked={formData.symptoms.includes('Anxiety')} onChange={() => handleMultiSelect('symptoms', 'Anxiety')} className="mr-1" />
                  Anxiety
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="symptoms" value="Isolation" checked={formData.symptoms.includes('Isolation')} onChange={() => handleMultiSelect('symptoms', 'Isolation')} className="mr-1" />
                  Isolation
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="symptoms" value="Irritability" checked={formData.symptoms.includes('Irritability')} onChange={() => handleMultiSelect('symptoms', 'Irritability')} className="mr-1" />
                  Irritability
                </label>
              </div>
              {errors.symptoms && <span className="text-red-500 text-sm">{errors.symptoms}</span>}
            </div>
            {/* Injuries */}
            <div>
              <label className="block font-semibold">Injuries<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="injuries" value="Headache" checked={formData.injuries.includes('Headache')} onChange={() => handleMultiSelect('injuries', 'Headache')} className="mr-1" />
                  Headache
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="injuries" value="Back Pain" checked={formData.injuries.includes('Back Pain')} onChange={() => handleMultiSelect('injuries', 'Back Pain')} className="mr-1" />
                  Back Pain
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="injuries" value="Eye Strain" checked={formData.injuries.includes('Eye Strain')} onChange={() => handleMultiSelect('injuries', 'Eye Strain')} className="mr-1" />
                  Eye Strain
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="injuries" value="Other" checked={formData.injuries.includes('Other')} onChange={() => handleMultiSelect('injuries', 'Other')} className="mr-1" />
                  Other
                </label>
              </div>
              {errors.injuries && <span className="text-red-500 text-sm">{errors.injuries}</span>}
            </div>
            {/* Life Effects */}
            <div>
              <label className="block font-semibold">Life Effects<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="lifeEffects" value="Family Issues" checked={formData.lifeEffects.includes('Family Issues')} onChange={() => handleMultiSelect('lifeEffects', 'Family Issues')} className="mr-1" />
                  Family Issues
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="lifeEffects" value="School Issues" checked={formData.lifeEffects.includes('School Issues')} onChange={() => handleMultiSelect('lifeEffects', 'School Issues')} className="mr-1" />
                  School Issues
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="lifeEffects" value="Social Issues" checked={formData.lifeEffects.includes('Social Issues')} onChange={() => handleMultiSelect('lifeEffects', 'Social Issues')} className="mr-1" />
                  Social Issues
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="lifeEffects" value="Other" checked={formData.lifeEffects.includes('Other')} onChange={() => handleMultiSelect('lifeEffects', 'Other')} className="mr-1" />
                  Other
                </label>
              </div>
              {errors.lifeEffects && <span className="text-red-500 text-sm">{errors.lifeEffects}</span>}
            </div>
            {/* Treatments */}
            <div>
              <label className="block font-semibold">Treatments<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" name="treatments" value="Therapy" checked={formData.treatments.includes('Therapy')} onChange={() => handleMultiSelect('treatments', 'Therapy')} className="mr-1" />
                  Therapy
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="treatments" value="Medication" checked={formData.treatments.includes('Medication')} onChange={() => handleMultiSelect('treatments', 'Medication')} className="mr-1" />
                  Medication
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="treatments" value="Counseling" checked={formData.treatments.includes('Counseling')} onChange={() => handleMultiSelect('treatments', 'Counseling')} className="mr-1" />
                  Counseling
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="treatments" value="Other" checked={formData.treatments.includes('Other')} onChange={() => handleMultiSelect('treatments', 'Other')} className="mr-1" />
                  Other
                </label>
              </div>
              {errors.treatments && <span className="text-red-500 text-sm">{errors.treatments}</span>}
            </div>
            {/* Diagnosed By Provider */}
            <div>
              <label className="block font-semibold">Diagnosed by a Provider?<span className="text-red-500">*</span></label>
              <select name="diagnosedByProvider" value={formData.diagnosedByProvider} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.diagnosedByProvider && <span className="text-red-500 text-sm">{errors.diagnosedByProvider}</span>}
            </div>
            {/* Medication */}
            <div>
              <label className="block font-semibold">Medication<span className="text-red-500">*</span></label>
              <input type="text" name="medication" value={formData.medication} onChange={handleChange} className="w-full p-2 border rounded" />
              {errors.medication && <span className="text-red-500 text-sm">{errors.medication}</span>}
            </div>
            {/* Other Conditions */}
            <div>
              <label className="block font-semibold">Other Conditions</label>
              <input type="text" name="otherConditions" value={formData.otherConditions} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            {/* Filed Lawsuit */}
            <div>
              <label className="block font-semibold">Filed a Lawsuit?<span className="text-red-500">*</span></label>
              <select name="filedLawsuit" value={formData.filedLawsuit} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.filedLawsuit && <span className="text-red-500 text-sm">{errors.filedLawsuit}</span>}
            </div>
            {/* Convicted */}
            <div>
              <label className="block font-semibold">Convicted?<span className="text-red-500">*</span></label>
              <select name="convicted" value={formData.convicted} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.convicted && <span className="text-red-500 text-sm">{errors.convicted}</span>}
            </div>
            {/* SSDI */}
            <div>
              <label className="block font-semibold">SSDI?</label>
              <select name="ssdi" value={formData.ssdi} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {/* SSI */}
            <div>
              <label className="block font-semibold">SSI?</label>
              <select name="ssi" value={formData.ssi} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {/* Drivers License */}
            <div>
              <label className="block font-semibold">Drivers License</label>
              <input type="file" name="driversLicense" onChange={(e) => setFormData({ ...formData, driversLicense: e.target.files ? e.target.files[0] : null })} className="w-full p-2 border rounded" />
            </div>
            {/* Emergency Contact */}
            <div>
              <label className="block font-semibold">Emergency Contact</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold">Name</label>
                  <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold">Phone</label>
                  <input type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold">Relation</label>
                  <select name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Notes */}
            <div>
              <label className="block font-semibold">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
            {/* Consent */}
            <div className="flex items-start space-x-2">
              <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mt-1" />
              <label className="text-sm">
                By clicking the "Submit" button below, I am asking to be contacted about my potential claim and to assist with obtaining a lawyer. Those responding to this ad expressly request and give permission to being contacted by Real Time Solutions, ATSlawsuits, a law firm, its representatives or associated co-counsel, working in this area of practice related to this inquiry and/or their services, at any time in any way, including but not limited to calls using an auto-dialer, text, fax, or email, even if these result in charges by your carrier. This request and permission override any do-not-call registry rules or list, or any other applicable law or regulation. Those responding to this ad confirm they have carefully read and consent to the Terms of Use and Privacy Policy contained in any links, website or publication by the law firm and/or its representatives, marketing or otherwise. I understand that submitting this information does not create an attorney-client relationship.<span className="text-red-500">*</span>
              </label>
            </div>
            {errors.consent && <span className="text-red-500 text-sm">{errors.consent}</span>}
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Submit</button>
          </>
        )}
      </form>
    </section>
  );
};

export default OptInForm; 