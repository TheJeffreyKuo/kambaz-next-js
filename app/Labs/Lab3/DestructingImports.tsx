import Math, { add, subtract, multiply, divide } from "./Math";
import * as Matematica from "./Math";
export default function DestructingImports() {
  return (
    <div id="wd-destructuring-imports">
      <h2>Destructing Imports</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Math</th>
            <th>Matematica</th>
            <th>Functions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>add(2,3)</td><td>{Math.add(2,3)}</td><td>{add(2,3)}</td><td>{Matematica.add(2,3)}</td></tr>
          <tr><td>subtract(5,1)</td><td>{Math.subtract(5,1)}</td><td>{subtract(5,1)}</td><td>{Matematica.subtract(5,1)}</td></tr>
          <tr><td>multiply(3,4)</td><td>{Math.multiply(3,4)}</td><td>{multiply(3,4)}</td><td>{Matematica.multiply(3,4)}</td></tr>
          <tr><td>divide(8,2)</td><td>{Math.divide(8,2)}</td><td>{divide(8,2)}</td><td>{Matematica.divide(8,2)}</td></tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
}
