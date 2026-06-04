import Tile from "./Tile";
import SwitchbotReadingsGrid from "./SwitchbotReadingsGrid";
import TimeChart from "./TimeChart";

const DashboardView = () => {
  return (
    <main className="dashboard">
      <Tile area="cards">
        <SwitchbotReadingsGrid />
      </Tile>

      <Tile area="temp">
        <TimeChart
          title="Temperature over time"
          field="temperature_avg"
          unit="°"
        />
      </Tile>

      <Tile area="humid">
        <TimeChart title="Humidity over time" field="humidity_avg" unit="%" />
      </Tile>
    </main>
  );
};

export default DashboardView;
