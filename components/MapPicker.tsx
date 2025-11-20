"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Importar el mapa completo dinámicamente
const MapComponent = dynamic<MapPickerProps>(
  () => import('./MapPickerClient').then((mod) => mod.default), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-dark-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Cargando mapa...</p>
      </div>
    )
  }
);

export default function MapPicker({ onLocationSelect, initialLat = -36.7270, initialLng = -73.1127 }: MapPickerProps) {
  return (
    <MapComponent 
      onLocationSelect={onLocationSelect}
      initialLat={initialLat}
      initialLng={initialLng}
    />
  );
}
