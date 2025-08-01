'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import HeroSection from '../../../../components/HeroSections';
import QualificationsSection from '../../../../components/QualificationsSection';
import TreatmentOptionsSection from '../../../../components/TreatmentOptionsSection';
import ZoomInviteSection from '../../../../components/ZoomInviteSection';
import AddictionInfo from '../../../../components/AddictionInfo';
import GamerTagHelp from '../../../../components/GamerTagHelp';
import Testimonials from '../../../../components/Testimonials';
import StepGuide from '../../../../components/StepGuide';
import Footer from '../../../../components/Footer';
import CompaniesInLawsuit from '../../../../components/CompaniesInLawsuit';
import EnhancedIntakeForm from '../../../../components/EnhancedIntakeForm';

export default function AgentLandingPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [showDemoForm, setShowDemoForm] = useState(false);

  useEffect(() => {
    // Set the agent ID in localStorage for tracking
    if (agentId && typeof window !== 'undefined') {
      localStorage.setItem('agentName', agentId);
    }
  }, [agentId]);

  return (
    <main className="bg-white text-black min-h-screen px-6 py-10 font-sans">
      {/* Agent-specific header */}
      <div className="text-center mb-8 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          🎯 Agent-Specific Landing Page
        </h1>
        <p className="text-blue-800 font-bold text-lg">
          Agent ID: <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-mono text-xl">{agentId}</span>
        </p>
        <p className="text-sm text-blue-600 mt-2">
          This page was accessed via QR code scan from physical marketing materials
        </p>
      </div>

      <HeroSection />
      {showDemoForm && <EnhancedIntakeForm />}
      <QualificationsSection />
      <StepGuide />
      <ZoomInviteSection />
      <GamerTagHelp />
      <CompaniesInLawsuit />
      <Testimonials />
      
      <div className="text-center my-8">
        <button
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          onClick={() => setShowDemoForm(!showDemoForm)}
        >
          {showDemoForm ? 'Hide Enhanced Intake Form' : '📝 Start Gaming Addiction Assessment'}
        </button>
      </div>
      
      <TreatmentOptionsSection />
      <AddictionInfo />
      <Footer />
    </main>
  );
} 