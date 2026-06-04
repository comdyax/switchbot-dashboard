// Stable color per room, shared between the reading cards and the chart lines.
// Falls back by assignment order for any device beyond the four palette slots.
// Keep these in sync with the --room-* CSS variables in index.css. Hex (not
// var()) so they also work as SVG stroke attributes in the Recharts lines.
const PALETTE = ["#5b9dff", "#a98bff", "#ff7a59", "#3ddc84"];

/**
 * Build a name -> color map from the sensor list.
 *
 * @param {Array<{name: string}>} sensors
 * @returns {Record<string, string>}
 */
export function colorsByName(sensors) {
  const map = {};
  // Copy before sorting — sensors comes from shared state and sort() mutates.
  [...sensors]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((s, i) => {
      map[s.name] = PALETTE[i % PALETTE.length];
    });
  return map;
}
