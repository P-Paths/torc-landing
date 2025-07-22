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
      {showDemoForm && <OptInMock />}
      <QualificationsSection />
      <StepGuide />
      <ZoomInviteSection />
      <GamerTagHelp />
      <CompaniesInLawsuit />
      <Testimonials />
      <div className="text-center my-8">
        <button
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          onClick={() => {
            if (typeof window !== 'undefined') {
              const agent = localStorage.getItem('agentName') || 'unknown';
              const formUrl = `https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef?field184472337=${encodeURIComponent(agent)}`;
              window.location.href = formUrl;
            }
          }}
        >
          {showDemoForm ? 'Hide Intake Form' : '📝 See if you Qualify'}
        </button>
      </div>
      <TreatmentOptionsSection />
      <AddictionInfo />
      <Footer />
    </main>
  );
}

