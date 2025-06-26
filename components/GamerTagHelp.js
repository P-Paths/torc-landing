import React from 'react';

export default function GamerTagHelp() {
  return (
    <section className="px-4 py-12 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">🎮 Need Help Finding Your Child’s Gamer Tag?</h2>
        <p className="mb-6 text-gray-600">
          These step-by-step guides will show you how to locate and adjust privacy settings on the most popular platforms:
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="https://www.canva.com/design/DAGoJV9Fdb4/ViA8hrbC6YSFe01-PgW3Wg/edit?utm_content=DAGoJV9Fdb4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
            className="bg-green-600 text-white font-semibold py-3 px-5 rounded shadow hover:bg-green-700 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            🟩 Xbox Guide
          </a>
          <a
            href="https://www.canva.com/design/DAGoIQjtMhA/_5OzyizbdhCM_9msS7EM2w/edit?utm_content=DAGoIQjtMhA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
            className="bg-blue-600 text-white font-semibold py-3 px-5 rounded shadow hover:bg-blue-700 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔵 PlayStation Guide
          </a>
          <a
            href="https://www.canva.com/design/DAGoHI6kEEA/2e87mhg7CMh3nVvdIQm-rg/edit?utm_content=DAGoHI6kEEA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
            className="bg-gray-800 text-white font-semibold py-3 px-5 rounded shadow hover:bg-gray-900 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⚫ Steam Guide
          </a>
        </div>
      </div>
    </section>
  );
}
