'use client';
// src/app/page.js
import React, { useState, Suspense } from 'react';
import HeroSections from '../../components/HeroSections';
import QualificationsSection from '../../components/QualificationsSection';
import StepGuide from '../../components/StepGuide';
import CompaniesInLawsuit from '../../components/CompaniesInLawsuit';
import TreatmentOptionsSection from '../../components/TreatmentOptionsSection';
import Testimonials from '../../components/Testimonials';
import Footer from '../../components/Footer';
export default function Home() {
  const handleQualifyClick = () => {
    window.location.href = '/ats-form?agent=AHRPE5559';
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Is Your Child Addicted to Video Games?
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              You may qualify for up to $500,000 in compensation
            </p>
            <button 
              onClick={handleQualifyClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg"
            >
              See if You Qualify
            </button>
          </div>
        </div>
      </section>



      {/* Rest of the page content */}
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSections />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <QualificationsSection />
      </Suspense>
      <StepGuide />
      <CompaniesInLawsuit />
      <TreatmentOptionsSection />
      <Suspense fallback={<div>Loading...</div>}>
        <Testimonials />
      </Suspense>
      <Footer />
    </main>
  );
}

