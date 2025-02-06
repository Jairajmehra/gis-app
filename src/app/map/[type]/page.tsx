'use client';

import React, { useEffect, useState } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useParams, useRouter } from 'next/navigation';

export default function MapPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.type as string;
  const [isValidFolder, setIsValidFolder] = useState<boolean | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = { lat: 23.0225, lng: 72.5714 }; // Default center (Ahmedabad)

  useEffect(() => {
    const checkFolderExists = async () => {
      try {
        const response = await fetch(`https://api.redlitchee.com/check_folder_id?folder_id=${folderId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to check folder');
        }

        setIsValidFolder(data.exists);
        
        // If folder doesn't exist, show 404 message
        if (!data.exists) {
          console.error('Folder not found:', folderId);
        }
      } catch (error) {
        console.error('Error checking folder:', error);
        setIsValidFolder(false);
      }
    };

    if (folderId) {
      checkFolderExists();
    }
  }, [folderId]);

  const createCustomTileLayer = () => {
    return new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        const url = `https://api.redlitchee.com/${folderId}/tiles/${zoom}/${coord.x}/${coord.y}.png`;
        
        // Log tile requests for debugging
        console.log('Requesting tile:', url);
        
        // Add error handling for tile loading
        const img = new Image();
        img.onerror = () => {
          console.log('Tile not found:', url);
          return ''; // Return empty string for missing tiles
        };
        
        return url;
      },
      tileSize: new google.maps.Size(256, 256),
      maxZoom: 19,
      minZoom: 0,
      name: 'Custom',
      opacity: 0.75
    });
  };

  const onMapLoad = (map: google.maps.Map) => {
    console.log('Map loaded, adding tile layer for folder:', folderId);
    const customTileLayer = createCustomTileLayer();
    map.overlayMapTypes.push(customTileLayer);
  };

  // Show loading state while checking folder
  if (isValidFolder === null) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <p className="text-xl">Loading...</p>
    </div>;
  }

  // Show 404 if folder doesn't exist
  if (!isValidFolder) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Map not found</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-screen w-screen">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="w-full h-full"
        options={{
          mapTypeId: 'satellite',
          disableDefaultUI: false
        }}
        onLoad={onMapLoad}
      />
    </div>
  );
} 