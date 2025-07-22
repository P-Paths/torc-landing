'use client';

import React, { useState, useEffect } from 'react';

// EmailJS for client-side email
// (You must run: npm install emailjs-com)
import emailjs from 'emailjs-com';

const PRIORITY_1_URL = 'https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef';
const PRIORITY_2_URL = 'https://copilot.formstack.com/start-workflow/484828b7-d528-4147-8ffa-975f629d0cd8';
const REDIRECT_URL = 'https://atslawsuits.com/lawsuits/vga/';
const LOCAL_KEY = 'torcDemoLeads';

function saveLead(lead: any) {
  const leads = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  leads.push(lead);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(leads));
}

export default function OptInMock() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    referral: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [priority, setPriority] = useState(() => (Math.random() < 0.6 ? '1' : '2'));

  // Read agent from URL and pre-fill referral field
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const agent = params.get('agent');
      if (agent) {
        setForm((prev) => ({ ...prev, referral: agent }));
        localStorage.setItem('torcAgent', agent);
      } else {
        localStorage.removeItem('torcAgent');
      }
    }
  }, []);

  // Optionally restore agent from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !form.referral) {
      const agent = localStorage.getItem('torcAgent');
      if (agent) {
        setForm((prev) => ({ ...prev, referral: agent }));
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'referral') {
      localStorage.setItem('torcAgent', e.target.value);
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.city) {
      setError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    const lead = {
      ...form,
      timestamp: new Date().toISOString(),
      priority,
      agent: form.referral, // ensure agent is included in submission data
    };
    saveLead(lead);
    // Send confirmation email
    try {
      await emailjs.send(
        'service_n8g1rhf',
        'template_399ue8h',
        {
          name: form.name,
          email: form.email,
          message: `Thanks for submitting! Step 1 is done. Please watch for your legal intake link shortly. We also host Zoom help sessions every Sat/Sun 12–2PM EST.`,
        },
        'OSr18vq6omlHNNMkR'
      );
      setSuccess(true);
      setTimeout(() => {
        window.location.href = REDIRECT_URL;
      }, 1200);
    } catch (err) {
      setError('Sorry, there was a problem sending your confirmation email. Please try again or contact support.');
    }
  };

  if (success) {
    return (
      <div className="space-y-4 p-4 bg-white shadow-xl rounded-2xl max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold">Thanks, we got your info!</h2>
        <div className="text-gray-600">Redirecting you to the next step...</div>
        <div className="mt-4">
          <div className="font-semibold mb-2">Step 2: Legal Intake Form</div>
          <a
            href={priority === '1' ? PRIORITY_1_URL : PRIORITY_2_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {priority === '1' ? 'Priority 1 Legal Intake (60%)' : 'Priority 2 Legal Intake (40%)'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-xl rounded-2xl max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Agent Intake</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Name *</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>City *</label>
        <input name="city" value={form.city} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Referral Code</label>
        <input name="referral" value={form.referral} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="block font-semibold mb-1">Legal Intake Link Priority</label>
        <div className="flex gap-4">
          <label>
            <input type="radio" name="priority" value="1" checked={priority === '1'} onChange={handlePriorityChange} /> Priority 1 (60%)
          </label>
          <label>
            <input type="radio" name="priority" value="2" checked={priority === '2'} onChange={handlePriorityChange} /> Priority 2 (40%)
          </label>
        </div>
        <div className="text-xs text-gray-500">(Default is randomized: 60% Priority 1, 40% Priority 2)</div>
      </div>
      {error && <div className="text-red-600 text-center font-medium">{error}</div>}
      <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-xl">
        {submitting ? 'Submitting...' : 'Submit & Continue'}
      </button>
    </form>
  );
} 