export default function Styles() {
  const colorBlack = { color: "black" };
  const padding10px = { padding: "10px" };
  const bgBlue = { backgroundColor: "lightblue" };
  const bgRed = { backgroundColor: "lightcoral" };
  return (
    <div id="wd-styles">
      <h4>Styles</h4>
      <div style={{ backgroundColor: "lightyellow", ...colorBlack, ...padding10px }}>
        Yellow background
      </div>
      <div style={{ ...bgBlue, ...colorBlack, ...padding10px }}>
        Blue background
      </div>
      <div style={{ ...bgRed, ...colorBlack, ...padding10px }}>
        Red background
      </div>
      <hr />
    </div>
  );
}
