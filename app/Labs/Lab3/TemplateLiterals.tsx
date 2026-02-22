export default function TemplateLiterals() {
  const five = 5;
  const result1 = "The result of 5 + 5 is " + (five + five);
  const result2 = `The result of 5 + 5 is ${five + five}`;
  const username = "alice";
  const loggedIn = true;
  const greeting1 = "Hello, " + username + "!";
  const greeting2 = `Hello, ${username}! ${loggedIn ? "Welcome back." : "Please login."}`;
  return (
    <div id="wd-template-literals">
      <h4>Template Literals</h4>
      <p>{result1}</p>
      <p>{result2}</p>
      <p>{greeting1}</p>
      <p>{greeting2}</p>
      <hr />
    </div>
  );
}
