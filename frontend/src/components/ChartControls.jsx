import { useState } from "react";
import { INTERVALS } from "../api";
import DateRangePicker from "./DateRangePicker";
import Toggle from "./Toggle";
import { useHistory } from "../context/HistoryContext";

/**
 * Shared controls for the charts below — the start/end window and the bucket
 * interval.
 */
const ChartControls = () => {
  const { start, setStart, end, setEnd, interval, setInterval } = useHistory();

  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);

  const changed = draftStart !== start || draftEnd !== end;
  const valid = new Date(draftStart) < new Date(draftEnd);

  const apply = () => {
    setStart(draftStart);
    setEnd(draftEnd);
  };

  return (
    <section className="card chart-controls">
      <div className="chart-controls__window">
        <DateRangePicker
          start={draftStart}
          end={draftEnd}
          onStartChange={setDraftStart}
          onEndChange={setDraftEnd}
        />
        <button
          type="button"
          className="apply-btn"
          onClick={apply}
          disabled={!changed || !valid}
        >
          Apply
        </button>
      </div>
      <Toggle options={INTERVALS} value={interval} onChange={setInterval} />
    </section>
  );
};

export default ChartControls;
