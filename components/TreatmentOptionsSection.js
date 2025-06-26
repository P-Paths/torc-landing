// components/TreatmentOptionsSection.js
export default function TreatmentOptionsSection() {
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

        {/* 🌟 Placeholder for ZIP-based treatment lookup */}
        <div className="border border-dashed border-gray-300 p-4 mt-6 rounded text-sm text-gray-500">
          🔍 <em>Coming soon:</em> Search for treatment centers by ZIP code
        </div>

        {/* 👥 Replace with actual link to Calendly or Zoom */}
        <div className="text-center mt-10">
          <p className="mb-2 text-gray-700">
            Need help walking through the form?
          </p>
          <a
            href="https://us05web.zoom.us/j/84929271614?pwd=syfYiXRS2IRjYBsljwipAziDhc0EbF.1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
          >
            Join Our Zoom Q&A →
          </a>
        </div>
      </div>
    </section>
  );
}

