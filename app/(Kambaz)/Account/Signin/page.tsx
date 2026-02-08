import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signin() {
  return (
    <div id="wd-signin-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h1 className="mb-4">Sign in</h1>
     <FormControl
        id="wd-username"
        className="mb-2"
        placeholder="username"
        type="text"
        defaultValue="Johndoe"
      />
     <FormControl
        id="wd-password"
        className="mb-2"
        placeholder="password"
        type="password"
        defaultValue="dontlookhere"
      />
      <Link id="wd-signin-btn" className="btn btn-primary w-100 mb-2"href="/Dashboard"> Sign in </Link> <br />
      <Link id="wd-signup-link" className="text-primary text-decoration-underline" href="/Account/Signup"> Sign up </Link>
    </div>
);}
