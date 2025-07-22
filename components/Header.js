// Minor change for redeploy
'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <header className="bg-white shadow-md py-4 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        {/* Logo and Brand Name */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Image
            src="/images/RTS LOGO.jpeg"
            alt="Real Time Solutions Logo"
            width={90}
            height={90}
            priority
            className="w-20 h-20 sm:w-[90px] sm:h-[90px] object-contain"
          />
          <span className="text-2xl sm:text-4xl font-extrabold tracking-widest text-black drop-shadow-sm text-center sm:text-left" style={{letterSpacing: '0.15em'}}>
            Real Time Solutions
          </span>
        </div>

        {/* CTA + Future Nav */}
        <div className="flex items-center space-x-6 mt-2 sm:mt-0">
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

