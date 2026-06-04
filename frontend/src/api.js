async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${path}`);
  }
  return res.json();
}

/**
 * Every device with its most recent reading.
 * @returns {Promise<Array<{mac: string, name: string, latest: {
 *   temperature: number, humidity: number, battery: number, timestamp: string
 * } | null}>>}
 */
export function getSensors() {
  return fetchJson("/api/sensors");
}

export const RANGES = {
  "24h": { label: "24h", hours: 24 },
  "7d": { label: "7d", hours: 24 * 7 },
  "30d": { label: "30d", hours: 24 * 30 },
};

export const DEFAULT_RANGE = "24h";

export const INTERVALS = {
  hour: { label: "Hour" },
  day: { label: "Day" },
  week: { label: "Week" },
};

export const DEFAULT_INTERVAL = "hour";

/**
 * Time-bucketed history for a single device.
 * @param {string} mac
 * @param {keyof typeof RANGES} range
 * @param {keyof typeof INTERVALS} interval
 */
export function getHistory(mac, range, interval) {
  const { hours } = RANGES[range] ?? RANGES[DEFAULT_RANGE];
  const end = new Date();
  const start = new Date(end.getTime() - hours * 3600 * 1000);
  const params = new URLSearchParams({
    interval,
    start: start.toISOString(),
    end: end.toISOString(),
  });
  return fetchJson(`/api/sensors/${encodeURIComponent(mac)}/history?${params}`);
}
