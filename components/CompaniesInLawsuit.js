export default function CompaniesInLawsuit() {
  return (
    <section className="bg-gray-100 px-6 md:px-12 py-12 text-black">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Companies Named in the Lawsuit
      </h2>

      <p className="text-center max-w-3xl mx-auto text-lg mb-8">
        These industry giants are under legal scrutiny for allegedly engineering addictive gaming environments that target minors.
      </p>

      <ul className="list-disc list-inside max-w-4xl mx-auto space-y-2 text-sm md:text-base">
        <li><strong>Epic Games</strong> 🎮 Fortnite</li>
        <li><strong>Roblox Corporation</strong> 🧱 Roblox</li>
        <li><strong>Activision Blizzard</strong> ⚔️ Call of Duty, Overwatch, World of Warcraft</li>
        <li><strong>Take-Two Interactive / Rockstar Games</strong> 🚘 Grand Theft Auto</li>
        <li><strong>2K Games</strong> 🏀 NBA 2K, Borderlands</li>
        <li><strong>Microsoft Corporation</strong> 🎮 Minecraft, Xbox</li>
        <li><strong>Sony Interactive Entertainment</strong> 🎮 PlayStation distribution</li>
        <li><strong>Nintendo of America</strong> 🎮 Nintendo Switch games</li>
        <li><strong>Google LLC</strong> 🔍 Google Play Store</li>
        <li><strong>Apple Inc.</strong> 📱 App Store distribution</li>
        <li><strong>Electronic Arts</strong> ⚽ FIFA, Madden</li>
        <li><strong>Meta Platforms (Facebook)</strong> 🕶️ Oculus/VR games</li>
        <li><strong>InnerSloth</strong> 👽 Among Us</li>
        <li><strong>Mojang Studios</strong> ⛏️ Minecraft</li>
        <li><strong>Ubisoft</strong> 🎯 Assassin&apos;s Creed, Far Cry</li>
        <li><strong>Dell Technologies</strong> 💻 Device usage for gaming</li>
      </ul>

      <div className="text-center mt-10">
        <p className="text-lg font-semibold mb-4">
          If your child has played any of these games and shown concerning symptoms,<br />
          you may be eligible for compensation.
        </p>

        <a
          href="https://forms.gle/3hw5kLVQQogx5xXw7"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition"
        >
          🚨 Start Your Free Case Review
        </a>
      </div>
    </section>
  );
}

