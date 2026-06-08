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

export const INTERVALS = {
  hour: { label: "Hour" },
  day: { label: "Day" },
  week: { label: "Week" },
};

export const DEFAULT_INTERVAL = "hour";

/**
 * Time-bucketed history for a single device over an explicit window.
 * @param {string} mac
 * @param {string} start UTC ISO timestamp (inclusive)
 * @param {string} end UTC ISO timestamp (exclusive)
 * @param {keyof typeof INTERVALS} interval
 */
export function getHistory(mac, start, end, interval) {
  const params = new URLSearchParams({ interval, start, end });
  return fetchJson(`/api/sensors/${encodeURIComponent(mac)}/history?${params}`);
}
