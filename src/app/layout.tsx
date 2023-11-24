import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { cn } from '@/lib/utils';

import './globals.css';

const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'DNS Checker',
  description: 'A DNS checker for your domain',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          fontHeading.variable,
          GeistSans.variable,
          GeistMono.variable,
          'font-sans bg-gray-50 text-foreground'
        )}
      >
        {children}
      </body>
    </html>
  );
}
