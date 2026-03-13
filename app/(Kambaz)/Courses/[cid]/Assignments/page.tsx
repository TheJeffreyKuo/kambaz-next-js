"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import { RootState } from "../../../store";
export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const dispatch = useDispatch();
  const courseAssignments = assignments.filter((a: any) => a.course === cid);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };
  return (
    <div id="wd-Assignments" className="mb-4">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <div className="input-group flex-grow-1 me-2" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-white">
            <IoSearch className="text-secondary" />
          </span>
          <input type="text" className="form-control border-start-0"
            placeholder="Search..." id="wd-search-assignment" aria-label="Search..." />
        </div>
        <div className="d-flex ms-auto gap-1">
          <Button variant="secondary" size="lg" id="wd-add-assignment-group" className="text-nowrap rounded-1">
            <FaPlus className="me-2" style={{ verticalAlign: "middle" }} />Group
          </Button>
          <Link href={`/Courses/${cid}/Assignments/new`}>
            <Button variant="danger" size="lg" id="wd-add-assignment" className="text-nowrap rounded-1">
              <FaPlus className="me-2" style={{ verticalAlign: "middle" }} />Assignment
            </Button>
          </Link>
        </div>
      </div>
      <div className="wd-Assignments-section mb-4">
        <div className="d-flex align-items-center justify-content-between p-3 ps-2 bg-secondary rounded mb-2">
          <h3 className="wd-Assignments-title mb-0 fs-5 fw-bold">ASSIGNMENTS 40% of Total</h3>
          <Button variant="secondary" size="sm"><BsPlus className="fs-4" /></Button>
        </div>
        <ListGroup id="wd-assignment-list" className="rounded-0">
          {courseAssignments.map((assignment: any) => (
            <ListGroupItem key={assignment._id} className="wd-assignment-item border-gray p-3 ps-3 d-flex justify-content-between align-items-start">
              <div className="me-1 flex-shrink-0 align-self-stretch d-flex align-items-center text-secondary">
                <BsGripVertical className="me-2 fs-3" />
              </div>
              <Link href={`/Courses/${cid}/Assignments/${assignment._id}`}
                className="wd-assignment-link text-decoration-none text-dark flex-grow-1" style={{ minWidth: 0 }}>
                <div className="wd-assignment-title fw-bold">{assignment.title}</div>
                <div className="wd-assignment-subtext text-secondary small">
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b>{" "}
                  {new Date(assignment.availableDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} |
                </div>
                <div className="wd-assignment-subtext text-secondary small">
                  <b>Due</b>{" "}
                  {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} | {assignment.points}pts
                </div>
              </Link>
              <div className="ms-3 flex-shrink-0 align-self-stretch d-flex align-items-center">
                <FaTrash className="text-danger me-2 mb-1" onClick={() => handleDeleteClick(assignment._id)} />
                <button type="button" className="btn p-0 border-0 bg-transparent text-secondary">
                  <IoEllipsisVertical className="fs-4" />
                </button>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
      <Modal show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this assignment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>No</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
