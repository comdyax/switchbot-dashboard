/* eslint-disable react-refresh/only-export-components --
   Provider component + its consumer hook intentionally live together as one
   cohesive store module. The only cost is that editing THIS file triggers a
   full reload instead of state-preserving HMR, which is fine for a data store. */
import { createContext, useContext, useEffect, useState } from "react";
import { getSensors } from "../api";

const POLL_MS = 30_000;

const SensorsContext = createContext(null);

/**
 * Provides the sensor list and live status to everything rendered beneath it.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function SensorsProvider({ children }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true; // guard against setting state after unmount

    async function load() {
      try {
        const data = await getSensors();
        if (!active) return;
        setSensors(data);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const value = { sensors, loading, error, lastUpdated };
  return (
    <SensorsContext.Provider value={value}>{children}</SensorsContext.Provider>
  );
}

/**
 * Read the shared sensor store. Throws if used outside <SensorsProvider> so the
 * mistake surfaces immediately instead of as a confusing `null`.
 *
 * @returns {{
 *   sensors: Array<object>,
 *   loading: boolean,
 *   error: Error | null,
 *   lastUpdated: Date | null,
 * }}
 */
export function useSensors() {
  const ctx = useContext(SensorsContext);
  if (ctx === null) {
    throw new Error("useSensors must be used within a SensorsProvider");
  }
  return ctx;
}
