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
import EnhancedIntakeForm from '../../components/EnhancedIntakeForm';

export default function Home() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const agent = params.get('agent');
      if (agent && !localStorage.getItem('agentName')) {
        localStorage.setItem('agentName', agent);
      }
    }
  }, []);

  return (
    <main className="bg-white text-black min-h-screen px-6 py-10 font-sans">
      <HeroSection />
      {/* Moved the button further down, below testimonials */}
      {showDemoForm && <EnhancedIntakeForm />}
      {/* Temporarily disabled for build fix */}
      {/* <QualificationsSection /> */}
      <StepGuide />
      {/* <ZoomInviteSection /> */}
      <GamerTagHelp />
      <CompaniesInLawsuit />
      {/* <Testimonials /> */}
      <div className="text-center my-8">
        <button
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          onClick={() => setShowDemoForm(!showDemoForm)}
        >
          {showDemoForm ? 'Hide Enhanced Intake Form' : '📝 Start Gaming Addiction Assessment'}
        </button>
      </div>
      <TreatmentOptionsSection />
      {/* <AddictionInfo /> */}
      <Footer />
    </main>
  );
}

