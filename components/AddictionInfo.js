'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AddictionInfo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = searchParams.get('agent') || 'AHRPE5559';

  const handleQualifyClick = () => {
    router.push(`/enhanced-intake?agent=${agentId}`);
  };

  return (
    <section className="bg-white text-black px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT COLUMN */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Signs of Video Game Addiction
            </h2>
            <p className="font-semibold mb-4">
              According to an article in the medical science journal <span className="text-red-600">Cureus</span>, symptoms of video game addiction include the following.
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm md:text-base">
              <li>
                <strong className="text-orange-600">Preoccupation with gaming.</strong> This includes excessively thinking about gaming, which may be intrusive and distract from other tasks.
              </li>
              <li>
                <strong className="text-orange-600">Deception.</strong> Lying about gaming time or claiming to be doing homework while secretly gaming.
              </li>
              <li>
                <strong className="text-orange-600">Withdrawing from social life.</strong> Preferring gaming relationships over real ones.
              </li>
              <li>
                <strong className="text-orange-600">Emotional and psychological changes.</strong> Becoming irritable, defensive, or angry when not allowed to game.
              </li>
              <li>
                <strong className="text-orange-600">Gaming as an escape.</strong> Relying on gaming to avoid addressing real-life problems.
              </li>
            </ul>
            <p className="mt-4 text-sm md:text-base">
              Experiencing these effects may not stop the person from gaming, leading to deeper emotional or psychological harm.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              The Negative Effects of Video Game Addiction
            </h2>
            <p className="font-semibold mb-4">
              Researchers have concluded that excessive use of video games may lead to adverse effects, such as:
            </p>
            <div className="grid grid-cols-2 gap-x-8 text-sm md:text-base">
              <ul className="list-disc pl-5 space-y-2">
                <li>Stress</li>
                <li>Verbal memory deficiency</li>
                <li>Lowered cognitive ability</li>
                <li>Anxiety</li>
                <li>Eye strain</li>
                <li>Loss of communication and/or social skills</li>
                <li>Extreme weight loss or gain</li>
                <li>Poor work or school performance</li>
              </ul>
              <ul className="list-disc pl-5 space-y-2">
                <li>Aggressive behavior</li>
                <li>Depression</li>
                <li>Sleeping disorders</li>
                <li>Lack of impulse control</li>
                <li>Back strain</li>
                <li>Carpal tunnel syndrome</li>
                <li>Loss of friends</li>
              </ul>
            </div>
            <p className="mt-4 text-sm md:text-base">
              Kids predisposed to impulse control disorders like ADD and ADHD are especially at risk.
            </p>
            <p className="mt-2 text-sm md:text-base mb-6">
              Gaming addiction may also lead to financial problems as individuals overspend to satisfy their urge.
            </p>

            {/* CTA BUTTON – Bottom Right Corner */}
            <div className="absolute bottom-0 right-0">
              <button
                onClick={handleQualifyClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md"
              >
                📝 See if you Qualify
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
