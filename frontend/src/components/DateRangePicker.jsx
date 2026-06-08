import {
  isoToDateInput,
  dateInputToIsoStart,
  dateInputToIsoEnd,
} from "../format";

/**
 * Two native date inputs for picking the chart's start/end window. State lives
 * in HistoryContext as UTC ISO strings; the inputs show local calendar dates,
 * so we convert on read/write — a picked start date snaps to local 00:00 and an
 * end date to local 23:59:59.999, giving whole-day windows. Each input caps the
 * other's range so the user can't pick start after end.
 *
 * @param {{
 *   start: string, end: string,            // UTC ISO
 *   onStartChange: (iso: string) => void,
 *   onEndChange: (iso: string) => void,
 * }} props
 */
const DateRangePicker = ({ start, end, onStartChange, onEndChange }) => {
  return (
    <div className="range-picker">
      <label className="range-picker__field">
        <span>From</span>
        <input
          type="date"
          value={isoToDateInput(start)}
          max={isoToDateInput(end)}
          onChange={(e) =>
            e.target.value && onStartChange(dateInputToIsoStart(e.target.value))
          }
        />
      </label>
      <label className="range-picker__field">
        <span>To</span>
        <input
          type="date"
          value={isoToDateInput(end)}
          min={isoToDateInput(start)}
          onChange={(e) =>
            e.target.value && onEndChange(dateInputToIsoEnd(e.target.value))
          }
        />
      </label>
    </div>
  );
};

export default DateRangePicker;
