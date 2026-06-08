import { colorsByName } from "../rooms";
import { useSensors } from "../context/SensorsContext";
import { useHistory } from "../context/HistoryContext";
import TimeChart from "./TimeChart";

/**
 * Container that wires the sensor + history stores to the presentational
 * <TimeChart>.
 *
 * @param {{ title: string, field: string, unit: string }} props
 */
const SensorTimeChart = ({ title, field, unit }) => {
  const { sensors } = useSensors();
  const { interval, series, loading, error } = useHistory();

  return (
    <TimeChart
      title={title}
      field={field}
      unit={unit}
      series={series}
      names={sensors.map((s) => s.name)}
      colors={colorsByName(sensors)}
      interval={interval}
      loading={loading}
      error={error}
    />
  );
};

export default SensorTimeChart;
