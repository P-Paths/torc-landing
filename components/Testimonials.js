'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Testimonials() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = searchParams.get('agent') || 'AHRPE5559';

  const handleQualifyClick = () => {
    router.push(`/enhanced-intake?agent=${agentId}`);
  };

  return (
    <section className="bg-white text-black py-12 px-6 rounded-lg max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">
        📣 Real Parent Stories & Clinical Insight
      </h2>

      {/* Testimonial 1 – Jake's Story */}
      <div className="mb-12 border-b border-gray-300 pb-8">
        <p className="text-lg italic">
          “His gaming addiction spiraled into suicidal ideation and paramedics were called… With therapy, he’s now pursuing a degree in game design.”
        </p>
        <p className="mt-2 text-sm text-gray-600">
          — Dee, mother of Jake (16), UK via The Guardian (2024)
        </p>
        <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-4">
          <a
            href="https://www.theguardian.com/games/article/2024/jul/07/video-games-why-are-so-many-young-people-addicted"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            🌐 View Source
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeZl_it-fgAHZ3lMrRQde9vYpIGAepmECQJbNgcrcRQLwPM6Q/viewform"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            📅 Book 1-on-1
          </a>
          <button
            onClick={handleQualifyClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            📝 See if you Qualify
          </button>
        </div>
      </div>

      {/* Testimonial 2 – Violent Gaming Addiction */}
      <div className="mb-12 border-b border-gray-300 pb-8">
        <p className="text-lg italic">
          “My son is a violent video‑game addict — he said he’d ‘rather be dead than not game.’ That’s when I knew he needed help.”
        </p>
        <p className="mt-2 text-sm text-gray-600">
          — Parent via New York Post (2023)
        </p>
        <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-4">
          <a
            href="https://nypost.com/2023/03/28/my-son-is-a-violent-video-game-addict-hed-rather-be-dead-than-not-game/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            🌐 View Source
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeZl_it-fgAHZ3lMrRQde9vYpIGAepmECQJbNgcrcRQLwPM6Q/viewform"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            📅 Book 1-on-1
          </a>
          <button
            onClick={handleQualifyClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            📝 See if you Qualify
          </button>
        </div>
      </div>

      {/* Testimonial 3 – Parental Burnout */}
      <div className="mb-12 border-b border-gray-300 pb-8">
        <p className="text-lg italic">
          “I’m putting my own life on hold… maybe that’s why I’m burned out… but he is still more important than myself.”
        </p>
        <p className="mt-2 text-sm text-gray-600">
          — Parent of Patient 10 via MDPI Clinical Study (2024)
        </p>
        <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-4">
          <a
            href="https://www.mdpi.com/2227-9032/12/8/851"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            🌐 View Source
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeZl_it-fgAHZ3lMrRQde9vYpIGAepmECQJbNgcrcRQLwPM6Q/viewform"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            📅 Book 1-on-1
          </a>
          <button
            onClick={handleQualifyClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            📝 See if you Qualify
          </button>
        </div>
      </div>

      {/* Clinical Insight */}
      <div className="mt-10 text-base leading-relaxed">
        <strong>🧠 Clinical Insight:</strong>{' '}
        A 4-year fMRI study tracking <span className="font-semibold">6,143</span> teens showed that lower brain activity
        in decision/reward centers predicted later gaming-addiction symptoms—highlighting a real neurological risk in
        some youth.{' '}
        <a
          href="https://www.sciencedirect.com/science/article/abs/pii/S0306460323002550"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Study
        </a>
      </div>
    </section>
  );
}





