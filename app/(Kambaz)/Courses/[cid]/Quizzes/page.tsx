"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, ListGroup, ListGroupItem, Modal, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { BsGripVertical } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";
import * as quizClient from "./client";
import { setQuizzes, updateQuiz as updateQuizAction, deleteQuiz as deleteQuizAction } from "./reducer";

export default function Quizzes() {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role?.toUpperCase() === "FACULTY";
  const dispatch = useDispatch();
  const router = useRouter();

  const courseQuizzes = [...quizzes.filter((a: any) => a.course === cid)].sort(
    (a: any, b: any) => {
      const ta = a.availableDate ? new Date(a.availableDate).getTime() : 0;
      const tb = b.availableDate ? new Date(b.availableDate).getTime() : 0;
      return ta - tb;
    }
  );
  const visibleQuizzes = isFaculty ? courseQuizzes : courseQuizzes.filter((q: any) => q.published);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [quizToPublish, setQuizToPublish] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const fetchQuizzes = async () => {
    const data = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(data));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (isFaculty || !currentUser?._id) return;
    (async () => {
      const newScores: Record<string, number> = {};
      await Promise.all(
        courseQuizzes.map(async (q: any) => {
          try {
            const [answers, questions] = await Promise.all([
              quizClient.findAnswersForQuiz(q._id),
              quizClient.findQuestionsForQuiz(cid as string, q._id),
            ]);
            let score = 0;
            for (const ans of answers || []) {
              const question = (questions || []).find((qq: any) => qq._id === ans.question);
              if (ans.correct && question) score += question.points || 0;
            }
            newScores[q._id] = score;
          } catch {}
        })
      );
      setScores(newScores);
    })();
  }, [quizzes.length, currentUser?._id, isFaculty]);

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = async () => {
    if (quizToDelete) {
      await client.deleteQuiz(quizToDelete);
      dispatch(deleteQuizAction(quizToDelete));
    }
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handlePublishClick = (quiz: any) => {
    setQuizToPublish(quiz);
    setShowPublishDialog(true);
  };
  const handleConfirmPublish = async () => {
    if (quizToPublish) {
      const next = !quizToPublish.published;
      if (next) {
        await client.publishQuiz(quizToPublish._id);
      } else {
        await client.unpublishQuiz(quizToPublish._id);
      }
      dispatch(updateQuizAction({ ...quizToPublish, published: next }));
    }
    setShowPublishDialog(false);
    setQuizToPublish(null);
  };

  const getQuizStatus = (quiz: any) => {
    const now = new Date();
    const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const until = quiz.untilDate ? new Date(quiz.untilDate) : null;
    if (until && now > until) return "Closed";
    if (available && now < available) {
      return `Not available until ${available.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }
    return "Available";
  };
  const getQuizStatusClass = (quiz: any) => {
    const now = new Date();
    const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const until = quiz.untilDate ? new Date(quiz.untilDate) : null;
    if (until && now > until) return "text-danger";
    if (available && now < available) return "text-warning";
    return "text-success";
  };
  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

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
        {isFaculty && (
          <div className="d-flex ms-auto gap-1">
            <Link href={`/Courses/${cid}/Quizzes/new/Editor`}>
              <Button variant="danger" size="lg" id="wd-add-quiz" className="text-nowrap rounded-1">
                <FaPlus className="me-2" style={{ verticalAlign: "middle" }} />Quiz
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="wd-Quizzes-section mb-4">
        <div className="d-flex align-items-center p-3 ps-2 bg-secondary rounded mb-2">
          Assignment Quizzes
        </div>
        {visibleQuizzes.length === 0 ? (
          <p className="text-muted text-center py-4">
            {isFaculty ? "No quizzes yet. Click + Quiz to add one." : "No quizzes available."}
          </p>
        ) : (
          <ListGroup id="wd-quiz-list" className="rounded-0">
            {visibleQuizzes.map((quiz: any) => (
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
                    | <b>Due</b> {formatDate(quiz.dueDate)} | {quiz.points ?? 0} pts | {quiz.questionCount ?? 0} Questions
                    {!isFaculty && (
                      <> | Score: {scores[quiz._id] ?? 0} / {quiz.points ?? 0}</>
                    )}
                  </div>
                </Link>
                <div className="ms-3 flex-shrink-0 align-self-stretch d-flex align-items-center">
                  {isFaculty ? (
                    quiz.published ? (
                      <FaCheckCircle className="text-success me-2 mb-1" style={{ cursor: "pointer" }} onClick={() => handlePublishClick(quiz)} />
                    ) : (
                      <FaBan className="text-secondary me-2 mb-1" style={{ cursor: "pointer" }} onClick={() => handlePublishClick(quiz)} />
                    )
                  ) : (
                    quiz.published && <FaCheckCircle className="text-success me-2 mb-1" />
                  )}
                  {isFaculty && (
                    <Dropdown align="end">
                      <DropdownToggle
                        variant="link"
                        className="p-0 border-0 bg-transparent text-secondary shadow-none"
                      >
                        <IoEllipsisVertical className="fs-4" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Editor`)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDeleteClick(quiz._id)}>
                          Delete
                        </DropdownItem>
                        <DropdownItem onClick={() => handlePublishClick(quiz)}>
                          {quiz.published ? "Unpublish" : "Publish"}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
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
          <Modal.Title>{quizToPublish?.published ? "Unpublish Quiz" : "Publish Quiz"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {quizToPublish?.published ? "unpublish" : "publish"} this quiz?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPublishDialog(false)}>No</Button>
          <Button variant="danger" onClick={handleConfirmPublish}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
