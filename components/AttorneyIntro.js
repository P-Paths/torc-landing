import Image from 'next/image';

export default function AttorneyIntro() {
  return (
    <section className="bg-gray-100 text-black py-12 px-6 rounded-lg max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Tina Bullock Photo */}
        <div className="flex-shrink-0">
          <Image
            src="/images/tina-bullock.jpg"
            alt="Attorney Tina Bullock"
            width={320}
            height={320}
            className="rounded-lg shadow-lg object-cover"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-blue-800 mb-1">Tina Bullock</h2>
          <h3 className="text-lg font-medium text-blue-600 mb-4">Managing Partner</h3>

          <p className="text-base mb-4">
            Tina Bullock is a pioneer in addressing video game addiction and a strong advocate for children’s rights. With
            over a decade of experience in litigating complex mass tort and medical malpractice cases, she has been
            recognized by ALM as an honoree for Managing Partner of the Year. Her firm was also acknowledged by ALM for
            its Diversity Initiative.
          </p>

          <p className="text-base mb-4">
            In 2024, Tina was nominated by her peers as Best Lawyer. She was selected as a Mid‑South Rising Star by
            Super Lawyers and a Top 100 Attorney for Medical Malpractice – Top 25 by The National Trial Lawyers
            Association. She also serves on the editorial board for Georgia’s Law 360.
          </p>

          <p className="text-base mb-4">
            Tina is a former registered nurse with 23 years of clinical hospital experience. She earned a nursing degree,
            a bachelor’s in accounting from Mississippi State University, and a JD from Nova Southeastern University.
            She is admitted to practice in Georgia, Mississippi, and multiple federal courts.
          </p>

          <p className="text-lg text-green-700 font-semibold mt-4 mb-6">
            💼 You pay <span className="underline">nothing</span> unless we win your case.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeZl_it-fgAHZ3lMrRQde9vYpIGAepmECQJbNgcrcRQLwPM6Q/viewform"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-center w-full sm:w-auto"
            >
              📅 Book 1-on-1 Call
            </a>
            <a
              href="https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-center w-full sm:w-auto"
            >
              📝 Submit Intake Form
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


