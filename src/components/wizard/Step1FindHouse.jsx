import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Trash2, ArrowRight, MousePointerClick, CheckCircle, Navigation, Search } from 'lucide-react';
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
  const [isGisLoading, setIsGisLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const presetLocations = [
    { name: 'Jaipur, RJ', coords: [26.9124, 75.7873] },
    { name: 'New Delhi, DL', coords: [28.6139, 77.2090] },
    { name: 'Bengaluru, KA', coords: [12.9716, 77.5946] },
    { name: 'Mumbai, MH', coords: [19.0760, 72.8777] }
  ];

  // Fetch GIS dynamic rainfall & soil data from Port 5003 service
  const fetchGisData = async (lat, lng) => {
    setIsGisLoading(true);
    try {
      const response = await fetch('http://localhost:5003/api/gis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      const data = await response.json();
      if (data.status === 'success') {
        updateWizardData({
          annualRainfall: data.environmentalData.annualRainfallMm,
          soilType: data.environmentalData.soilType || 'Loamy Soil',
          latitude: lat,
          longitude: lng
        });
      }
    } catch (err) {
      console.error('GIS Backend fetch error:', err);
    } finally {
      setIsGisLoading(false);
    }
  };

  const updateMapAndPolygon = (coords, labelName) => {
    setMapCenter(coords);
    const [lat, lng] = coords;
    const offset = 0.0003;
    const newPoly = [
      [lat, lng],
      [lat + offset, lng + offset],
      [lat + offset * 0.4, lng + offset * 1.4],
      [lat - offset * 0.6, lng + offset * 0.4]
    ];
    setPolygonPoints(newPoly);
    updateWizardData({ address: labelName, mapCenter: coords });
    fetchGisData(lat, lng);
  };

  // 1. Manual Address Search (Nominatim Geocoding)
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        updateMapAndPolygon([lat, lon], data[0].display_name);
      } else {
        alert('Location not found. Please enter another location.');
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Browser GPS Geolocation
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSearchQuery(`GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        updateMapAndPolygon([lat, lng], 'Current GPS Location');
      },
      (error) => {
        alert('Unable to retrieve GPS location. Check browser permissions.');
      }
    );
  };

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
    setSearchQuery(loc.name);
    updateMapAndPolygon(loc.coords, loc.name);
  };

  const handleConfirmNext = async () => {
    const finalArea = computedArea > 0 ? computedArea : 145;
    const [lat, lng] = mapCenter;
    await fetchGisData(lat, lng);
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
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              <span>Step 1: Locate House & Trace Roof Polygon</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Search manually, use live GPS, or select preset cities to center the map.
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

        {/* Input Bar: Manual Search + GPS Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800/80">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search location manually (e.g. Malviya Nagar, Jaipur)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 font-semibold text-xs rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          <button
            onClick={handleUseGPS}
            className="w-full sm:w-auto px-4 py-2 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>Use My Location (GPS)</span>
          </button>
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
            disabled={isGisLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-sky-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isGisLoading ? 'Fetching GIS Data...' : 'Confirm Roof Area & Proceed'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}