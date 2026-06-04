import "./App.css";
import { SensorsProvider, useSensors } from "./context/SensorsContext";
import { HistoryProvider } from "./context/HistoryContext";
import StatusPill from "./components/StatusPill";
import DashboardView from "./components/DashboardView";

const App = () => {
  return (
    <SensorsProvider>
      <Dashboard />
    </SensorsProvider>
  );
};

const Dashboard = () => {
  const { loading, error, lastUpdated } = useSensors();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Climate monitor</h1>
        <StatusPill lastUpdated={lastUpdated} error={error} />
      </header>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <HistoryProvider>
          <DashboardView />
        </HistoryProvider>
      )}
    </div>
  );
};

export default App;
