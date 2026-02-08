import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h1 className="mb-4">Profile</h1>
      <FormControl  type="text" defaultValue="alice" placeholder="username" className="mb-2 wd-username"/>
      <FormControl  defaultValue="123"   placeholder="password" type="password" className="mb-2 wd-password" />
      <FormControl  type="text" defaultValue="Alice" placeholder="First Name" id="wd-firstname" className="mb-2"/>
      <FormControl  defaultValue="Wonderland" placeholder="Last Name" id="wd-lastname" className="mb-2"/>
      <FormControl  defaultValue="2000-01-01" type="date" id="wd-dob" className="mb-2"/>
      <FormControl  defaultValue="alice@wonderland" type="email" id="wd-email" className="mb-2"/>
      <FormControl  defaultValue="USER" type="role" id="wd-role" className="mb-2"/>
      <Link href="/account/Signin" className="mb-2 btn btn-danger w-100" id="wd-signout-btn"> Sign out </Link>
    </div>
);}
