'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Head from 'next/head';

export const metadata = {
  title: 'GeoMapShare - Georeference & Share Custom PNG Overlays on Satellite Maps',
  description: 'Upload PNG images or layout designs, accurately georeference them on satellite maps, and instantly generate shareable links. Perfect for architects, planners, and GIS professionals.',
  keywords: 'georeference, satellite maps, PNG overlay, GIS, mapping tool, geospatial data, map sharing',
  openGraph: {
    title: 'GeoMapShare - Georeference & Share Custom PNG Overlays',
    description: 'Upload PNG images or layout designs, accurately georeference them on satellite maps, and instantly generate shareable links.',
    type: 'website',
    url: 'https://geomapshare.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GeoMapShare Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoMapShare - Georeference & Share Custom PNG Overlays',
    description: 'Upload PNG images or layout designs, accurately georeference them on satellite maps, and instantly generate shareable links.',
    images: ['/twitter-image.png']
  }
};

export default function LandingPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPath={pathname} />

      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Georeference & Share Custom PNG Overlays on Satellite Maps
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Upload your PNG images or layout designs, accurately georeference them on high-resolution satellite maps, and instantly generate a shareable link. GeoMapShare makes it easy for architects, planners, GIS professionals, and enthusiasts to visualize and collaborate on custom geospatial data.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Link
                href="/"
                className="rounded-full bg-[#E55C5C] px-12 py-4 text-xl font-semibold text-white shadow-sm hover:bg-[#d45151] transition-colors"
                aria-label="Try GeoMapShare Now"
              >
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">Easy Georeferencing</h3>
              <p className="mt-2 text-gray-600">
                Simple point-and-click interface to accurately align your PNG overlays with satellite imagery. Perfect for site plans and layouts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">Instant Sharing</h3>
              <p className="mt-2 text-gray-600">
                Generate shareable links instantly. Collaborate with team members and clients without any additional software.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">High Resolution</h3>
              <p className="mt-2 text-gray-600">
                Work with high-resolution satellite imagery and maintain the quality of your PNG overlays for professional results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer */}
      <footer className="bg-white py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-4">
              GeoMapShare - The professional tool for georeferencing PNG overlays on satellite maps. 
              Perfect for architects, urban planners, GIS professionals, and mapping enthusiasts.
            </p>
            <p>
              © {new Date().getFullYear()} GeoMapShare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 