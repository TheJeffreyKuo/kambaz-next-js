"use client";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import { users, enrollments } from "../../../../../Database";

export default function PeopleTable() {
  const { cid } = useParams();
  const enrolledUsers = users.filter((usr) =>
    enrollments.some((e) => e.user === usr._id && e.course === cid)
  );
  return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th><th>Login ID</th><th>Section</th>
            <th>Role</th><th>Last Activity</th><th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsers.map((usr) => (
            <tr key={usr._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{usr.firstName}</span>{" "}
                <span className="wd-last-name">{usr.lastName}</span>
              </td>
              <td className="wd-login-id">{usr.loginId}</td>
              <td className="wd-section">{usr.section}</td>
              <td className="wd-role">{usr.role}</td>
              <td className="wd-last-activity">{usr.lastActivity}</td>
              <td className="wd-total-activity">{usr.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
