const multiply = (a: number, b: number) => a * b;
export default function ImpliedReturn() {
  return (
    <div id="wd-implied-return">
      <h4>Implied Return</h4>
      <p>multiply(4, 5) = {multiply(4, 5)}</p>
      <hr />
    </div>
  );
}
