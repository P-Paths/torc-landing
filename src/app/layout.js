// src/app/layout.js
import './globals.css';
import Header from '../../components/Header';
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'All Tort Solutions - Video Game Addiction Case',
  description: 'Nationwide claims for gaming-related harm in youth.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}


