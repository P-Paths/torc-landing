export default function StepGuide() {
  return (
    <section className="bg-white text-black px-4 md:px-12 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        🧠 HAS YOUR CHILD EXPERIENCED THESE SYMPTOMS?
      </h2>

      <div className="max-w-4xl mx-auto space-y-16 text-sm md:text-base leading-relaxed">
        
        {/* LOWER TIER */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src="/images/child-fighting-dad-get-phone-back_1200x801-1024x684.jpg"
            alt="Child fighting with dad over phone"
            className="w-full md:w-1/3 rounded shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-pink-500">📉 LOWER TIER</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Inability to stop playing games</li>
              <li>Decline in personal hygiene</li>
              <li>Socially isolate</li>
              <li>Hiding or lying about playing time</li>
              <li>Making purchases without permission</li>
              <li>Irritability</li>
              <li>Gamers Rage</li>
              <li>Restlessness</li>
              <li>Decline in time spent with family</li>
            </ul>
          </div>
        </div>

        {/* MID TIER */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src="/images/Kid_Holding_Book.jpg"
            alt="Struggling student hiding face with book"
            className="w-full md:w-1/3 rounded shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-purple-500">⚖️ MID TIER</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Drop in grades</li>
              <li>Dropout of school</li>
              <li>Received an Individualized Education Plan (IEP)</li>
            </ul>
          </div>
        </div>

        {/* UPPER TIER */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src="/images/Institutionalized.jpeg"
            alt="Child in VR headset institutionalized"
            className="w-full md:w-1/3 rounded shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-500">🚨 UPPER TIER</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Institutionalized</li>
              <li>Documented suicide attempt</li>
            </ul>
          </div>
        </div>

        {/* LAWSUIT CTA */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-yellow-500">📢 VIDEO GAME ADDICTION LAWSUIT</h3>
          <p className="font-semibold mb-4">
            YOU COULD BE ENTITLED TO COMPENSATION! Has your child experienced any of these symptoms?
          </p>
          <a
            href="https://forms.gle/z3Wx5LVQQox5xXVw7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition"
          >
            📋 Start Your Free Claim Evaluation
          </a>
        </div>
      </div>
    </section>
  );
}






