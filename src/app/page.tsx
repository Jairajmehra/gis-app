'use client';

import React, { useMemo, useState, useRef } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import Image from 'next/image';

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
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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
    disableDefaultUI: false, // Enable UI for better control
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      setSelectedFile(file); // Store the file object
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const newPoint: ControlPoint = {
      id: Date.now(),
      imageCoords: { x, y },
      mapCoords: null
    };

    setControlPoints(prev => [...prev, newPoint]);
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
        const mapUrl = `http://192.168.3.1:3003/map/${data.output_directory}`;
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

  const handleZoomIn = () => setZoom(prev => prev + 0.1);
  const handleZoomOut = () => setZoom(prev => Math.max(0.1, prev - 0.1));

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Web QGIS</h1>
      </header>
      
      <main className="flex-1 flex">
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
        
        <div className="w-[40%] p-4 flex flex-col gap-4">
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
                <div className="flex gap-2">
                  <button onClick={handleZoomIn} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                    +
                  </button>
                  <button onClick={handleZoomOut} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                    -
                  </button>
                </div>
                <button
                  onClick={handleGeoreference}
                  disabled={isGenerating}
                  className={`px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isGenerating ? 'Generating...' : 'Georeference'}
                </button>
              </>
            )}
          </div>
          
          <div className="flex-1 overflow-auto border rounded-lg relative">
            {selectedImage && (
              <div className="min-h-full w-full overflow-auto relative">
                <Image 
                  src={selectedImage}
                  alt="Uploaded PNG"
                  width={800}
                  height={600}
                  onClick={handleImageClick}
                  className="cursor-crosshair"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-in-out',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
                {controlPoints.map((point, index) => (
                  <div
                    key={point.id}
                    className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 ${
                      point.id === activePointId ? 'border-red-500 bg-red-200' : 'border-blue-500 bg-blue-200'
                    }`}
                    style={{
                      left: point.imageCoords.x * zoom,
                      top: point.imageCoords.y * zoom,
                      transform: 'translate(0, 0)',
                      pointerEvents: 'none'
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 rounded shadow text-sm">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {isSettingMapPoint && (
            <div className="text-center py-2 bg-yellow-100 rounded">
              Click on the map to set the corresponding point
            </div>
          )}
          
          {controlPoints.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-bold mb-2">Control Points</h3>
              <div className="max-h-40 overflow-auto">
                {controlPoints.map((point, index) => (
                  <div key={point.id} className="text-sm mb-2">
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
          )}
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
