"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, ListGroup, ListGroupItem, Modal, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaTrash, FaCheck, FaCheckCircle } from "react-icons/fa";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";
import { setQuizzes } from "./reducer";
export default function Quizzes() {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const dispatch = useDispatch();
  const courseQuizzes = quizzes.filter((a: any) => a.course === cid);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [quizToPublish, setQuizToPublish] = useState<string | null>(null);
  const router = useRouter();
  const fetchQuizzes = async () => {
    const quizzes = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };
  useEffect(() => {
    fetchQuizzes();
  }, []);
  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = async () => {
    if (quizToDelete) {
      await client.deleteQuiz(quizToDelete);
      dispatch(setQuizzes(quizzes.filter((a: any) => a._id !== quizToDelete)));
    }
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };
  const handlePublishClick = (quizId: string) => {
    setQuizToPublish(quizId);
    setShowPublishDialog(true);
  };
  const handleConfirmPublish = async () => {
    if (quizToPublish) {
      await client.publishQuiz(quizToPublish);
      dispatch(setQuizzes(quizzes.filter((a: any) => a._id !== quizToPublish)));
    }
    setShowPublishDialog(false);
    setQuizToPublish(null);
  };
  const getQuizStatus = (quiz: any) => {
    const now = new Date();
    const available = new Date(quiz.availableDate);
    const until = new Date(quiz.untilDate);
    if (now > until) return "Closed";
    if (now < available) {
      return `Not available until ${available.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }
    return "Available: Multiple Dates";
  };
  const getQuizStatusClass = (quiz: any) => {
    const now = new Date();
    const available = new Date(quiz.availableDate);
    const until = new Date(quiz.untilDate);

    if (now > until) return "text-danger";
    if (now < available) return "text-warning";
    return "text-success";
  };
  return (
    <div id="wd-Quizzes" className="mb-4">
      <h2>Quizzes</h2>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <div className="input-group flex-grow-1 me-2" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-white">
            <IoSearch className="text-secondary" />
          </span>
          <input type="text" className="form-control border-start-0"
            placeholder="Search..." id="wd-search-quiz" aria-label="Search..." />
        </div>
        <div className="d-flex ms-auto gap-1">
          <Link href={`/Courses/${cid}/Quizzes/new`}>
            <Button variant="danger" size="lg" id="wd-add-quiz" className="text-nowrap rounded-1">
              <FaPlus className="me-2" style={{ verticalAlign: "middle" }} />Quiz
            </Button>
          </Link>
        </div>
      </div>
      <div className="wd-Quizzes-section mb-4">
        <div className="d-flex align-items-center p-3 ps-2 bg-secondary rounded mb-2">
          <Button variant="secondary" size="sm"><BsPlus className="fs-4" /></Button>Assignment Quizzes
        </div>
        <ListGroup id="wd-quiz-list" className="rounded-0">
          {courseQuizzes.map((quiz: any) => (
            <ListGroupItem key={quiz._id} className="wd-quiz-item border-gray p-3 ps-3 d-flex justify-content-between align-items-start">
              <div className="me-1 flex-shrink-0 align-self-stretch d-flex align-items-center text-secondary">
                <BsGripVertical className="me-2 fs-3" />
              </div>
              <Link href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                className="wd-quiz-link text-decoration-none text-dark flex-grow-1" style={{ minWidth: 0 }}>
                <div className="wd-quiz-title fw-bold">{quiz.title}</div>
                <div className="wd-quiz-subtext text-secondary small">
                  <span className={getQuizStatusClass(quiz)}>
                    {getQuizStatus(quiz)}
                  </span>{" "}
                  | <b>Due</b>{" "}
                  {new Date(quiz.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  | {quiz.points} pts | {quiz.questions.length} questions | Score: {quiz.score} / {quiz.points}
                </div>
              </Link>
              <div className="ms-3 flex-shrink-0 align-self-stretch d-flex align-items-center">
                <FaCheckCircle className="text-success me-2 mb-1" onClick={() => handlePublishClick(quiz._id)} />
              <Dropdown align="end">
                <DropdownToggle
                  variant="link"
                  className="p-0 border-0 bg-transparent text-secondary shadow-none"
                >
                  <IoEllipsisVertical className="fs-4" />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)}>
                    Edit
                  </DropdownItem>

                  <DropdownItem onClick={() => handleDeleteClick(quiz._id)}>
                    Delete
                  </DropdownItem>
                  <DropdownItem onClick={() => handlePublishClick(quiz._id)}>
                    Publish
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
      <Modal show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this quiz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>No</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showPublishDialog} onHide={() => setShowPublishDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Publish Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to publish this quiz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPublishDialog(false)}>No</Button>
          <Button variant="danger" onClick={handleConfirmPublish}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );}