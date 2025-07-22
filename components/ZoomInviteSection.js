// components/ZoomInviteSection.js
import React, { useState } from 'react';

export default function ZoomInviteSection() {
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
    <section className="bg-white text-center py-12 px-4">
      <p className="text-md md:text-lg text-gray-800 font-medium mb-3">
        Need help walking through the form?
      </p>
      <p className="text-lg md:text-xl text-blue-600 font-semibold mb-6">
        Book a live intake session or join our Zoom Q&A!
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        {/* Book 1-on-1 Session (Google Form) */}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeZl_it-fgAHZ3lMrRQde9vYpIGAepmECQJbNgcrcRQLwPM6Q/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
          📅 Book 1-on-1 Session
        </a>
        {/* Zoom Link as Modal Trigger */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
          🎥 Join Zoom Q&A
        </button>
        {/* See if you Qualify (Formstack Priority 1) */}
        <a
          href="https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
         📝 See if you Qualify
        </a>
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
              <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700">Join Now</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

