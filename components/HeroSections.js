'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingHooks = [
  'Warning Signs You Can’t Ignore 👀',
  'Behavioral Shifts Linked to Gaming 🎮',
  'Parents Nationwide Are Filing Claims 📄',
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingHooks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 py-16 bg-gray-50 text-slate-800 border-b border-gray-200">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* 🖼️ Left Side - Image */}
        <div className="flex justify-center">
          <Image
            src="/images/Gaming-Kid.jpg"
            alt="Teen stressed from gaming"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>

        {/* 🧠 Right Side - Text */}
        <div className="text-center md:text-left">
          {/* 👔 Logo */}
          <div className="mb-4 flex justify-center md:justify-start">
            <Image
              src="/images/ats-logo.jpg"
              alt="All Tort Solutions Logo"
              width={280}
              height={80}
              priority
            />
          </div>

          {/* 🧠 Static Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">
            Is Your Child Addicted to Video Games?
          </h2>

          {/* 🔁 Rotating Subtitle */}
          <AnimatePresence mode="wait">
            <motion.h3
              key={index}
              className="text-lg text-gray-700 mb-4 min-h-[2rem]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              {rotatingHooks[index]}
            </motion.h3>
          </AnimatePresence>

          {/* 💰 Bigger Comp Message */}
          <p className="text-xl text-green-700 font-semibold mb-2">
            You may qualify for up to <strong className="text-2xl">$100,000+</strong> in compensation.
          </p>

          <em className="text-sm text-gray-500 block mb-6">
            Don’t wait. Claims are being filed every day.
          </em>

          {/* 🔗 CTA Button */}
          <a
            href="https://forms.gle/z3Wx5LVQQox5xXVw7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition"
          >
            See if You Qualify →
          </a>
        </div>
      </div>
    </section>
  );
}






