/**
 * A segmented single-select control: one button per option, with the active
 * one highlighted. Generic — used for both the range and interval selectors.
 *
 * @param {{
 *   options: Record<string, { label: string }>,
 *   value: string,
 *   onChange: (key: string) => void,
 * }} props
 */
const Toggle = ({ options, value, onChange }) => {
  return (
    <div className="toggle">
      {Object.entries(options).map(([key, { label }]) => (
        <button
          key={key}
          type="button"
          className={key === value ? "is-active" : ""}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
