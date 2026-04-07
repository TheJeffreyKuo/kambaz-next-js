"use client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import * as client from "../client";
export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };
  const fetchProfile = () => {
    if (!currentUser) return redirect("/Account/Signin");
    setProfile(currentUser);
  };
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    redirect("/Account/Signin");
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl id="wd-username" className="mb-2" placeholder="username"
            defaultValue={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value }) } />
          <FormControl id="wd-password" className="mb-2" placeholder="password"
            defaultValue={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value }) } />
          <FormControl id="wd-firstname" className="mb-2" placeholder="first name"
            defaultValue={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value }) } />
          <FormControl id="wd-lastname" className="mb-2" placeholder="last name"
            defaultValue={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value }) } />
          <FormControl id="wd-dob" className="mb-2" type="date" placeholder="date of birth"
            defaultValue={profile.dob}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
          <FormControl id="wd-email" className="mb-2" placeholder="email"
            defaultValue={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <select className="form-control mb-2" id="wd-role"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })} >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          <div>
            <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
            <button onClick={signout} className="wd-signout-btn btn btn-danger w-100" id="wd-signout-btn">
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
