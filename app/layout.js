import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'DBD Shuffle | Dead by Daylight Perk & Character Randomiser',
  description:
    'Dead by Daylight Randomiser - Randomly pick a Killer, Survivor, and Perks. Can you survive without the meta?',
  keywords:
    'Dead by Daylight Perk Randomiser, DBD Shuffle, Dead by Daylight Killer Picker, Survivor Randomiser, DBD Perk Build Generator',
  author: 'Catface',
  openGraph: {
    title: 'Dead by Daylight Perk & Character Randomiser',
    description:
      'Test your skills in Dead by Daylight with our DBD randomiser! Shuffle Killers, Survivors, and Perks to create a unique challenge every match!',
    url: 'https://dbdshuffle.vercel.app/',
    type: 'website',
  },
  twitter: {
    title: 'Dead by Daylight Perk & Character Randomiser',
    description:
      'Try our Dead by Daylight perk randomiser! Randomize a Killer, Survivor, and their perks for a fun challenge!',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Head>
        <meta name='robots' content='index, follow' />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
