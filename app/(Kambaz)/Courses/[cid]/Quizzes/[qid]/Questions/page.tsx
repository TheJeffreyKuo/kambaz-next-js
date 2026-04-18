"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Form, FormControl, FormSelect } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuestions, addQuestion, deleteQuestion, updateQuestion } from "./reducer";
import { addQuiz, updateQuiz as updateQuizAction, clearDraft } from "../../reducer";
import * as client from "../../client";
import * as coursesClient from "../../../../client";
import RichTextEditor from "../../RichTextEditor";

type QuestionType = "multiple_choice" | "true_false" | "fill_in_blank";

interface Choice { id: string; text: string; isCorrect: boolean; }
interface Question {
  _id: string; quiz: string; title: string; type: QuestionType;
  points: number; question: string;
  choices?: Choice[]; correctAnswer?: boolean; possibleAnswers?: string[];
}

function newQuestion(quizId: string): Question {
  return {
    _id: `new-${Date.now()}`, quiz: quizId, title: "New Question",
    type: "multiple_choice", points: 1, question: "",
    choices: [
      { id: "a", text: "", isCorrect: false },
      { id: "b", text: "", isCorrect: false },
    ],
  };
}

function MultipleChoiceEditor({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  const choices = q.choices || [];
  const setCorrect = (id: string) =>
    onChange({ ...q, choices: choices.map(c => ({ ...c, isCorrect: c.id === id })) });
  const setChoiceText = (id: string, text: string) =>
    onChange({ ...q, choices: choices.map(c => c.id === id ? { ...c, text } : c) });
  const addChoice = () =>
    onChange({ ...q, choices: [...choices, { id: `c-${Date.now()}`, text: "", isCorrect: false }] });
  const removeChoice = (id: string) =>
    onChange({ ...q, choices: choices.filter(c => c.id !== id) });
  return (
    <div>
      <p className="small text-muted">Enter your question and multiple answers, then select the one correct answer.</p>
      <div className="mb-3">
        <RichTextEditor value={q.question} onChange={(v) => onChange({ ...q, question: v })} placeholder="Question text" />
      </div>
      <strong>Answers:</strong>
      {choices.map(c => (
        <div key={c.id} className="d-flex align-items-start gap-2 mt-2">
          <Form.Check type="radio" name={`correct-${q._id}`} checked={c.isCorrect}
            onChange={() => setCorrect(c.id)} className="mt-2" />
          <FormControl as="textarea" rows={2}
            placeholder={c.isCorrect ? "Correct Answer" : "Possible Answer"}
            value={c.text} onChange={e => setChoiceText(c.id, e.target.value)}
            className={c.isCorrect ? "border-success" : ""} />
          <Button variant="outline-danger" size="sm" onClick={() => removeChoice(c.id)}>✕</Button>
        </div>
      ))}
      <Button variant="link" size="sm" className="mt-2 ps-0" onClick={addChoice}>+ Add Another Answer</Button>
    </div>
  );
}

function TrueFalseEditor({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  return (
    <div>
      <p className="small text-muted">Enter your question text, then select if True or False is the correct answer.</p>
      <div className="mb-3">
        <RichTextEditor value={q.question} onChange={(v) => onChange({ ...q, question: v })} placeholder="Question text" />
      </div>
      <strong>Answers:</strong>
      <div className="mt-2">
        <Form.Check type="radio" label="True" name={`tf-${q._id}`}
          checked={q.correctAnswer === true} onChange={() => onChange({ ...q, correctAnswer: true })} />
        <Form.Check type="radio" label="False" name={`tf-${q._id}`}
          checked={q.correctAnswer === false} onChange={() => onChange({ ...q, correctAnswer: false })} />
      </div>
    </div>
  );
}

function FillInBlankEditor({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  const answers = q.possibleAnswers || [];
  const setAnswer = (i: number, text: string) => {
    const updated = [...answers]; updated[i] = text;
    onChange({ ...q, possibleAnswers: updated });
  };
  const addAnswer = () => onChange({ ...q, possibleAnswers: [...answers, ""] });
  const removeAnswer = (i: number) =>
    onChange({ ...q, possibleAnswers: answers.filter((_, idx) => idx !== i) });
  return (
    <div>
      <p className="small text-muted">
        Enter your question text, then define all possible correct answers for the blank.
        Students will see the question followed by a small text box to type their answer.
      </p>
      <div className="mb-3">
        <RichTextEditor value={q.question} onChange={(v) => onChange({ ...q, question: v })} placeholder="Question text" />
      </div>
      <strong>Answers:</strong>
      {answers.map((a, i) => (
        <div key={i} className="d-flex align-items-start gap-2 mt-2">
          <span className="text-muted small mt-2" style={{ minWidth: 110 }}>Possible Answer</span>
          <FormControl as="textarea" rows={2} value={a} onChange={e => setAnswer(i, e.target.value)} />
          <Button variant="outline-danger" size="sm" onClick={() => removeAnswer(i)}>✕</Button>
        </div>
      ))}
      <Button variant="link" size="sm" className="mt-2 ps-0" onClick={addAnswer}>+ Add Another Answer</Button>
    </div>
  );
}

function QuestionEditor({
  question, onSave, onCancel,
}: {
  question: Question; onSave: (q: Question) => void; onCancel: () => void;
}) {
  const [q, setQ] = useState<Question>(question);
  const handleTypeChange = (type: QuestionType) => {
    const base = { ...q, type };
    if (type === "multiple_choice") {
      setQ({ ...base, choices: q.choices || [{ id: "a", text: "", isCorrect: false }], correctAnswer: undefined, possibleAnswers: undefined });
    } else if (type === "true_false") {
      setQ({ ...base, correctAnswer: true, choices: undefined, possibleAnswers: undefined });
    } else {
      setQ({ ...base, possibleAnswers: q.possibleAnswers || [""], choices: undefined, correctAnswer: undefined });
    }
  };
  return (
    <div className="border rounded p-3 mb-3 bg-white">
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <FormControl placeholder="Question Title" value={q.title}
          onChange={e => setQ({ ...q, title: e.target.value })} style={{ maxWidth: 200 }} />
        <FormSelect value={q.type} onChange={e => handleTypeChange(e.target.value as QuestionType)}
          style={{ maxWidth: 200 }}>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="true_false">True/False</option>
          <option value="fill_in_blank">Fill in the Blank</option>
        </FormSelect>
        <span className="ms-auto d-flex align-items-center gap-1">
          pts:
          <FormControl type="number" min={0} value={q.points}
            onChange={e => setQ({ ...q, points: parseInt(e.target.value) || 0 })}
            style={{ width: 70 }} />
        </span>
      </div>
      {q.type === "multiple_choice" && <MultipleChoiceEditor q={q} onChange={setQ} />}
      {q.type === "true_false" && <TrueFalseEditor q={q} onChange={setQ} />}
      {q.type === "fill_in_blank" && <FillInBlankEditor q={q} onChange={setQ} />}
      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={() => onSave(q)}>Update Question</Button>
      </div>
    </div>
  );
}

function QuestionPreview({ question, onEdit, onDelete }: { question: Question; onEdit?: () => void; onDelete?: () => void; }) {
  const typeLabel = question.type === "multiple_choice" ? "Multiple Choice"
    : question.type === "true_false" ? "True/False" : "Fill in the Blank";
  return (
    <div className="border rounded p-3 mb-3 bg-light d-flex justify-content-between align-items-start">
      <div style={{ minWidth: 0 }}>
        <strong>{question.title}</strong>
        <span className="text-muted small ms-2">({typeLabel})</span>
        {question.question && (
          <div className="mt-1 small" dangerouslySetInnerHTML={{ __html: question.question }} />
        )}
      </div>
      <div className="d-flex align-items-center gap-2 ms-3 flex-shrink-0">
        <span className="small">{question.points} pts</span>
        {onEdit && <Button variant="outline-secondary" size="sm" onClick={onEdit}>Edit</Button>}
        {onDelete && <Button variant="outline-danger" size="sm" onClick={onDelete}>✕</Button>}
      </div>
    </div>
  );
}

export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { questions } = useSelector((state: RootState) => state.questionsReducer);
  const { draft } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role?.toUpperCase() === "FACULTY";
  const isNew = qid === "new";
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      // Keep existing Redux state (draft questions from this new-quiz session).
      return;
    }
    dispatch(setQuestions([]));
    client.findQuestionsForQuiz(cid as string, qid as string)
      .then(data => dispatch(setQuestions(data || [])))
      .catch(() => {});
  }, [cid, qid, isNew]);

  const totalPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  const syncQuizMeta = async (nextQuestions: Question[]) => {
    if (isNew) return;
    const points = nextQuestions.reduce((s, q) => s + (q.points || 0), 0);
    const questionCount = nextQuestions.length;
    try {
      const saved = await client.updateQuiz({ _id: qid as string, points, questionCount });
      dispatch(updateQuizAction(saved && saved._id ? saved : { _id: qid, points, questionCount }));
    } catch {
      dispatch(updateQuizAction({ _id: qid, points, questionCount }));
    }
  };

  const handleNewQuestion = () => {
    const q = newQuestion(isNew ? "new" : (qid as string));
    dispatch(addQuestion(q));
    setEditingId(q._id);
  };

  const handleSaveQuestion = async (q: Question) => {
    const wasNew = q._id.startsWith("new-");
    let savedQuestion: Question = q;
    if (isNew) {
      // Defer backend persistence until the quiz itself is saved.
      dispatch(updateQuestion(q));
      setEditingId(null);
      return;
    }
    if (wasNew) {
      try {
        const saved = await client.createQuestionForQuiz(cid as string, qid as string, { ...q, _id: undefined });
        savedQuestion = saved;
        dispatch(deleteQuestion(q._id));
        dispatch(addQuestion(saved));
      } catch {
        dispatch(updateQuestion(q));
      }
    } else {
      try { await client.updateQuestion(q); } catch {}
      dispatch(updateQuestion(q));
    }
    setEditingId(null);
    const next = wasNew
      ? [...questions.filter((x: any) => x._id !== q._id), savedQuestion]
      : questions.map((x: any) => (x._id === savedQuestion._id ? savedQuestion : x));
    await syncQuizMeta(next as Question[]);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!isNew && !questionId.startsWith("new-")) {
      try { await client.deleteQuestion(questionId); } catch {}
    }
    dispatch(deleteQuestion(questionId));
    if (editingId === questionId) setEditingId(null);
    if (!isNew) {
      const next = questions.filter((x: any) => x._id !== questionId);
      await syncQuizMeta(next as Question[]);
    }
  };

  const defaultDraft = () => ({
    title: "Unnamed Quiz",
    course: cid,
    quizType: "GRADED_QUIZ",
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    oneQuestionAtATime: true,
    published: false,
  });

  const persistQueuedForNew = async (): Promise<{ createdId: string; allQs: any[] }> => {
    const seed = draft ? { ...draft, course: cid } : defaultDraft();
    const meta = { points: totalPoints, questionCount: questions.length };
    const created = await coursesClient.createQuizForCourse(cid as string, { ...seed, ...meta });
    const queued = (questions as any[]).filter((q: any) => String(q._id).startsWith("new-"));
    const saved: any[] = [];
    for (const q of queued) {
      try {
        const { _id: _discard, ...rest } = q;
        const c = await client.createQuestionForQuiz(cid as string, created._id, { ...rest, quiz: created._id });
        saved.push(c);
      } catch {}
    }
    const remaining = (questions as any[]).filter((q: any) => !String(q._id).startsWith("new-"));
    return { createdId: created._id, allQs: [...remaining, ...saved] };
  };

  const handleCancel = () => {
    if (isNew) {
      dispatch(clearDraft());
      dispatch(setQuestions([]));
      router.push(`/Courses/${cid}/Quizzes`);
    } else {
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    }
  };

  const handleSave = async () => {
    if (isNew) {
      try {
        const { createdId, allQs } = await persistQueuedForNew();
        const seed = draft ? { ...draft, course: cid } : defaultDraft();
        const finalMeta = { points: allQs.reduce((s: number, q: any) => s + (q.points || 0), 0), questionCount: allQs.length };
        const finalQuiz = { ...seed, _id: createdId, ...finalMeta };
        try { await client.updateQuiz(finalQuiz); } catch {}
        dispatch(addQuiz(finalQuiz));
        dispatch(setQuestions(allQs));
        dispatch(clearDraft());
        router.push(`/Courses/${cid}/Quizzes/${createdId}`);
      } catch {
        router.push(`/Courses/${cid}/Quizzes`);
      }
      return;
    }
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    if (isNew) {
      try {
        const { createdId, allQs } = await persistQueuedForNew();
        const seed = draft ? { ...draft, course: cid } : defaultDraft();
        const finalMeta = { points: allQs.reduce((s: number, q: any) => s + (q.points || 0), 0), questionCount: allQs.length };
        const finalQuiz = { ...seed, _id: createdId, ...finalMeta, published: true };
        try { await client.updateQuiz(finalQuiz); } catch {}
        try { await coursesClient.publishQuiz(createdId); } catch {}
        dispatch(addQuiz(finalQuiz));
        dispatch(setQuestions(allQs));
        dispatch(clearDraft());
      } catch {}
      router.push(`/Courses/${cid}/Quizzes`);
      return;
    }
    try {
      await coursesClient.publishQuiz(qid as string);
      dispatch(updateQuizAction({ _id: qid, published: true }));
    } catch {}
    router.push(`/Courses/${cid}/Quizzes`);
  };

  return (
    <div id="wd-quiz-questions-editor" className="p-3">
      <div className="d-flex justify-content-end mb-3">
        <span className="fw-bold">Points {totalPoints}</span>
      </div>
      {questions.length === 0 && (
        <p className="text-muted text-center py-4">No questions yet. Click &quot;+ New Question&quot; to add one.</p>
      )}
      {questions.map((q: Question) =>
        isFaculty && editingId === q._id ? (
          <QuestionEditor key={q._id} question={q}
            onSave={handleSaveQuestion} onCancel={() => setEditingId(null)} />
        ) : (
          <QuestionPreview key={q._id} question={q}
            onEdit={isFaculty ? () => setEditingId(q._id) : undefined}
            onDelete={isFaculty ? () => handleDeleteQuestion(q._id) : undefined} />
        )
      )}
      {isFaculty && (
        <div className="d-flex justify-content-center my-3">
          <Button variant="outline-secondary" onClick={handleNewQuestion}>+ New Question</Button>
        </div>
      )}
      <hr />
      <div className="d-flex gap-2 justify-content-end">
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        {isFaculty && (
          <>
            <Button variant="secondary" onClick={handleSave}>Save</Button>
            <Button variant="danger" onClick={handleSaveAndPublish}>Save &amp; Publish</Button>
          </>
        )}
      </div>
    </div>
  );
}
