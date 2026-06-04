import { formatClock } from "../format";

/**
 * A single device's current reading.
 * @param {{ sensor: object, color: string }} props
 */
const ReadingCard = ({ sensor, color }) => {
  const { name, latest } = sensor;

  return (
    <article className="card reading-card">
      <header className="reading-card__head">
        <span className="dot" style={{ background: color }} />
        <span className="reading-card__name">{name}</span>
      </header>

      {latest ? (
        <>
          <div className="reading-card__temp">
            {latest.temperature.toFixed(1)}
            <span className="deg">°</span>
          </div>
          <div className="reading-card__humidity">
            {Math.round(latest.humidity)}% humidity
          </div>
          <footer className="reading-card__foot">
            <span>{Math.round(latest.battery)}%</span>
            <span>{formatClock(latest.timestamp)}</span>
          </footer>
        </>
      ) : (
        <div className="reading-card__empty">No data yet</div>
      )}
    </article>
  );
};

export default ReadingCard;
