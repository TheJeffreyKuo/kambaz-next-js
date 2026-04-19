"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Form, FormControl, FormSelect, FormCheck, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { addQuiz, updateQuiz, setDraft, updateDraft, clearDraft } from "../../reducer";
import { setQuestions } from "../Questions/reducer";
import * as client from "../../client";
import RichTextEditor from "../../RichTextEditor";

const defaultQuiz = (cid: string) => ({
  title: "Unnamed Quiz",
  description: "",
  course: cid,
  quizType: "GRADED_QUIZ",
  assignmentGroup: "QUIZZES",
  shuffleAnswers: true,
  timeLimit: 20,
  multipleAttempts: false,
  howManyAttempts: 1,
  showCorrectAnswers: "",
  accessCode: "",
  oneQuestionAtATime: true,
  webcamRequired: false,
  lockQuestionsAfterAnswering: false,
  dueDate: "",
  availableDate: "",
  untilDate: "",
  published: false,
  points: 0,
  questionCount: 0,
});

export default function QuizDetailsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes, draft } = useSelector((state: RootState) => state.quizzesReducer);
  const { questions } = useSelector((state: RootState) => state.questionsReducer);
  const isNew = qid === "new";
  const existing = quizzes.find((q: any) => q._id === qid);
  const [localQuiz, setLocalQuiz] = useState<any>(existing || null);

  useEffect(() => {
    if (isNew) {
      if (!draft) dispatch(setDraft(defaultQuiz(cid as string)));
    } else if (!existing) {
      client.findQuizById(qid as string).then((data) => setLocalQuiz(data)).catch(() => {});
    } else {
      setLocalQuiz(existing);
    }
  }, [isNew, qid]);

  const quiz = isNew ? (draft || defaultQuiz(cid as string)) : (localQuiz || defaultQuiz(cid as string));
  const setQuiz = (patch: any) => {
    if (isNew) dispatch(updateDraft(patch));
    else setLocalQuiz({ ...quiz, ...patch });
  };

  const persistQueuedQuestions = async (realQuizId: string) => {
    const queued = (questions as any[]).filter((q: any) => String(q._id).startsWith("new-"));
    const saved: any[] = [];
    for (const q of queued) {
      try {
        const { _id: _discard, ...rest } = q;
        const created = await client.createQuestionForQuiz(cid as string, realQuizId, { ...rest, quiz: realQuizId });
        saved.push(created);
      } catch {}
    }
    return saved;
  };

  const computeMeta = (qs: any[]) => ({
    points: qs.reduce((s, q) => s + (q.points || 0), 0),
    questionCount: qs.length,
  });

  const handleSave = async () => {
    try {
      if (isNew) {
        const meta = computeMeta(questions as any[]);
        const created = await client.createQuizForCourse(cid as string, { ...quiz, ...meta, course: cid });
        const savedQuestions = await persistQueuedQuestions(created._id);
        const allQs = [...(questions as any[]).filter((q: any) => !String(q._id).startsWith("new-")), ...savedQuestions];
        const finalMeta = computeMeta(allQs);
        const finalQuiz = { ...created, ...finalMeta };
        try { await client.updateQuiz(finalQuiz); } catch {}
        dispatch(addQuiz(finalQuiz));
        dispatch(setQuestions(allQs));
        dispatch(clearDraft());
        router.push(`/Courses/${cid}/Quizzes/${created._id}`);
      } else {
        const saved = await client.updateQuiz(quiz);
        dispatch(updateQuiz(saved && saved._id ? saved : quiz));
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch {
      router.push(`/Courses/${cid}/Quizzes`);
    }
  };

  const handleSaveAndPublish = async () => {
    const toSave = { ...quiz, published: true };
    try {
      if (isNew) {
        const meta = computeMeta(questions as any[]);
        const created = await client.createQuizForCourse(cid as string, { ...toSave, ...meta, course: cid });
        const savedQuestions = await persistQueuedQuestions(created._id);
        const allQs = [...(questions as any[]).filter((q: any) => !String(q._id).startsWith("new-")), ...savedQuestions];
        const finalMeta = computeMeta(allQs);
        const finalQuiz = { ...created, ...finalMeta, published: true };
        try { await client.updateQuiz(finalQuiz); } catch {}
        try { await client.publishQuiz(created._id); } catch {}
        dispatch(addQuiz(finalQuiz));
        dispatch(setQuestions(allQs));
        dispatch(clearDraft());
      } else {
        const saved = await client.updateQuiz(toSave);
        try { await client.publishQuiz(qid as string); } catch {}
        dispatch(updateQuiz(saved && saved._id ? { ...saved, published: true } : toSave));
      }
    } catch {}
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    if (isNew) {
      dispatch(clearDraft());
      dispatch(setQuestions([]));
    }
    router.push(`/Courses/${cid}/Quizzes`);
  };

  return (
    <div id="wd-quiz-details-editor" className="p-3">
      <div className="d-flex justify-content-end align-items-center mb-2 gap-3">
        <span className="text-muted">Points {quiz.points ?? 0}</span>
        <span className={`badge ${quiz.published ? "bg-success" : "bg-secondary"}`}>
          {quiz.published ? "Published" : "Not Published"}
        </span>
      </div>

      <Nav variant="tabs" className="mb-3" style={{ "--bs-nav-link-color": "#dc3545" } as React.CSSProperties}>
        <Nav.Item>
          <Nav.Link active>Details</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)}>
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Form>
        <Form.Group className="mb-3">
          <FormControl placeholder="Quiz Title" value={quiz.title || ""}
            onChange={e => setQuiz({ title: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quiz Instructions</Form.Label>
          <RichTextEditor
            value={quiz.description || ""}
            onChange={(v) => setQuiz({ description: v })}
            placeholder="Quiz description/instructions"
          />
        </Form.Group>

        <table className="w-100"><tbody>
          <tr>
            <td align="right" className="pe-3 py-2" style={{ width: 220 }}>
              <Form.Label>Quiz Type</Form.Label>
            </td>
            <td className="py-2">
              <FormSelect value={quiz.quizType || "GRADED_QUIZ"}
                onChange={e => setQuiz({ quizType: e.target.value })}>
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </FormSelect>
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Assignment Group</Form.Label>
            </td>
            <td className="py-2">
              <FormSelect value={quiz.assignmentGroup || "QUIZZES"}
                onChange={e => setQuiz({ assignmentGroup: e.target.value })}>
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </FormSelect>
            </td>
          </tr>

          <tr><td colSpan={2}><Form.Label className="fw-bold mt-2">Options</Form.Label></td></tr>

          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Shuffle Answers" checked={!!quiz.shuffleAnswers}
                onChange={e => setQuiz({ shuffleAnswers: e.target.checked })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1 d-flex align-items-center gap-2">
              <FormCheck label="Time Limit" checked={(quiz.timeLimit ?? 0) > 0}
                onChange={e => setQuiz({ timeLimit: e.target.checked ? 20 : 0 })} />
              {(quiz.timeLimit ?? 0) > 0 && (
                <>
                  <FormControl type="number" min={1} value={quiz.timeLimit} style={{ width: 80 }}
                    onChange={e => setQuiz({ timeLimit: parseInt(e.target.value) || 0 })} />
                  <span>Minutes</span>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Allow Multiple Attempts" checked={!!quiz.multipleAttempts}
                onChange={e => setQuiz({ multipleAttempts: e.target.checked })} />
            </td>
          </tr>
          {quiz.multipleAttempts && (
            <tr>
              <td align="right" className="pe-3 py-1">
                <Form.Label>How Many Attempts</Form.Label>
              </td>
              <td className="py-1">
                <FormControl type="number" min={1} value={quiz.howManyAttempts ?? 1} style={{ width: 80 }}
                  onChange={e => setQuiz({ howManyAttempts: parseInt(e.target.value) || 1 })} />
              </td>
            </tr>
          )}
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Show Correct Answers</Form.Label>
            </td>
            <td className="py-2">
              <FormSelect value={quiz.showCorrectAnswers || ""}
                onChange={e => setQuiz({ showCorrectAnswers: e.target.value })}>
                <option value="">Never</option>
                <option value="Immediately">Immediately</option>
                <option value="After last attempt">After last attempt</option>
                <option value="After due date">After due date</option>
              </FormSelect>
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Access Code</Form.Label>
            </td>
            <td className="py-2">
              <FormControl value={quiz.accessCode || ""} placeholder="Leave blank for no code"
                onChange={e => setQuiz({ accessCode: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="One Question at a Time" checked={!!quiz.oneQuestionAtATime}
                onChange={e => setQuiz({ oneQuestionAtATime: e.target.checked })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Webcam Required" checked={!!quiz.webcamRequired}
                onChange={e => setQuiz({ webcamRequired: e.target.checked })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Lock Questions After Answering" checked={!!quiz.lockQuestionsAfterAnswering}
                onChange={e => setQuiz({ lockQuestionsAfterAnswering: e.target.checked })} />
            </td>
          </tr>

          <tr><td colSpan={2}><hr /></td></tr>

          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Due</Form.Label>
            </td>
            <td className="py-2">
              <FormControl type="date" value={quiz.dueDate || ""}
                onChange={e => setQuiz({ dueDate: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Available from</Form.Label>
            </td>
            <td className="py-2">
              <FormControl type="date" value={quiz.availableDate || ""}
                onChange={e => setQuiz({ availableDate: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Until</Form.Label>
            </td>
            <td className="py-2">
              <FormControl type="date" value={quiz.untilDate || ""}
                onChange={e => setQuiz({ untilDate: e.target.value })} />
            </td>
          </tr>

          <tr><td colSpan={2}><hr /></td></tr>
          <tr>
            <td colSpan={2} align="right">
              <Button variant="secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
              <Button variant="secondary" className="me-2" onClick={handleSave}>Save</Button>
              <Button variant="danger" onClick={handleSaveAndPublish}>Save &amp; Publish</Button>
            </td>
          </tr>
        </tbody></table>
      </Form>
    </div>
  );
}
