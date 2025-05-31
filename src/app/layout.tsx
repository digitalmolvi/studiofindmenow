import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppLayout from '@/components/layout/AppLayout';
import { Toaster } from "@/components/ui/toaster";

// If you have specific font weights, you can specify them here.
// Example: const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });
// For now, we'll use the default configuration from Google Fonts <link>
// The <link> approach specified in guidelines will be used.

export const metadata: Metadata = {
  title: 'FindMeNow Portal',
  description: 'Portal for tracking missing person information.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
