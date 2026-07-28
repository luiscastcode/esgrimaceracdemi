 // src/components/MapaClub.jsx
import React, { useEffect, useRef } from 'react';

const MapaClub = ({
  lat,
  lng,
  nombre,
  direccion = '',
  zoom = 15,
  height = 'h-64 md:h-72',
  markerColor = '#1a1a2e'
}) => {
  const mapRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;
    if (!mapRef.current) return;
    if (initializedRef.current) return;

    // Verificar coordenadas
    if (isNaN(lat) || isNaN(lng) || !lat || !lng) {
      mapRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-sm">
          <span>Ubicación no disponible</span>
        </div>
      `;
      return;
    }

    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      try {
        // Cargar CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Cargar JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        const L = window.L;
        
        if (!L) {
          throw new Error('Leaflet no disponible');
        }

        // Crear mapa
        const map = L.map(mapRef.current).setView([lat, lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Ícono personalizado
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${markerColor}"/>
              <circle cx="16" cy="16" r="7" fill="white" opacity="0.9"/>
            </svg>
          `,
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -42],
          className: 'custom-marker-container'
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        let popupContent = `<strong>${nombre}</strong>`;
        if (direccion) {
          popupContent += `<div class="direccion">${direccion}</div>`;
        }
        popupContent += `<div style="margin-top:6px;font-size:12px;color:#4b5563;">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
             target="_blank" 
             rel="noopener noreferrer"
             style="color:#1a1a2e;font-weight:500;text-decoration:underline;">
            Cómo llegar →
          </a>
        </div>`;

        marker.bindPopup(popupContent);

        setTimeout(() => map.invalidateSize(), 200);
        initializedRef.current = true;

      } catch (error) {
        console.error('Error cargando mapa:', error);
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-sm">
              <span>Error al cargar el mapa</span>
            </div>
          `;
        }
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      initializedRef.current = false;
    };
  }, [lat, lng, nombre, direccion, zoom, markerColor]);

  return (
    <div className={`mapa-club relative rounded-xl overflow-hidden border border-gray-200 shadow-sm ${height}`}>
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-100"
      >
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Cargando mapa...
        </div>
      </div>
    </div>
  );
};

export default MapaClub;