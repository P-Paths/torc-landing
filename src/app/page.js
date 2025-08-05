'use client';
// src/app/page.js
import React, { useState } from 'react';
import HeroSections from '../../components/HeroSections';
import QualificationsSection from '../../components/QualificationsSection';
import TreatmentOptionsSection from '../../components/TreatmentOptionsSection';
import Testimonials from '../../components/Testimonials';
import Footer from '../../components/Footer';
import OptInForm from '../../components/OptInForm';

export default function Home() {
  const [showOptInForm, setShowOptInForm] = useState(false);

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
              onClick={() => setShowOptInForm(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg"
            >
              See if You Qualify
            </button>
          </div>
        </div>
      </section>

      {/* OptInForm Modal */}
      {showOptInForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Gaming Addiction Assessment</h2>
                <button 
                  onClick={() => setShowOptInForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <OptInForm />
            </div>
          </div>
        </div>
      )}

      {/* Rest of the page content */}
      <HeroSections />
      <QualificationsSection />
      <TreatmentOptionsSection />
      <Testimonials />
      <Footer />
    </main>
  );
}

