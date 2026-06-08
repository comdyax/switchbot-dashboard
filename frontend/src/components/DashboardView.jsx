import Tile from "./Tile";
import SwitchbotReadingsGrid from "./SwitchbotReadingsGrid";
import SensorTimeChart from "./SensorTimeChart";
import ChartControls from "./ChartControls";

const DashboardView = () => {
  return (
    <main className="dashboard">
      <Tile area="cards">
        <SwitchbotReadingsGrid />
      </Tile>

      <Tile area="controls">
        <ChartControls />
      </Tile>

      <Tile area="temp">
        <SensorTimeChart
          title="Temperature over time"
          field="temperature_avg"
          unit="°"
        />
      </Tile>

      <Tile area="humid">
        <SensorTimeChart
          title="Humidity over time"
          field="humidity_avg"
          unit="%"
        />
      </Tile>
    </main>
  );
};

export default DashboardView;
