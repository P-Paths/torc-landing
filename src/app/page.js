'use client';
// src/app/page.js
import React, { useState } from 'react';
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
          onClick={() => setShowDemoForm((v) => !v)}
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

