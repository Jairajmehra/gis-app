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

  useEffect(() => {
    if (!isMounted) return;
    
    const img = new Image();
    img.onload = () => {
      if (mapRef.current) {
        const bounds: L.LatLngBoundsExpression = [
          [0, 0],
          [img.height, img.width]
        ];
        mapRef.current.fitBounds(bounds);
      }
    };
    img.src = imageUrl;
  }, [imageUrl, isMounted]);

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