import { useEffect, useState } from "react";
import { getHistory } from "../api";

/**
 * Fetch history for every sensor over the given window + interval, in parallel.
 * Re-runs only when start, end, interval, or the set of devices changes.
 *
 * @param {Array<{mac: string, name: string}>} sensors
 * @param {string} start UTC ISO timestamp
 * @param {string} end UTC ISO timestamp
 * @param {string} interval one of the keys in INTERVALS
 * @returns {{ series: Array<{name: string, points: Array<object>}>,
 *   loading: boolean, error: Error | null }}
 */
export function useHistories(sensors, start, end, interval) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable dependency: refetch only when the actual devices change, not on
  // every new array identity from the polling hook.
  const macsKey = sensors.map((s) => s.mac).join(",");

  useEffect(() => {
    let active = true;
    // Show the loading state while (re)fetching for a new range/device set.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all(
      sensors.map(async (s) => ({
        name: s.name,
        points: (await getHistory(s.mac, start, end, interval)).points,
      })),
    )
      .then((result) => {
        if (!active) return;
        setSeries(result);
        setError(null);
      })
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [macsKey, start, end, interval]);

  return { series, loading, error };
}
