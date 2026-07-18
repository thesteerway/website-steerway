import { LOCALE } from "@/lib/internal";

/**
 * Rough visitor coordinates estimated from the IANA timezone (no permission
 * prompt, no external request). Good to a few hundred km, which is plenty for
 * the footer's "distance from you" flourish. Unknown zones return null and
 * the line is simply omitted.
 */
const ZONE_COORDS: Record<string, [number, number]> = {
  "Asia/Kolkata": [19.08, 72.88],
  "Asia/Calcutta": [19.08, 72.88],
  "Asia/Dubai": [25.2, 55.27],
  "Asia/Singapore": [1.35, 103.82],
  "Asia/Hong_Kong": [22.32, 114.17],
  "Asia/Shanghai": [31.23, 121.47],
  "Asia/Tokyo": [35.68, 139.69],
  "Asia/Seoul": [37.57, 126.98],
  "Asia/Bangkok": [13.76, 100.5],
  "Asia/Jakarta": [-6.21, 106.85],
  "Asia/Manila": [14.6, 120.98],
  "Asia/Karachi": [24.86, 67.0],
  "Asia/Dhaka": [23.81, 90.41],
  "Asia/Riyadh": [24.71, 46.68],
  "Asia/Tel_Aviv": [32.07, 34.78],
  "Asia/Jerusalem": [31.77, 35.21],
  "Europe/London": [51.51, -0.13],
  "Europe/Paris": [48.86, 2.35],
  "Europe/Berlin": [52.52, 13.41],
  "Europe/Madrid": [40.42, -3.7],
  "Europe/Rome": [41.9, 12.5],
  "Europe/Amsterdam": [52.37, 4.9],
  "Europe/Zurich": [47.38, 8.54],
  "Europe/Stockholm": [59.33, 18.07],
  "Europe/Warsaw": [52.23, 21.01],
  "Europe/Moscow": [55.76, 37.62],
  "Europe/Istanbul": [41.01, 28.98],
  "Europe/Dublin": [53.35, -6.26],
  "Europe/Lisbon": [38.72, -9.14],
  "Africa/Cairo": [30.04, 31.24],
  "Africa/Lagos": [6.52, 3.38],
  "Africa/Nairobi": [-1.29, 36.82],
  "Africa/Johannesburg": [-26.2, 28.05],
  "America/New_York": [40.71, -74.01],
  "America/Chicago": [41.88, -87.63],
  "America/Denver": [39.74, -104.99],
  "America/Phoenix": [33.45, -112.07],
  "America/Los_Angeles": [34.05, -118.24],
  "America/Toronto": [43.65, -79.38],
  "America/Vancouver": [49.28, -123.12],
  "America/Mexico_City": [19.43, -99.13],
  "America/Bogota": [4.71, -74.07],
  "America/Lima": [-12.05, -77.04],
  "America/Sao_Paulo": [-23.55, -46.63],
  "America/Argentina/Buenos_Aires": [-34.6, -58.38],
  "America/Santiago": [-33.45, -70.67],
  "Australia/Sydney": [-33.87, 151.21],
  "Australia/Melbourne": [-37.81, 144.96],
  "Australia/Perth": [-31.95, 115.86],
  "Pacific/Auckland": [-36.85, 174.76],
};

const toRad = (d: number) => (d * Math.PI) / 180;

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Distance from the visitor to the studio, or null when unknown/at home. */
export function distanceFromStudioKm(): number | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const at = ZONE_COORDS[zone];
    if (!at) return null;
    const km = haversineKm(at[0], at[1], LOCALE.lat, LOCALE.lon);
    return km < 80 ? 0 : Math.round(km / 10) * 10;
  } catch {
    return null;
  }
}
