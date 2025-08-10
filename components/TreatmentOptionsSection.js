// components/TreatmentOptionsSection.js
import React, { useState } from 'react';

export default function TreatmentOptionsSection() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', day: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.day) {
      setError('Please fill all fields.');
      return;
    }
    setError('');
    setShowModal(false);
    window.open('https://us05web.zoom.us/j/84929271614?pwd=syfYiXRS2IRjYBsljwipAziDhc0EbF.1', '_blank');
  };

  return (
    <section className="bg-white text-black px-6 py-12 md:px-16 md:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-4xl font-bold text-orange-500">
          Treatment Options
        </h2>

        <p className="text-gray-700">
          Clinical evidence has shown that those addicted to online games experience biopsychological symptoms and complications, including hangovers, changes in mood, adaptability, and withdrawal.
        </p>

        <div>
          <h3 className="font-semibold text-lg">Effective treatments for gaming addiction may include:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside text-orange-400">
            <li>Therapy/counseling</li>
            <li>Medication</li>
            <li>Substance abuse treatment</li>
          </ul>
        </div>

        <p className="text-gray-700">
          Research into gaming addiction treatments has been relatively limited. More research must be done to determine how effective these treatments may be.
        </p>

        <h3 className="text-blue-600 text-2xl font-semibold">
          How We Can Help
        </h3>

        <p className="text-gray-700">
          A gaming addiction can rob a person of their friends, family, career, and even health. It may be possible to hold negligent gaming companies accountable and recover money to take care of the addicted person’s medical and psychological needs.
        </p>

        <p className="text-gray-700">
          Gaming addiction claims and lawsuits are not as common as other types of cases, so it is crucial to hire a lawyer with relevant experience when filing a gaming addiction claim.
        </p>

        {/* 🔍 Treatment Center Search */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4 text-blue-600">
            🔍 Search Treatment Centers Near You
          </h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter ZIP code"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Search
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Find local treatment centers, therapists, and support groups for gaming addiction
          </p>
        </div>

        {/* 👥 Zoom Meetings Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold mb-4 text-blue-600">
            💻 Free Zoom Counseling Sessions
          </h4>
          <p className="text-gray-700 mb-4">
            Get personalized help with gaming addiction recovery. Our certified counselors are available for free consultations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              📅 Schedule Free Session
            </button>
            <a
              href="https://us05web.zoom.us/j/84929271614?pwd=syfYiXRS2IRjYBsljwipAziDhc0EbF.1"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
            >
              🔔 Get Reminded of Upcoming Session
            </a>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Join Zoom Q&A</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Preferred Day</label>
                <select name="day" value={form.day} onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="">Select a day</option>
                  <option value="Saturday">Saturday (12–2pm)</option>
                  <option value="Sunday">Sunday (12–2pm)</option>
                </select>
              </div>
              {error && <div className="text-red-600 text-center font-medium">{error}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Join Now</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

