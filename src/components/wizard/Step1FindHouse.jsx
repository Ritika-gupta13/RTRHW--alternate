import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Trash2, ArrowRight, MousePointerClick, CheckCircle } from 'lucide-react';
import { calculatePolygonArea } from '../../utils/geoCalculations';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ points, setPoints }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPoints((prev) => [...prev, [lat, lng]]);
    },
  });
  return null;
}

function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 19, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function Step1FindHouse({ wizardData, updateWizardData, onNext }) {
  const [mapCenter, setMapCenter] = useState(wizardData.mapCenter || [26.9124, 75.7873]);
  const [polygonPoints, setPolygonPoints] = useState(wizardData.polygonPoints || [
    [26.9125, 75.7871],
    [26.9128, 75.7875],
    [26.9126, 75.7878],
    [26.9123, 75.7874]
  ]);
  const [tileMode, setTileMode] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState(wizardData.address || 'Jaipur, Rajasthan');
  const [computedArea, setComputedArea] = useState(wizardData.roofArea || 145);

  const presetLocations = [
    { name: 'Jaipur, RJ', coords: [26.9124, 75.7873] },
    { name: 'New Delhi, DL', coords: [28.6139, 77.2090] },
    { name: 'Bengaluru, KA', coords: [12.9716, 77.5946] },
    { name: 'Mumbai, MH', coords: [19.0760, 72.8777] }
  ];

  useEffect(() => {
    if (polygonPoints.length >= 3) {
      const area = calculatePolygonArea(polygonPoints);
      setComputedArea(area > 0 ? area : 145);
      updateWizardData({ polygonPoints, roofArea: area > 0 ? area : 145, mapCenter });
    }
  }, [polygonPoints]);

  const handleClearPolygon = () => {
    setPolygonPoints([]);
    setComputedArea(0);
  };

  const handleSelectPreset = (loc) => {
    setMapCenter(loc.coords);
    setSearchQuery(loc.name);
    const [lat, lng] = loc.coords;
    const offset = 0.0003;
    const newPoly = [
      [lat, lng],
      [lat + offset, lng + offset],
      [lat + offset * 0.4, lng + offset * 1.4],
      [lat - offset * 0.6, lng + offset * 0.4]
    ];
    setPolygonPoints(newPoly);
    updateWizardData({ address: loc.name, mapCenter: loc.coords });
  };

  const handleConfirmNext = () => {
    const finalArea = computedArea > 0 ? computedArea : 145;
    updateWizardData({
      roofArea: finalArea,
      polygonPoints,
      address: searchQuery,
      mapCenter
    });
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <span>Step 1: Locate House & Trace Roof Polygon</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click anywhere on the satellite map canvas to add vertex points and outline your rooftop catchment surface.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {presetLocations.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleSelectPreset(loc)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-sky-300 border border-slate-700 transition-colors cursor-pointer"
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl h-[480px] bg-slate-950">
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg">
            <button
              onClick={() => setTileMode('satellite')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                tileMode === 'satellite' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setTileMode('street')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                tileMode === 'street' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Map
            </button>
          </div>

          <MapContainer
            center={mapCenter}
            zoom={19}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <MapFlyTo center={mapCenter} />
            <MapClickHandler points={polygonPoints} setPoints={setPolygonPoints} />

            {tileMode === 'satellite' ? (
              <TileLayer
                attribution="Esri World Imagery"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              <TileLayer
                attribution="OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            )}

            {polygonPoints.length > 0 && (
              <Polygon
                positions={polygonPoints}
                pathOptions={{
                  color: '#0EA5E9',
                  fillColor: '#10B981',
                  fillOpacity: 0.45,
                  weight: 3,
                  dashArray: '4, 4'
                }}
              />
            )}

            {polygonPoints.map((pt, idx) => (
              <Marker key={idx} position={pt} />
            ))}
          </MapContainer>

          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2 shadow-lg">
            <MousePointerClick className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Click on map corners to trace roof polygon ({polygonPoints.length} points)</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6 text-left">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                Geo-Spatial Computation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                Live WGS84
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center relative overflow-hidden mb-5">
              <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mb-1">
                Calculated Roof Surface Area
              </div>
              <div className="text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline justify-center gap-1.5">
                <span className="text-sky-400">{computedArea}</span>
                <span className="text-xl font-sans text-slate-400 font-normal">m²</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>≈ {Math.round(computedArea * 10.7639)} sq ft roof catchment</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleClearPolygon}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Roof Polygon</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleConfirmNext}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-sky-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm Roof Area & Proceed</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
