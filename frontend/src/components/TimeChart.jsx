import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RANGES, INTERVALS } from "../api";
import { colorsByName } from "../rooms";
import { formatBucket } from "../format";
import Toggle from "./Toggle";
import { useSensors } from "../context/SensorsContext";
import { useHistory } from "../context/HistoryContext";

/**
 * Merge per-device history responses into chart-ready rows keyed by bucket,
 * with one column per device name holding the requested field's value.
 *
 * @param {Array<{name: string, points: Array<object>}>} series
 * @param {string} field e.g. "temperature_avg" or "humidity_avg"
 * @returns {Array<{bucket: string, [name: string]: number}>} sorted by bucket
 */
function mergeSeries(series, field) {
  const rows = new Map(); // bucket -> row object
  for (const { name, points } of series) {
    for (const point of points) {
      let row = rows.get(point.bucket);
      if (!row) {
        row = { bucket: point.bucket };
        rows.set(point.bucket, row);
      }
      row[name] = point[field];
    }
  }
  return [...rows.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
}

const CHART_TYPES = {
  line: { label: "Line" },
  bar: { label: "Bar" },
};

/**
 * A reusable multi-series chart (line or bar) wired to the shared history store.
 *
 * @param {{
 *   title: string,
 *   field: string,    // e.g. "temperature_avg" | "humidity_avg"
 *   unit: string,     // e.g. "°" | "%"
 * }} props
 */
const TimeChart = ({ title, field, unit }) => {
  const { sensors } = useSensors();
  const { range, setRange, interval, setInterval, series, loading, error } =
    useHistory();

  const [isolated, setIsolated] = useState(null);
  const [chartType, setChartType] = useState("line");

  const colors = colorsByName(sensors);
  const data = mergeSeries(series, field);
  const names = sensors.map((s) => s.name);

  // Recharts uses a different container per chart type; the axes/grid/tooltip
  // children are identical, so we only swap the container + series component.
  const ChartComp = chartType === "bar" ? BarChart : LineChart;

  // Markers only when the series is sparse enough to read; on dense data they'd
  // turn the line into a blob.
  const showDots = data.length <= 60;

  const toggleIsolate = (name) =>
    setIsolated((current) => (current === name ? null : name));

  return (
    <section className="card chart-card">
      <div className="chart-card__head">
        <h3>{title}</h3>
        <div className="chart-card__controls">
          <Toggle options={RANGES} value={range} onChange={setRange} />
          <Toggle options={INTERVALS} value={interval} onChange={setInterval} />
          <Toggle
            options={CHART_TYPES}
            value={chartType}
            onChange={setChartType}
          />
        </div>
      </div>

      {!error && data.length > 0 && (
        <ul className="chart-legend">
          {names.map((name) => {
            const dimmed = isolated !== null && isolated !== name;
            return (
              <li key={name}>
                <button
                  type="button"
                  className={dimmed ? "is-dimmed" : ""}
                  onClick={() => toggleIsolate(name)}
                >
                  <span className="dot" style={{ background: colors[name] }} />
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="chart-card__body">
        {error ? (
          <p className="muted">Couldn’t load history.</p>
        ) : loading && data.length === 0 ? (
          <p className="muted">Loading…</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ChartComp
              data={data}
              margin={{ top: 8, right: 12, bottom: 0, left: -8 }}
            >
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="bucket"
                tickFormatter={(v) => formatBucket(v, interval)}
                stroke="var(--text-faint)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                minTickGap={24}
              />
              <YAxis
                stroke="var(--text-faint)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={40}
                tickFormatter={(v) => `${v}${unit}`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--text-dim)" }}
                labelFormatter={(v) => formatBucket(v, interval)}
                formatter={(value, name) => [
                  `${value?.toFixed(1)}${unit}`,
                  name,
                ]}
              />
              {names.map((name) =>
                chartType === "bar" ? (
                  <Bar
                    key={name}
                    dataKey={name}
                    fill={colors[name]}
                    isAnimationActive={false}
                    hide={isolated !== null && isolated !== name}
                  />
                ) : (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={colors[name]}
                    strokeWidth={2}
                    dot={showDots ? { r: 2 } : false}
                    activeDot={{ r: 4 }}
                    connectNulls
                    isAnimationActive={false}
                    hide={isolated !== null && isolated !== name}
                  />
                ),
              )}
            </ChartComp>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default TimeChart;
