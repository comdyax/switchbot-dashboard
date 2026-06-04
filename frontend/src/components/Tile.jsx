/**
 * A single dashboard grid cell.
 *
 * @param {{ area: string, children: React.ReactNode }} props
 */
const Tile = ({ area, children }) => {
  return (
    <div className="tile" style={{ gridArea: area }}>
      {children}
    </div>
  );
};

export default Tile;
