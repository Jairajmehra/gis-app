import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'GeoMapShare - Georeference & Share Custom PNG Overlays on Satellite Maps',
  description: 'Upload PNG images or layout designs, accurately georeference them on satellite maps, and instantly generate shareable links. Perfect for architects, planners, and GIS professionals.',
  keywords: 'georeference, satellite maps, PNG overlay, GIS, mapping tool, geospatial data, map sharing',
  openGraph: {
    title: 'GeoMapShare - Georeference & Share Custom PNG Overlays',
    description: 'Upload PNG images or layout designs, accurately georeference them on satellite maps, and instantly generate shareable links.',
    type: 'website',
    url: 'https://geomapshare.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GeoMapShare Preview' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoMapShare - Georeference & Share Custom PNG Overlays',
    description: 'Upload PNG images or layout designs, accurately georeference them on satellite maps, and instantly generate shareable links.',
    images: ['/twitter-image.png']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
