import '@/src/styles/globals.css';

import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/src/components/navbar';
import Footer from '@/src/components/footer';
import ProgressBarProvider from '@/src/components/providers/ProgressBarProvider';
import { AuthProvider } from '@/src/components/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Biluibaba - Your One-Stop Pet Shop',
    template: '%s | Biluibaba',
  },
  description:
    'Shop premium pet supplies, consult expert veterinarians, and find your perfect pet companion at Biluibaba.',
  keywords: [
    'pet shop',
    'pet supplies',
    'dog food',
    'cat food',
    'pet adoption',
    'veterinary',
    'pet care',
  ],
  authors: [{ name: 'Biluibaba' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://biluibaba.com',
    siteName: 'Biluibaba',
    title: 'Biluibaba - Your One-Stop Pet Shop',
    description:
      'Shop premium pet supplies, consult expert veterinarians, and find your perfect pet companion.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biluibaba - Your One-Stop Pet Shop',
    description:
      'Shop premium pet supplies, consult expert veterinarians, and find your perfect pet companion.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className="selection:bg-stone-950 selection:text-white">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              success: {
                style: {
                  color: 'green',
                },
              },
              error: {
                style: {
                  color: 'red',
                },
              },
            }}
          />
          <ProgressBarProvider>{children}</ProgressBarProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
