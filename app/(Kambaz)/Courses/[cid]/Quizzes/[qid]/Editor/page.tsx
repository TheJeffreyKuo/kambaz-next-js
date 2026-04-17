"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Form, FormControl, FormSelect, FormCheck, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { addQuiz, updateQuiz } from "../../reducer";
import * as client from "../../client";

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
});

export default function QuizDetailsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const isNew = qid === "new";
  const existing = quizzes.find((q: any) => q._id === qid);
  const [quiz, setQuiz] = useState<any>(existing || defaultQuiz(cid as string));

  useEffect(() => {
    if (!isNew && !existing) {
      client.findQuizById(qid as string)
        .then(data => setQuiz(data))
        .catch(() => {});
    }
  }, []);

  const handleSave = async () => {
    try {
      if (isNew) {
        const saved = await client.createQuizForCourse(cid as string, { ...quiz, course: cid });
        dispatch(addQuiz(saved));
        router.push(`/Courses/${cid}/Quizzes/${saved._id}`);
      } else {
        const saved = await client.updateQuiz(quiz);
        dispatch(updateQuiz(saved));
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
        const saved = await client.createQuizForCourse(cid as string, { ...toSave, course: cid });
        dispatch(addQuiz(saved));
      } else {
        const saved = await client.updateQuiz(toSave);
        dispatch(updateQuiz(saved));
      }
    } catch {}
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => router.push(`/Courses/${cid}/Quizzes`);

  return (
    <div id="wd-quiz-details-editor" className="p-3">
      <div className="d-flex justify-content-end align-items-center mb-2 gap-3">
        <span className="text-muted">Points {quiz.points}</span>
        <span className={`badge ${quiz.published ? "bg-success" : "bg-secondary"}`}>
          {quiz.published ? "Published" : "Not Published"}
        </span>
      </div>

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active>Details</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => !isNew && router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)}
            disabled={isNew}>
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Form>
        <Form.Group className="mb-3">
          <FormControl placeholder="Quiz Title" value={quiz.title}
            onChange={e => setQuiz({ ...quiz, title: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quiz Instructions</Form.Label>
          <FormControl as="textarea" rows={6} placeholder="Quiz description/instructions"
            value={quiz.description}
            onChange={e => setQuiz({ ...quiz, description: e.target.value })} />
        </Form.Group>

        <table className="w-100"><tbody>
          <tr>
            <td align="right" className="pe-3 py-2" style={{ width: 220 }}>
              <Form.Label>Quiz Type</Form.Label>
            </td>
            <td className="py-2">
              <FormSelect value={quiz.quizType}
                onChange={e => setQuiz({ ...quiz, quizType: e.target.value })}>
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
              <FormSelect value={quiz.assignmentGroup}
                onChange={e => setQuiz({ ...quiz, assignmentGroup: e.target.value })}>
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
              <FormCheck label="Shuffle Answers" checked={quiz.shuffleAnswers}
                onChange={e => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1 d-flex align-items-center gap-2">
              <FormCheck label="Time Limit" checked={quiz.timeLimit > 0}
                onChange={e => setQuiz({ ...quiz, timeLimit: e.target.checked ? 20 : 0 })} />
              {quiz.timeLimit > 0 && (
                <>
                  <FormControl type="number" min={1} value={quiz.timeLimit} style={{ width: 80 }}
                    onChange={e => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })} />
                  <span>Minutes</span>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Allow Multiple Attempts" checked={quiz.multipleAttempts}
                onChange={e => setQuiz({ ...quiz, multipleAttempts: e.target.checked })} />
            </td>
          </tr>
          {quiz.multipleAttempts && (
            <tr>
              <td align="right" className="pe-3 py-1">
                <Form.Label>How Many Attempts</Form.Label>
              </td>
              <td className="py-1">
                <FormControl type="number" min={1} value={quiz.howManyAttempts} style={{ width: 80 }}
                  onChange={e => setQuiz({ ...quiz, howManyAttempts: parseInt(e.target.value) || 1 })} />
              </td>
            </tr>
          )}
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Show Correct Answers</Form.Label>
            </td>
            <td className="py-2">
              <FormControl value={quiz.showCorrectAnswers} placeholder="e.g. Immediately"
                onChange={e => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Access Code</Form.Label>
            </td>
            <td className="py-2">
              <FormControl value={quiz.accessCode} placeholder="Leave blank for no code"
                onChange={e => setQuiz({ ...quiz, accessCode: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="One Question at a Time" checked={quiz.oneQuestionAtATime}
                onChange={e => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Webcam Required" checked={quiz.webcamRequired}
                onChange={e => setQuiz({ ...quiz, webcamRequired: e.target.checked })} />
            </td>
          </tr>
          <tr>
            <td />
            <td className="py-1">
              <FormCheck label="Lock Questions After Answering" checked={quiz.lockQuestionsAfterAnswering}
                onChange={e => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })} />
            </td>
          </tr>

          <tr><td colSpan={2}><hr /></td></tr>

          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Due</Form.Label>
            </td>
            <td className="py-2">
              <FormControl type="date" value={quiz.dueDate}
                onChange={e => setQuiz({ ...quiz, dueDate: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Available from</Form.Label>
            </td>
            <td className="py-2">
              <FormControl type="date" value={quiz.availableDate}
                onChange={e => setQuiz({ ...quiz, availableDate: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td align="right" className="pe-3 py-2">
              <Form.Label>Until</Form.Label>
            </td>
            <td className="py-2">
              <FormControl type="date" value={quiz.untilDate}
                onChange={e => setQuiz({ ...quiz, untilDate: e.target.value })} />
            </td>
          </tr>

          <tr><td colSpan={2}><hr /></td></tr>
          <tr>
            <td colSpan={2} align="right">
              <Button variant="secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
              <Button variant="secondary" className="me-2" onClick={handleSave}>Save</Button>
              <Button variant="danger" onClick={handleSaveAndPublish}>Save & Publish</Button>
            </td>
          </tr>
        </tbody></table>
      </Form>
    </div>
  );
}
