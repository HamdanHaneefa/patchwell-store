import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
// Shiprocket One-Click Checkout stylesheet (required by their SDK)
// This must be loaded at root so it's available when the checkout popup opens.

export const metadata: Metadata = {
  title: {
    default: 'Patchwell — Wellness Patches for a Better You',
    template: '%s | Patchwell',
  },
  description:
    'Discover Patchwell\'s premium transdermal wellness patches. Natural ingredients for sleep, energy, focus, calm & more. Drug-free, clinically tested, and delivered to your door.',
  keywords: ['wellness patches', 'transdermal patch', 'sleep patch', 'energy patch', 'natural wellness', 'Patchwell'],
  icons: {
    icon: '/images/patchwell_favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://patchwell.com',
    siteName: 'Patchwell',
    title: 'Patchwell — Wellness Patches for a Better You',
    description:
      'Premium transdermal wellness patches. Natural ingredients for sleep, energy, focus, calm & more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patchwell — Wellness Patches for a Better You',
    description: 'Premium transdermal wellness patches. Natural ingredients for sleep, energy, focus, calm & more.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Shiprocket One-Click Checkout — required CSS (production) */}
        <link
          rel="stylesheet"
          href="https://checkout-ui.shiprocket.com/assets/styles/shopify.css"
        />
        <script src="https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js" defer></script>
      </head>
      <body>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
