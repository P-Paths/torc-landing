'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface FormData {
  gamerRelation: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  ageStarted: string;
  hoursPerDay: string;
  platforms: string[];
  games: string[];
  gamerTag: string;
  has1200Hours: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zip: string;
  agentId: string;
  disclaimerAccepted: boolean;
}

const IntakeFormContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    gamerRelation: '',
    dobMonth: '',
    dobDay: '',
    dobYear: '',
    ageStarted: '',
    hoursPerDay: '',
    platforms: [],
    games: [],
    gamerTag: '',
    has1200Hours: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    zip: '',
    agentId: '',
    disclaimerAccepted: false,
  });

  const [formErrors, setFormErrors] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const agent = searchParams.get('agent');
    if (agent) {
      setFormData((prev) => ({ ...prev, agentId: agent }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMultiSelect = (name: keyof Pick<FormData, 'platforms' | 'games'>, value: string) => {
    setFormData((prev) => {
      const list = prev[name];
      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, [name]: updated };
    });
  };

  const isBonusEligible = () => {
    const age = new Date().getFullYear() - parseInt(formData.dobYear || '0');
    const hasXbox = formData.platforms.includes('Xbox');
    const enoughHours = formData.has1200Hours === 'Yes';
    const validGames = ['Call of Duty', 'Grand Theft Auto', 'Fortnite', 'Minecraft', 'Roblox'];
    const playedBonusGame = formData.games.some((game) => validGames.includes(game));

    return age <= 22 && hasXbox && enoughHours && playedBonusGame;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.disclaimerAccepted) {
      setFormErrors('You must accept the disclaimer to continue.');
      return;
    }

    setSubmitting(true);
    setFormErrors('');

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      const bonus = isBonusEligible();

      // Redirect based on eligibility
      if (bonus) {
        window.location.href =
          'https://copilot.formstack.com/start-workflow/02a0c4da-0cb8-4bbb-af4a-4bdba28ca78d';
      } else {
        const rand = Math.random();
        const url =
          rand < 0.6
            ? 'https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef'
            : 'https://copilot.formstack.com/start-workflow/484828b7-d528-4147-8ffa-975f629d0cd8';
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      setFormErrors('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-lg font-bold text-red-600">TIME IS LIMITED TO FILE</h2>
      <p className="text-sm font-medium text-gray-900">FREE CASE EVALUATION</p>
      <p className="text-sm text-gray-900">YOU MAY BE ENTITLED TO <span className="font-bold">SIGNIFICANT COMPENSATION</span></p>

      {/* Gamer Info */}
      <label className="block text-gray-900">
        Who in your family is addicted to video games?
        <select name="gamerRelation" onChange={handleChange} required className="w-full border p-2 text-gray-900">
          <option value="">Select</option>
          <option>Myself</option>
          <option>Loved One</option>
          <option>Other</option>
        </select>
      </label>

      <div className="flex gap-2">
        <select name="dobMonth" onChange={handleChange} required className="w-full border p-2 text-gray-900">
          <option value="">Month</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </select>
        <select name="dobDay" onChange={handleChange} required className="w-full border p-2 text-gray-900">
          <option value="">Day</option>
          {[...Array(31)].map((_, i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </select>
        <select name="dobYear" onChange={handleChange} required className="w-full border p-2 text-gray-900">
          <option value="">Year</option>
          {[...Array(18)].map((_, i) => (
            <option key={i}>{2007 + i}</option>
          ))}
        </select>
      </div>

      <input type="number" name="ageStarted" placeholder="How old were they when they started playing?" onChange={handleChange} className="w-full border p-2 text-gray-900" />
      <input type="text" name="hoursPerDay" placeholder="How many hours/day do they play?" onChange={handleChange} className="w-full border p-2 text-gray-900" />

      <label className="text-gray-900">What platforms did they use?</label>
      <div className="flex flex-wrap gap-2">
        {['Xbox', 'PlayStation', 'Steam', 'PC', 'Tablet', 'Phone'].map((platform) => (
          <button
            type="button"
            key={platform}
            className={`px-3 py-1 border rounded ${formData.platforms.includes(platform) ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}`}
            onClick={() => handleMultiSelect('platforms', platform)}
          >
            {platform}
          </button>
        ))}
      </div>

      {formData.platforms.includes('Xbox') && (
        <input
          type="text"
          name="gamerTag"
          placeholder="Gamer Tag for Xbox (if known)"
          onChange={handleChange}
          className="w-full border p-2 text-gray-900"
        />
      )}

      <label className="text-gray-900">What games do/did they play?</label>
      <div className="flex flex-wrap gap-2">
        {[
          'Essential Gaming', 'Roblox', 'Call of Duty', 'Grand Theft Auto',
          'Battlefield', 'Rainbow Six', 'Saint Row', 'Rocket League', 'Overwatch',
          'PUBG', 'Battlegrounds', 'Need for Speed', 'NBA 2K', 'My Hero', 'Mine Quest',
          'Minecraft', 'Diablo', 'Apex Legends', 'Dead by Daylight'
        ].map((game) => (
          <button
            type="button"
            key={game}
            className={`px-3 py-1 border rounded ${formData.games.includes(game) ? 'bg-green-600 text-white' : 'bg-white text-gray-900'}`}
            onClick={() => handleMultiSelect('games', game)}
          >
            {game}
          </button>
        ))}
      </div>

      <input type="text" name="gamesOther" placeholder="Other games (optional)" onChange={handleChange} className="w-full border p-2 text-gray-900" />

      <label className="text-gray-900">
        Has the gamer racked up 1200+ hours?
        <select name="has1200Hours" onChange={handleChange} className="w-full border p-2 text-gray-900">
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>

      {/* Contact Info */}
      <div className="text-red-700 bg-red-100 text-center p-2 font-bold">Your Information is 100% Confidential</div>
      <div className="grid grid-cols-2 gap-2">
        <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-2 text-gray-900" required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-2 text-gray-900" required />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-2 text-gray-900" required />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 text-gray-900" required />
        <input name="zip" placeholder="ZIP Code" onChange={handleChange} className="border p-2 text-gray-900" required />
      </div>

      <label className="flex gap-2 items-start">
        <input type="checkbox" name="disclaimerAccepted" onChange={handleChange} required />
        <span className="text-sm text-gray-900">
          By clicking the &quot;Submit&quot; button below, I am asking to be contacted about my potential claim and to assist with obtaining a lawyer...
        </span>
      </label>

      {formErrors && <p className="text-red-500 text-sm">{formErrors}</p>}

      <button type="submit" disabled={submitting} className="bg-blue-600 text-white w-full p-3 rounded font-bold">
        {submitting ? 'Submitting...' : 'SUBMIT MY CLAIM'}
      </button>
    </form>
  );
};

const IntakeForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntakeFormContent />
    </Suspense>
  );
};

export default IntakeForm; 