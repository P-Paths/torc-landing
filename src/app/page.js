'use client';
// src/app/page.js
import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/HeroSections';
import QualificationsSection from '../../components/QualificationsSection';
import TreatmentOptionsSection from '../../components/TreatmentOptionsSection';
import ZoomInviteSection from '../../components/ZoomInviteSection';
import AddictionInfo from '../../components/AddictionInfo';
import GamerTagHelp from '../../components/GamerTagHelp';
import Testimonials from '../../components/Testimonials';
import StepGuide from '../../components/StepGuide';
import Footer from '../../components/Footer';
import CompaniesInLawsuit from '../../components/CompaniesInLawsuit';
import OptInMock from '../../components/OptInMock';
import ATSReplicaForm from '../../components/ATSReplicaForm';

export default function Home() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const agent = params.get('agent');
      const showForm = params.get('showForm');
      
      if (agent && !localStorage.getItem('agentName')) {
        localStorage.setItem('agentName', agent);
      }
      
      // Automatically show the form if showForm=true is in the URL
      if (showForm === 'true') {
        setShowDemoForm(true);
      }
    }
  }, []);

  return (
    <main className="bg-white text-black min-h-screen px-6 py-10 font-sans">
      <HeroSection />
      {/* Moved the button further down, below testimonials */}
      {showDemoForm && <ATSReplicaForm />}
      {/* Temporarily disabled for build fix */}
      {/* <QualificationsSection /> */}
      <StepGuide />
      {/* <ZoomInviteSection /> */}
      <GamerTagHelp />
      <CompaniesInLawsuit />
      {/* <Testimonials /> */}
      <div className="text-center my-8 space-y-4">
        <button
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          onClick={() => setShowDemoForm(!showDemoForm)}
        >
          {showDemoForm ? 'Hide Gaming Addiction Assessment' : '📝 See If You Qualify'}
        </button>
      </div>
      <TreatmentOptionsSection />
      {/* <AddictionInfo /> */}
      <Footer />
    </main>
  );
}

