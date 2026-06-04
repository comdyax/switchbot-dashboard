/* eslint-disable react-refresh/only-export-components --
   Provider component + its consumer hook live together as one cohesive store
   module, matching SensorsContext. The only cost is that editing THIS file
   triggers a full reload instead of state-preserving HMR — fine for a store. */
import { createContext, useContext, useState } from "react";
import { DEFAULT_RANGE, DEFAULT_INTERVAL } from "../api";
import { useSensors } from "./SensorsContext";
import { useHistories } from "../hooks/useHistories";

const HistoryContext = createContext(null);

/**
 * Provides the time-series params + data to the charts beneath it.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function HistoryProvider({ children }) {
  const { sensors } = useSensors();
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);

  const { series, loading, error } = useHistories(sensors, range, interval);

  const value = {
    range,
    setRange,
    interval,
    setInterval,
    series,
    loading,
    error,
  };
  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

/**
 * Read the shared time-series store. Throws if used outside <HistoryProvider>.
 *
 * @returns {{
 *   range: string, setRange: (key: string) => void,
 *   interval: string, setInterval: (key: string) => void,
 *   series: Array<{name: string, points: Array<object>}>,
 *   loading: boolean, error: Error | null,
 * }}
 */
export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (ctx === null) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return ctx;
}
