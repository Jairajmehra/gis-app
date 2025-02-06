'use client';

import React, { useMemo, useState, useRef } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import DynamicImageViewer from './components/DynamicImageViewer';
import type { LeafletMouseEvent } from 'leaflet';

interface ControlPoint {
  id: number;
  imageCoords: { x: number; y: number };
  mapCoords: { lat: number; lng: number } | null;
}

interface ModalMessage {
  type: 'text' | 'jsx';
  content: string | React.ReactNode;
}

interface Modal {
  show: boolean;
  message: ModalMessage;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<Modal>({ 
    show: false, 
    message: { type: 'text', content: '' } 
  });
  
  // Georeferencing state
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [isSettingMapPoint, setIsSettingMapPoint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = useMemo(() => ({ lat: 23.0225, lng: 72.5714 }), []); // Coordinates for Ahmedabad

  const mapOptions = {
    mapTypeId: 'satellite',
    disableDefaultUI: false,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setControlPoints([]);
        setActivePointId(null);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG file');
    }
  };

  const handleImageClick = (e: LeafletMouseEvent) => {
    if (isSettingMapPoint) return;
    
    const { lat, lng } = e.latlng;
    const newPoint = {
      id: Date.now(),
      imageCoords: { x: lng, y: lat },
      mapCoords: null
    };
    
    setControlPoints([...controlPoints, newPoint]);
    setActivePointId(newPoint.id);
    setIsSettingMapPoint(true);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isSettingMapPoint || activePointId === null || !e.latLng) return;

    const updatedPoints = controlPoints.map(point => 
      point.id === activePointId
        ? { ...point, mapCoords: { lat: e.latLng!.lat(), lng: e.latLng!.lng() }}
        : point
    );

    setControlPoints(updatedPoints);
    
    // Log the complete data structure after each point is mapped
    console.log('Current Control Points:', {
      totalPoints: updatedPoints.length,
      points: updatedPoints.map(point => ({
        pointId: point.id,
        pixelCoordinates: {
          x: point.imageCoords.x,
          y: point.imageCoords.y,
          unit: 'pixels'
        },
        geographicCoordinates: point.mapCoords ? {
          latitude: point.mapCoords.lat,
          longitude: point.mapCoords.lng,
          unit: 'degrees'
        } : 'not set'
      })),
      timestamp: new Date().toISOString()
    });

    setIsSettingMapPoint(false);
    setActivePointId(null);
  };

  const handleGeoreference = async () => {
    if (!selectedFile || controlPoints.length === 0) {
      setModal({
        show: true,
        message: {
          type: 'text',
          content: 'Please select an image and add at least one control point.'
        }
      });
      return;
    }

    // Filter out points that don't have map coordinates
    const completePoints = controlPoints.filter(point => point.mapCoords !== null);
    if (completePoints.length === 0) {
      setModal({
        show: true,
        message: {
          type: 'text',
          content: 'Please add at least one complete control point with map coordinates.'
        }
      });
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const pointsData = {
        points: completePoints.map(point => ({
          image: { x: point.imageCoords.x, y: point.imageCoords.y },
          map: { lat: point.mapCoords!.lat, lng: point.mapCoords!.lng }
        })),
        timestamp: new Date().toISOString()
      };
      
      formData.append('points', JSON.stringify(pointsData));

      const response = await fetch('http://35.207.193.193:80/generate_xyz_tiles', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate tiles');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.output_directory) {
        const mapUrl = `https://gis-app-git-main-jairaj-mehras-projects.vercel.app/map/${data.output_directory}`;
        setModal({
          show: true,
          message: {
            type: 'jsx',
            content: (
              <div className="text-center">
                <p className="mb-4">Tiles generated successfully!</p>
                <p className="mb-2">Your map is available at:</p>
                <a 
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 break-all"
                >
                  {mapUrl}
                </a>
              </div>
            )
          }
        });
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Error details:', error);
      setModal({
        show: true,
        message: {
          type: 'text',
          content: error instanceof Error ? error.message : 'Error generating XYZ tiles. Please try again.'
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPoints = () => {
    const completePoints = controlPoints.filter(point => point.mapCoords !== null);
    const data = {
      points: completePoints.map(point => ({
        image: point.imageCoords,
        map: point.mapCoords,
      })),
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'control-points.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Web QGIS</h1>
      </header>
      
      <main className="flex-1 flex">
        {/* Left side - Google Map */}
        <div className="w-[60%] h-[calc(100vh-4rem)]">
          <GoogleMap
            zoom={10}
            center={center}
            mapContainerClassName="w-full h-full"
            options={mapOptions}
            onClick={handleMapClick}
          >
            {controlPoints.map(point => point.mapCoords && (
              <Marker
                key={point.id}
                position={point.mapCoords}
                label={String(controlPoints.indexOf(point) + 1)}
              />
            ))}
          </GoogleMap>
        </div>
        
        {/* Right side - Image and Controls */}
        <div className="w-[40%] flex flex-col h-[calc(100vh-4rem)]">
          {/* Top Controls */}
          <div className="p-4 bg-white border-b">
            <div className="flex gap-2 flex-wrap">
              <input
                type="file"
                accept=".png"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Upload PNG
              </button>
              {selectedImage && (
                <>
                  <button
                    onClick={handleGeoreference}
                    disabled={isGenerating}
                    className={`px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
                      isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isGenerating ? 'Generating...' : 'Georeference'}
                  </button>
                  {controlPoints.length > 0 && (
                    <button
                      onClick={handleExportPoints}
                      className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                      Export Points
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Image Viewer and Points Info */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedImage ? (
              <div className="flex-1 relative">
                <DynamicImageViewer
                  imageUrl={selectedImage}
                  onImageClick={handleImageClick}
                  controlPoints={controlPoints}
                  activePointId={activePointId}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Upload a PNG to start georeferencing
              </div>
            )}

            {/* Status Message */}
            {isSettingMapPoint && (
              <div className="absolute bottom-4 left-4 right-4 text-center py-2 bg-yellow-100 rounded shadow-lg">
                Click on the map to set the corresponding point
              </div>
            )}

            {/* Control Points Panel */}
            {controlPoints.length > 0 && (
              <div className="h-48 border-t bg-white overflow-auto">
                <div className="p-4">
                  <h3 className="font-bold mb-2">Control Points</h3>
                  <div className="space-y-2">
                    {controlPoints.map((point, index) => (
                      <div key={point.id} className="text-sm">
                        <strong>Point {index + 1}:</strong>
                        <br />
                        Image: ({point.imageCoords.x.toFixed(2)}, {point.imageCoords.y.toFixed(2)})
                        <br />
                        Map: {point.mapCoords 
                          ? `(${point.mapCoords.lat.toFixed(6)}, ${point.mapCoords.lng.toFixed(6)})`
                          : 'Not set'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            {modal.message.type === 'text' ? (
              <p className="text-gray-800 mb-4">{modal.message.content as string}</p>
            ) : (
              <div className="text-gray-800 mb-4">{modal.message.content}</div>
            )}
            <button
              onClick={() => setModal({ show: false, message: { type: 'text', content: '' } })}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
