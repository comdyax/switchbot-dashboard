import ReadingCard from "./ReadingCard";
import { colorsByName } from "../rooms";
import { useSensors } from "../context/SensorsContext";

const SwitchbotReadingsGrid = () => {
  const { sensors } = useSensors();
  const colors = colorsByName(sensors);

  return (
    <section className="section">
      <h2 className="section__title">Current readings</h2>
      <div className="readings-grid">
        {sensors.map((sensor) => (
          <ReadingCard
            key={sensor.mac}
            sensor={sensor}
            color={colors[sensor.name]}
          />
        ))}
      </div>
    </section>
  );
};

export default SwitchbotReadingsGrid;
