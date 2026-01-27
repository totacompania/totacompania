import type { Metadata } from 'next';
import './globals.css';
import AuroraBackground from '@/components/AuroraBackground';
import { ColorProvider } from '@/components/ColorProvider';

export const metadata: Metadata = {
  title: {
    default: 'Tota Compania - Théâtre pour ici et maintenant !',
    template: '%s | Tota Compania',
  },
  description: 'Depuis 1997, Tota Compania crée des spectacles poétiques et lumineux pour petits et grands enfants. Spectacles, festivals Tota Familia et Renc\'Arts, école de théâtre à Toul en Lorraine.',
  keywords: ['théâtre', 'spectacle', 'Lorraine', 'Toul', 'compagnie', 'Tota Compania', 'festival', 'Tota Familia', 'Renc\'Arts', 'école de théâtre', 'conte', 'marionnettes', 'jeune public'],
  authors: [{ name: 'Tota Compania' }],
  creator: 'Tota Compania',
  publisher: 'Tota Compania',
  metadataBase: new URL('https://totacompania.fr'),
  openGraph: {
    title: 'Tota Compania - Théâtre pour ici et maintenant !',
    description: 'Compagnie de théâtre professionnelle en Lorraine. Spectacles poétiques, festivals Tota Familia et Renc\'Arts, école de théâtre.',
    url: 'https://totacompania.fr',
    siteName: 'Tota Compania',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tota Compania - Théâtre pour ici et maintenant !',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tota Compania',
    description: 'Théâtre pour ici et maintenant !',
  },
  icons: {
    icon: [
      { url: '/images/logo/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/logo/logo-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/images/logo/logo-192.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/images/logo/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/images/logo/logo-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/images/logo/logo-192.png" />
      </head>
      <body className="min-h-screen">
        <AuroraBackground />
        <ColorProvider>{children}</ColorProvider>
      </body>
    </html>
  );
}
