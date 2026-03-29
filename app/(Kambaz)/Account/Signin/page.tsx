"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { redirect } from "next/navigation";
import { FormControl, Button } from "react-bootstrap";
import Link from "next/link";
import * as client from "../client";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/Dashboard");
  };
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <FormControl id="wd-username"
        defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        placeholder="username" className="mb-2" />
      <FormControl id="wd-password"
        defaultValue={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="password" type="password" className="mb-2" />
      <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-2"> Sign in </Button>
      <Link href="/Account/Signup" className="wd-signin-link">Sign up</Link>
    </div>
  );
}
