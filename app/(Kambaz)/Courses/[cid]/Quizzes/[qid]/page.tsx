"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import * as quizClient from "../client";
import { updateQuiz as updateQuizAction } from "../reducer";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role?.toUpperCase() === "FACULTY";

  const existing = quizzes.find((q: any) => q._id === qid);
  const [quiz, setQuiz] = useState<any>(existing || null);

  useEffect(() => {
    if (!existing && qid && qid !== "new") {
      quizClient.findQuizById(qid as string).then((data) => setQuiz(data)).catch(() => {});
    } else if (existing) {
      setQuiz(existing);
    }
  }, [qid, existing]);

  const togglePublish = async () => {
    if (!quiz) return;
    const next = !quiz.published;
    try {
      if (next) await client.publishQuiz(quiz._id);
      else await client.unpublishQuiz(quiz._id);
      const updated = { ...quiz, published: next };
      setQuiz(updated);
      dispatch(updateQuizAction(updated));
    } catch {}
  };

  if (!quiz) {
    return <div className="p-3"><p className="text-muted">Loading quiz…</p></div>;
  }

  const yesNo = (v: any) => (v ? "Yes" : "No");
  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <tr>
      <td align="right" className="pe-3 py-1 text-muted" style={{ width: 240 }}>{label}</td>
      <td className="py-1">{value}</td>
    </tr>
  );

  return (
    <div id="wd-quiz-details" className="p-3">
      <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
        <span className="text-muted me-2">Points {quiz.points ?? 0}</span>
        <span className={`badge me-3 ${quiz.published ? "bg-success" : "bg-secondary"}`}>
          {quiz.published ? "Published" : "Not Published"}
        </span>
        {isFaculty ? (
          <>
            <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/Preview`}>
              <Button variant="outline-secondary" size="sm">Preview</Button>
            </Link>
            <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/Editor`}>
              <Button variant="outline-secondary" size="sm">Edit</Button>
            </Link>
            <Button variant={quiz.published ? "outline-warning" : "outline-success"} size="sm" onClick={togglePublish}>
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>
          </>
        ) : (
          <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/Preview`}>
            <Button variant="danger" size="sm">Start Quiz</Button>
          </Link>
        )}
      </div>

      <h2>{quiz.title}</h2>
      {quiz.description && (
        <div
          className="mb-3 small"
          dangerouslySetInnerHTML={{ __html: quiz.description }}
        />
      )}
      <hr />

      <table className="w-100"><tbody>
        <Row label="Quiz Type" value={({
          GRADED_QUIZ: "Graded Quiz",
          PRACTICE_QUIZ: "Practice Quiz",
          GRADED_SURVEY: "Graded Survey",
          UNGRADED_SURVEY: "Ungraded Survey",
        } as Record<string, string>)[quiz.quizType] || "Graded Quiz"} />
        <Row label="Points" value={quiz.points ?? 0} />
        <Row label="Assignment Group" value={quiz.assignmentGroup || "QUIZZES"} />
        <Row label="Shuffle Answers" value={yesNo(quiz.shuffleAnswers)} />
        <Row label="Time Limit" value={quiz.timeLimit > 0 ? `${quiz.timeLimit} Minutes` : "No Limit"} />
        <Row label="Multiple Attempts" value={yesNo(quiz.multipleAttempts)} />
        {quiz.multipleAttempts && <Row label="How Many Attempts" value={quiz.howManyAttempts ?? 1} />}
        <Row label="Show Correct Answers" value={quiz.showCorrectAnswers || "—"} />
        <Row label="Access Code" value={quiz.accessCode || "—"} />
        <Row label="One Question at a Time" value={yesNo(quiz.oneQuestionAtATime)} />
        <Row label="Webcam Required" value={yesNo(quiz.webcamRequired)} />
        <Row label="Lock Questions After Answering" value={yesNo(quiz.lockQuestionsAfterAnswering)} />
      </tbody></table>

      <hr />

      <table className="w-100 small"><thead>
        <tr className="text-muted">
          <th className="py-2">Due</th>
          <th className="py-2">For</th>
          <th className="py-2">Available from</th>
          <th className="py-2">Until</th>
        </tr>
      </thead><tbody>
        <tr>
          <td className="py-1">{formatDate(quiz.dueDate)}</td>
          <td className="py-1">Everyone</td>
          <td className="py-1">{formatDate(quiz.availableDate)}</td>
          <td className="py-1">{formatDate(quiz.untilDate)}</td>
        </tr>
      </tbody></table>
    </div>
  );
}
