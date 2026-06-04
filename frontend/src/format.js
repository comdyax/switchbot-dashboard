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
