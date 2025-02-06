'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, ImageOverlay, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ClickableImageOverlayProps {
  imageUrl: string;
  bounds: L.LatLngBoundsExpression;
  onImageClick: (e: L.LeafletMouseEvent) => void;
}

const ClickableImageOverlay: React.FC<ClickableImageOverlayProps> = ({ imageUrl, bounds, onImageClick }) => {
  useEffect(() => {
    console.log('🖼️ Image Overlay mounted:', {
      imageUrl,
      bounds
    });
  }, [imageUrl, bounds]);

  useMapEvents({
    click: onImageClick
  });
  
  return <ImageOverlay url={imageUrl} bounds={bounds} />;
};

interface ImageViewerProps {
  imageUrl: string;
  onImageClick: (e: L.LeafletMouseEvent) => void;
  controlPoints: Array<{
    id: number;
    imageCoords: { x: number; y: number };
  }>;
  activePointId: number | null;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onImageClick, controlPoints, activePointId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Custom hook to handle image dimensions and map fitting
  const useImageDimensions = (imageUrl: string, mapRef: React.MutableRefObject<L.Map | null>) => {
    useEffect(() => {
      console.log('🔍 Starting to load image:', imageUrl);
      
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image loaded successfully:', {
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2)
        });

        if (!mapRef.current) {
          console.warn('⚠️ Map reference not available');
          return;
        }
        
        // Calculate bounds based on image dimensions
        const bounds = [
          [0, 0],
          [img.height, img.width]
        ] as L.LatLngBoundsExpression;

        console.log('📏 Setting map bounds:', {
          bounds,
          currentCenter: mapRef.current.getCenter(),
          currentZoom: mapRef.current.getZoom()
        });
        
        // Set bounds and center the image
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 0,
          animate: false
        });

        // Log final map state
        console.log('🎯 Final map state:', {
          center: mapRef.current.getCenter(),
          zoom: mapRef.current.getZoom(),
          bounds: mapRef.current.getBounds()
        });
      };

      img.onerror = (error) => {
        console.error('❌ Error loading image:', error);
      };

      img.src = imageUrl;
    }, [imageUrl, mapRef]);
  };

  useImageDimensions(imageUrl, mapRef);

  const createPointIcon = (index: number, isActive: boolean): L.DivIcon => {
    return L.divIcon({
      className: 'custom-point-icon',
      html: `<div class="w-4 h-4 rounded-full border-2 ${
        isActive ? 'border-red-500 bg-red-200' : 'border-blue-500 bg-blue-200'
      }"><span class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 rounded shadow text-sm">${
        index + 1
      }</span></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  if (!isMounted) {
    return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;
  }

  const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];

  return (
    <div className="w-full h-full">
      <MapContainer
        ref={mapRef}
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
        crs={L.CRS.Simple}
        minZoom={-2}
        maxZoom={2}
        doubleClickZoom={false}
      >
        <ClickableImageOverlay
          imageUrl={imageUrl}
          bounds={bounds}
          onImageClick={onImageClick}
        />
        {controlPoints.map((point, index) => (
          <Marker
            key={point.id}
            position={[point.imageCoords.y, point.imageCoords.x]}
            icon={createPointIcon(index, point.id === activePointId)}
            zIndexOffset={point.id === activePointId ? 1000 : 0}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default ImageViewer; 