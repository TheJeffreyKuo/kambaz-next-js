"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, Form, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../client";

type Choice = { id: string; text: string; isCorrect: boolean };
type Question = {
  _id: string;
  quiz: string;
  title: string;
  type: "multiple_choice" | "true_false" | "fill_in_blank";
  points: number;
  question: string;
  choices?: Choice[];
  correctAnswer?: boolean;
  possibleAnswers?: string[];
};

type AnswerRec = {
  question: string;
  answer: any;
  correct: boolean;
  attemptNumber: number;
};

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role?.toUpperCase() === "FACULTY";

  const quizFromStore = quizzes.find((q: any) => q._id === qid);
  const [quiz, setQuiz] = useState<any>(quizFromStore || null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [serverResults, setServerResults] = useState<Record<string, boolean>>({});
  const [submittingErr, setSubmittingErr] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  const attemptLimit = quiz ? (quiz.multipleAttempts ? (quiz.howManyAttempts || 1) : 1) : 1;
  const attemptsRemaining = Math.max(0, attemptLimit - attemptNumber);

  useEffect(() => {
    (async () => {
      try {
        if (!quiz) {
          const fetched = await client.findQuizById(qid as string);
          setQuiz(fetched);
        }
        const qs: Question[] = await client.findQuestionsForQuiz(cid as string, qid as string);
        setQuestions(qs || []);
        if (!isFaculty) {
          try {
            const ans: AnswerRec[] = await client.findAnswersForQuiz(qid as string);
            const map: Record<string, any> = {};
            const results: Record<string, boolean> = {};
            let maxAttempt = 0;
            for (const a of ans || []) {
              map[a.question] = a.answer;
              results[a.question] = a.correct;
              if (a.attemptNumber > maxAttempt) maxAttempt = a.attemptNumber;
            }
            setAnswers(map);
            setServerResults(results);
            setAttemptNumber(maxAttempt);
            if (maxAttempt > 0) setSubmitted(true);
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !quiz) {
    return <div className="p-3"><p className="text-muted">Loading preview…</p></div>;
  }

  const totalPoints = questions.reduce((s, q) => s + (q.points || 0), 0);

  const isCorrect = (q: Question): boolean => {
    const ans = answers[q._id];
    if (q.type === "multiple_choice") {
      return !!(q.choices || []).find((c) => c.id === ans)?.isCorrect;
    }
    if (q.type === "true_false") {
      const asBool = ans === true || ans === "true";
      return asBool === q.correctAnswer;
    }
    if (q.type === "fill_in_blank") {
      const userText = String(ans ?? "").trim().toLowerCase();
      return (q.possibleAnswers || []).some(
        (a) => String(a ?? "").trim().toLowerCase() === userText
      );
    }
    return false;
  };

  const resultFor = (q: Question): boolean =>
    isFaculty ? isCorrect(q) : (serverResults[q._id] ?? isCorrect(q));

  const score = questions.reduce((s, q) => s + (resultFor(q) ? q.points : 0), 0);

  const handleSubmit = async () => {
    setSubmittingErr(null);
    if (isFaculty) {
      setSubmitted(true);
      return;
    }
    try {
      const resultMap: Record<string, boolean> = {};
      for (const q of questions) {
        const saved = await client.createAnswer(q._id, answers[q._id] ?? "");
        resultMap[q._id] = saved.correct;
      }
      setServerResults(resultMap);
      setAttemptNumber((n) => n + 1);
      setSubmitted(true);
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Failed to submit";
      setSubmittingErr(msg);
    }
  };

  const handleRetake = () => {
    setSubmitted(false);
    setCurrentIdx(0);
    setSubmittingErr(null);
  };

  const current = questions[currentIdx];
  const canInteract = !submitted && (isFaculty || attemptsRemaining > 0);

  return (
    <div id="wd-quiz-preview" className="p-3">
      <h2>{quiz.title}</h2>
      {isFaculty && (
        <Alert variant="warning" className="py-2 small">
          This is a preview of the published version of the quiz.
        </Alert>
      )}
      {quiz.description && (
        <div className="small mb-2" dangerouslySetInnerHTML={{ __html: quiz.description }} />
      )}
      <p className="text-muted small">
        Started: {new Date().toLocaleString()}
        {!isFaculty && (
          <>
            {" "}• Attempt {Math.min(attemptNumber + (submitted ? 0 : 1), attemptLimit)} of {attemptLimit}
          </>
        )}
      </p>
      <h5>Quiz Instructions</h5>
      <hr />

      {questions.length === 0 ? (
        <p className="text-muted">No questions in this quiz yet.</p>
      ) : submitted ? (
        <div>
          <h4 className="mb-3">Your Score: {score} / {totalPoints}</h4>
          {questions.map((q, i) => {
            const correct = resultFor(q);
            return (
              <div key={q._id} className={`border rounded p-3 mb-3 ${correct ? "border-success" : "border-danger"}`}>
                <div className="d-flex justify-content-between">
                  <strong>Question {i + 1}: {q.title}</strong>
                  <span>{correct ? `${q.points} / ${q.points} pts` : `0 / ${q.points} pts`}</span>
                </div>
                <div className="small my-2" dangerouslySetInnerHTML={{ __html: q.question || "" }} />
                <div className="small">
                  <div>Your answer: <code>{renderAnswer(q, answers[q._id])}</code></div>
                  {!correct && <div>Correct answer: <code>{renderCorrectAnswer(q)}</code></div>}
                </div>
              </div>
            );
          })}
          <div className="d-flex gap-2 justify-content-end my-3">
            {!isFaculty && attemptsRemaining > 0 && (
              <Button variant="outline-primary" onClick={handleRetake}>Take Again ({attemptsRemaining} left)</Button>
            )}
            {!isFaculty && attemptsRemaining <= 0 && (
              <span className="text-muted align-self-center me-2">No attempts remaining</span>
            )}
            {isFaculty && (
              <Link href={`/Courses/${cid}/Quizzes/${qid}/Editor`}>
                <Button variant="outline-secondary">Keep Editing This Quiz</Button>
              </Link>
            )}
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
              Back to Quiz
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Question {currentIdx + 1}: {current.title}</strong>
              <span className="text-muted small">{current.points} pts</span>
            </div>
            <div className="small mb-3" dangerouslySetInnerHTML={{ __html: current.question || "" }} />
            {renderQuestionInput(current, answers, setAnswers, canInteract)}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="outline-secondary" size="sm"
              disabled={currentIdx === 0} onClick={() => setCurrentIdx((i) => i - 1)}>
              Previous
            </Button>
            <div className="d-flex flex-wrap gap-1">
              {questions.map((_, i) => (
                <Button key={i} size="sm"
                  variant={i === currentIdx ? "primary" : "outline-secondary"}
                  onClick={() => setCurrentIdx(i)}>
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button variant="outline-secondary" size="sm"
              disabled={currentIdx >= questions.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}>
              Next
            </Button>
          </div>

          {submittingErr && <Alert variant="danger" className="py-2 small">{submittingErr}</Alert>}

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSubmit} disabled={!canInteract}>
              Submit Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function renderQuestionInput(
  q: Question,
  answers: Record<string, any>,
  setAnswers: (a: Record<string, any>) => void,
  canInteract: boolean
) {
  const setAns = (value: any) => setAnswers({ ...answers, [q._id]: value });
  const value = answers[q._id];
  if (q.type === "multiple_choice") {
    return (
      <div>
        {(q.choices || []).map((c) => (
          <Form.Check
            key={c.id}
            type="radio"
            name={`q-${q._id}`}
            label={c.text}
            checked={value === c.id}
            disabled={!canInteract}
            onChange={() => setAns(c.id)}
          />
        ))}
      </div>
    );
  }
  if (q.type === "true_false") {
    return (
      <div>
        <Form.Check type="radio" name={`q-${q._id}`} label="True"
          checked={value === true || value === "true"}
          disabled={!canInteract}
          onChange={() => setAns(true)} />
        <Form.Check type="radio" name={`q-${q._id}`} label="False"
          checked={value === false || value === "false"}
          disabled={!canInteract}
          onChange={() => setAns(false)} />
      </div>
    );
  }
  return (
    <FormControl value={value ?? ""} disabled={!canInteract}
      onChange={(e) => setAns(e.target.value)} placeholder="Type your answer" />
  );
}

function renderAnswer(q: Question, ans: any): string {
  if (ans === undefined || ans === null || ans === "") return "(no answer)";
  if (q.type === "multiple_choice") {
    return (q.choices || []).find((c) => c.id === ans)?.text || String(ans);
  }
  if (q.type === "true_false") {
    return ans === true || ans === "true" ? "True" : "False";
  }
  return String(ans);
}

function renderCorrectAnswer(q: Question): string {
  if (q.type === "multiple_choice") {
    return (q.choices || []).find((c) => c.isCorrect)?.text || "—";
  }
  if (q.type === "true_false") {
    return q.correctAnswer ? "True" : "False";
  }
  return (q.possibleAnswers || []).join(" / ") || "—";
}
