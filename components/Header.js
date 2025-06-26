import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/ats-logo.jpg"
            alt="All Tort Solutions Logo"
            width={160}
            height={50}
            priority
          />
        </div>

        {/* CTA + Future Nav */}
        <div className="flex items-center space-x-6">
          {/* Optional Nav Links */}
          {/* <a href="#symptoms" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
            Symptoms
          </a> */}

          <a
  href="https://calendly.com/preston-prestigiouspaths/video-game-addiction-info-intake-session"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-800 transition"
>
  📅 Book Help
</a>
        </div>
      </div>
    </header>
  );
}

