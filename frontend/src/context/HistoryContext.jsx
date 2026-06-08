/* eslint-disable react-refresh/only-export-components --
   Provider component + its consumer hook live together as one cohesive store
   module, matching SensorsContext. The only cost is that editing THIS file
   triggers a full reload instead of state-preserving HMR — fine for a store. */
import { createContext, useContext, useState } from "react";
import { DEFAULT_INTERVAL } from "../api";
import { useSensors } from "./SensorsContext";
import { useHistories } from "../hooks/useHistories";

const HistoryContext = createContext(null);

/** Initial window: today, from local midnight to 23:59:59.999, as UTC ISO. */
function defaultWindow() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const start = new Date(y, m, d, 0, 0, 0, 0);
  const end = new Date(y, m, d, 23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Provides the time-series params + data to the charts beneath it.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function HistoryProvider({ children }) {
  const { sensors } = useSensors();
  const initial = defaultWindow();
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);

  const { series, loading, error } = useHistories(sensors, start, end, interval);

  const value = {
    start,
    setStart,
    end,
    setEnd,
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
 *   start: string, setStart: (iso: string) => void,
 *   end: string, setEnd: (iso: string) => void,
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
