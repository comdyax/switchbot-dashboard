import { relativeTime } from "../format";

/**
 * Live indicator in the header.
 * @param {{ lastUpdated: Date | null, error: Error | null }} props
 */
const StatusPill = ({ lastUpdated, error }) => {
  if (error) {
    return (
      <span className="status status--error">
        <span className="status__dot" />
        Offline
      </span>
    );
  }

  return (
    <span className="status">
      <span className="status__dot" />
      Live{lastUpdated ? ` · updated ${relativeTime(lastUpdated)}` : ""}
    </span>
  );
};

export default StatusPill;
