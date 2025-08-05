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
  const [agentId, setAgentId] = useState('AHRPE5559');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const agent = params.get('agent');
      
      if (agent) {
        setAgentId(agent);
        if (!localStorage.getItem('agentName')) {
          localStorage.setItem('agentName', agent);
        }
      }
    }
  }, []);

  const handleQualifyClick = () => {
    window.location.href = `/rts-test?agent=${agentId}`;
  };

  return (
    <main className="bg-white text-black min-h-screen px-6 py-10 font-sans">
      <HeroSection />
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
          onClick={handleQualifyClick}
        >
          📝 See If You Qualify
        </button>
      </div>
      <TreatmentOptionsSection />
      {/* <AddictionInfo /> */}
      <Footer />
    </main>
  );
}

