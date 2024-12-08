import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProfileProvider } from '@/context/ProfileContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PawMatch - Find Your Perfect Furry Friend',
  description: 'Match with your ideal dog companion using our smart matching system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark'>
      <body
        className={inter.className}
      >
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
