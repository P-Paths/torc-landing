import React from 'react';
import { CheckCircle } from 'lucide-react';

const qualifications = [
  "Plays 3–4+ hours per day",
  "Over 1,100 hours played per year",
  "Must have an active Gamer Tag (Xbox, PlayStation, Steam)",
  "Shows at least one symptom listed below",
];

export default function QualificationsSection() {
  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          ⚖️ Qualifications to Join the Case
        </h2>

        <ul className="text-left space-y-4 text-lg text-gray-800">
          {qualifications.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-1" size={22} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Intake Form CTA */}
        <div className="mt-10">
          <a
            href="https://forms.gle/z3Wx5LVQQox5xXVw7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            📝 See if you Qualify
          </a>
        </div>
      </div>
    </section>
  );
}
