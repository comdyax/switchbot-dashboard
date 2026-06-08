// Small presentation helpers shared across components.

/** Clock time like "14:32" from an ISO string. */
export function formatClock(iso) {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a chart bucket for the x-axis, adapted to the bucket interval. */
export function formatBucket(iso, interval) {
  const d = new Date(iso);
  if (interval === "minute" || interval === "hour") {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (interval === "month") {
    return d.toLocaleDateString([], { month: "short", year: "2-digit" });
  }
  // day / week
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/** UTC ISO string → value for an <input type="date">, i.e. local "YYYY-MM-DD". */
export function isoToDateInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** <input type="date"> value → UTC ISO at the START of that local day (00:00). */
export function dateInputToIsoStart(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

/** <input type="date"> value → UTC ISO at the END of that local day (23:59:59.999). */
export function dateInputToIsoEnd(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
}

/** Coarse relative time like "just now" / "3 min ago" / "2 h ago". */
export function relativeTime(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}
