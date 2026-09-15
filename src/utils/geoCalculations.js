// Calculate polygon area in square meters using Shoelace formula on lat/lng coordinates converted to planar meters
export function calculatePolygonArea(latlngs) {
  if (!latlngs || latlngs.length < 3) return 0;

  const EARTH_RADIUS = 6378137; // Earth's radius in meters (WGS84)

  function toRadians(deg) {
    return (deg * Math.PI) / 180;
  }

  let area = 0;
  const numPoints = latlngs.length;

  for (let i = 0; i < numPoints; i++) {
    const p1 = latlngs[i];
    const p2 = latlngs[(i + 1) % numPoints];

    const p1Lat = Array.isArray(p1) ? p1[0] : p1.lat;
    const p1Lng = Array.isArray(p1) ? p1[1] : p1.lng;
    const p2Lat = Array.isArray(p2) ? p2[0] : p2.lat;
    const p2Lng = Array.isArray(p2) ? p2[1] : p2.lng;

    const x1 = toRadians(p1Lng) * Math.cos(toRadians((p1Lat + p2Lat) / 2));
    const y1 = toRadians(p1Lat);
    const x2 = toRadians(p2Lng) * Math.cos(toRadians((p1Lat + p2Lat) / 2));
    const y2 = toRadians(p2Lat);

    area += (x1 * y2) - (x2 * y1);
  }

  area = Math.abs(area * (EARTH_RADIUS * EARTH_RADIUS) / 2);
  return Math.round(area * 10) / 10;
}
