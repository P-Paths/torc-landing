// components/ZoomInviteSection.js
import React from 'react';

export default function ZoomInviteSection() {
  return (
    <section className="bg-white text-center py-12 px-4">
      <p className="text-md md:text-lg text-gray-800 font-medium mb-3">
        Need help walking through the form?
      </p>

      <p className="text-lg md:text-xl text-blue-600 font-semibold mb-6">
        Book a live intake session or join our Zoom Q&A!
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        {/* Calendly Link */}
        <a
          href="https://calendly.com/preston-prestigiouspaths/video-game-addiction-info-intake-session"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
          📅 Book 1-on-1 Session
        </a>

        {/* Zoom Link */}
        <a
          href="https://us05web.zoom.us/j/84929271614?pwd=syfYiXRS2IRjYBsljwipAziDhc0EbF.1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
          🎥 Join Zoom Q&A
        </a>

        {/* Google Form Link */}
        <a
          href="https://forms.gle/z3Wx5LVQQox5xXVw7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
         📝 See if you Qualify
        </a>
      </div>
    </section>
  );
}

