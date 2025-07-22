// Minor change for redeploy
'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <header className="bg-white shadow-md py-4 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/RTS LOGO.jpeg"
            alt="Real Time Solutions Logo"
            width={150}
            height={150}
            priority
          />
          <span className="text-4xl font-extrabold tracking-widest text-black drop-shadow-sm" style={{letterSpacing: '0.15em'}}>
            Real Time Solutions
          </span>
        </div>

        {/* CTA + Future Nav */}
        <div className="flex items-center space-x-6">
          {/* Optional Nav Links */}
          {/* <a href="#symptoms" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
            Symptoms
          </a> */}

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeZl_it-fgAHZ3lMrRQde9vYpIGAepmECQJbNgcrcRQLwPM6Q/viewform"
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

