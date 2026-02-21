import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h1 className="mb-4">Sign up</h1>
      <FormControl id="wd-username" placeholder="username" className="mb-2" defaultValue="alice" />
      <FormControl id="wd-password" placeholder="password" type="password" className="mb-2" defaultValue="password123"/>
      <FormControl id="wd-password-verify" placeholder="verify password" type="password" className="mb-2" defaultValue="password123"/>
      <Link
        id="wd-signup-btn"
        href="/Account/Profile"
        className="btn btn-primary w-100 mb-2"
      >
        Sign up
      </Link>
      <Link
        id="wd-signin-link"
        href="/Account/Signin"
        className="text-primary text-decoration-underline"
      >
        Sign in
      </Link>
    </div>
);}
