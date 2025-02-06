import React from 'react';
import { MapContainer, ImageOverlay, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [1000, 1000]
  ];

  // Create custom icon for control points
  const createPointIcon = (index: number, isActive: boolean) => {
    return L.divIcon({
      className: 'custom-point-icon',
      html: `
        <div class="w-4 h-4 rounded-full border-2 ${isActive ? 'border-red-500 bg-red-200' : 'border-blue-500 bg-blue-200'}">
          <span class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 rounded shadow text-sm">
            ${index + 1}
          </span>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
        crs={L.CRS.Simple}
        zoom={0}
        center={[500, 500]}
        maxZoom={10}
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